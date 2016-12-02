'use strict'
/* eslint no-unused-expressions: [2, { allowShortCircuit: true }] */

// External modules
const request = require('request');
const _ = require('underscore');
const fs = require('fs');
const colors = require('colors');
const imageToAscii = require("image-to-ascii");
const imgcat = require('./imgcat.js');
const topicDict = require('../data/newsTopics.json');
const keys = require('../keys.json');

var bingSearchCLI = function() {
  function getNewsTopic(q) {
     return topicDict[q] || null;
  }

  function parseParams() {
     const queryPath = {
        'suggest': { pathSegment: 'Suggestions', callback: SuggestCallback, key: keys['autosuggest'] },
        'related': { pathSegment: 'search', callback: RelatedCallback, key: keys['search'], responseFilter: 'RelatedSearches' },
        'images': { pathSegment: 'images/search', callback: ImagesCallback, key: keys['search'] },
        'image': { pathSegment: 'images/search', callback: ImageCallback, key: keys['search'], count: 1 },
        'news': { pathSegment: 'news', callback: NewsCallback, key: keys['search'] },
        'search': { pathSegment: 'search', callback: SearchCallback, key: keys['search'] }
     }

     var targetCount = '5';
     var targetScale = null;
     var targetSafeSearch = 'strict';

     var params = process.argv.slice(2);

     if (params.indexOf('-c') >= 0) {
        let i = params.indexOf('-c'); targetCount = params[i+1]; params.splice(i, 2);
     }

     if (params.indexOf('-scale') >= 0) {
        let i = params.indexOf('-scale'); targetScale = parseFloat(params[i+1]); params.splice(i, 2);
     }

     if (params.indexOf('-unsafe') >= 0) {
        let i = params.indexOf('-unsafe'); targetSafeSearch = 'off'; params.splice(i, 1);
     }

     var queryType = 'search';
     if (_.has(queryPath, (params[0] || '').toLowerCase())) {
        queryType = params[0] || '';
        params = params.slice(1);
     }

     var qs = {};
     const qt = queryPath[queryType];
     var pathSegment = qt.pathSegment;
     var callback = qt.callback;

     var q = params.join(' ').trim();
     const query = q;

     if (queryType === 'news') {
        if (!q) {
           pathSegment = 'news/trendingtopics';
           callback = TrendingNewsCallback;
        }
        else {
           let category = getNewsTopic(q);
           if (category) {
              qs.category = category;
           }
           else {
             qs.q = q;
             pathSegment = 'news/search';
           }
        }
     }
     else {
        qs.q = q;
        qs.safeSearch = targetSafeSearch;
        qs.count = (qt.count || targetCount) + '';
        if (qt.responseFilter) {
           qs.responseFilter = qt.responseFilter;
        }
     }

     const apiKey = qt.key;
     return { queryType, pathSegment, query, apiKey, scale: targetScale, qs, callback }
  }

  var params = parseParams();

  var _q = params.query;
  var _queryType = params.queryType;
  var _category = params.qs.category || null;
  var _scale = params.scale || null;

  var qs = _.compact(_.map(params.qs, function(v, k) { return v ? `${k}=${v}` : ''; })).join('&');
  var url = `https://api.cognitive.microsoft.com/bing/v5.0/${params.pathSegment}?${qs}`;
  var options = { url: url, headers: {'Ocp-Apim-Subscription-Key': params.apiKey}}


  function ImageCallback(error, response, body) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      let url = _.pluck(info.value, 'thumbnailUrl')[0];
      if (url) {
        let opt = { scale: 1.0, log: true };
        if (_scale) { opt.scale = _scale };
        opt.fallback = function() {
           let widthPercentage = (49 * (_scale || 1)) + "%";
           imageToAscii(url, {size: {width: widthPercentage}, px_size: {width: 1, height: 1}}, (err, converted) => {
              console.log(err || converted);
           });
        };
        imgcat(url, opt).then(err => {
           console.log() 
        })
      }
    }
  }

  function ImagesCallback(error, response, body) {
    let urls = [];
    if (!error && response.statusCode == 200) {    
      var info = JSON.parse(body);    
      urls = _.pluck(info.value, 'thumbnailUrl');
      _.each(urls, function(url, i) {
        let opt = { width: "20%", height: "20%", log: true };
        if (_scale) { opt.scale = _scale };
        opt.fallback = function() {
           let widthPercentage = (49 * (_scale || 1)) + "%";
           //imageToAscii(url, {size: {height: 200, width: 200}, size_options: {fit_screen: true}}, (err, converted) => {
           imageToAscii(url, {size: {width: widthPercentage}, px_size: {width: 1, height: 1}}, (err, converted) => {
              console.log(err || converted);
           });
        };
        imgcat(url, opt).then(function() { console.log(); });;
     });
    }
  }

  function SearchCallback(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log();
      var info = JSON.parse(body).webPages.value;
      _.each(info, function(record, i) {
         let dt = new Date(record.dateLastCrawled);
         console.log(record.name.bold);
         console.log(`${record.displayUrl.underline.green}`);
         console.log(record.snippet.italic + '\t' + dt.toLocaleString().grey);
         console.log();
      });
      console.log();
    }
  }

  function SuggestCallback(error, response, body) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      //console.log(pd.json(info.suggestionGroups));
      console.log(); 
      _.each(info.suggestionGroups, function(record, i) {
         let name = record.name;
         if (name === 'Web') {
           console.log(name.bold);
           let terms = _.pluck(record.searchSuggestions, 'displayText')
           console.log(terms.join('\n').blue);
         }
      });
      console.log();
    }
  }

  function RelatedCallback(error, response, body) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      //console.log(pd.json(info));
      var relatedSearches = info.relatedSearches || {};
      if (_.size(relatedSearches.value) > 0) {
         console.log();
         console.log("Related Searches".bold);
         let terms = _.pluck(relatedSearches.value, 'displayText');
         console.log(terms.join('\n').blue);
      }
      console.log();
    }
  }

  function NewsCallback(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log();
      var info = JSON.parse(body);
      console.log(("News: " + (_category ? _category : _q).magenta).bold);
      _.each(info.value, function(record, i) {
         let dt = new Date(record.datePublished);
         let provider = _.pluck(record.provider || [], "name")[0] || "";
         let url = _.pluck(record.about || [], "readLink")[0] || "";
         console.log(`[${provider.blue}] ${record.name.bold}`);
         if (url) { console.log(url.underline.green); }
         console.log(record.description.italic + '  ' + dt.toLocaleString().grey);
         console.log();
      });
      console.log();
    }
  }

  function TrendingNewsCallback(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log();
      console.log("Trending News".bold);
      var info = JSON.parse(body).value;
      _.each(info, function(record, i) {
         let query = (record.query || {}).text || '';
         let line = [query, record.name].join(': ').blue;
         console.log(`${i+1}: ${line}`);
      });
      console.log();
    }
  }

  request(options, params.callback)
}

module.exports = bingSearchCLI;
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
const defaultKeys = require('../keys.json');


var initKeys = function(keys) {
  let newKeys = Object.assign({}, keys);
  if (process.env.BING_SEARCH_KEY) {
     newKeys.search = process.env.BING_SEARCH_KEY;
  }
  if (process.env.BING_AUTOSUGGEST_KEY) {
     newKeys.autosuggest = process.env.BING_AUTOSUGGEST_KEY;
  }
  if ((!newKeys.search) && (!newKeys.autosuggest)) {
     console.log();
     console.log('*** MISSING API KEYS ***');
     console.log('Visit https://www.microsoft.com/cognitive-services/en-us/subscriptions to subscribe to the Search and AutoSuggest API (free version).');
     console.log();
     console.log('Then set these in the environment variables in .bash_profile (or equivalent) as follows:');
     console.log('  export BING_SEARCH_KEY=<your key here>');
     console.log('  export BING_AUTOSUGGEST_KEY=<your key here>');
     console.log();
     console.log('Note: Be sure to restart the shell or source the profile.')
     console.log();
  }
  return newKeys;
}

var bingSearchCLI = function() {
  
  const keys = initKeys(defaultKeys);

  function getNewsTopic(q) {
     return topicDict[q] || null;
  }

  function parseParams() {
     const queryPath = {
        'suggest': { pathSegment: 'Suggestions', callback: SuggestCallback, key: keys['autosuggest'] },
        'related': { pathSegment: 'search', callback: RelatedCallback, key: keys['search'], responseFilter: 'RelatedSearches' },
        'images': { pathSegment: 'images/search', callback: ImagesCallback, key: keys['search'] },
        'image': { pathSegment: 'images/search', callback: ImageCallback, key: keys['search'], count: 1},
        'news': { pathSegment: 'news', callback: NewsCallback, key: keys['search'] },
        'search': { pathSegment: 'search', callback: SearchCallback, key: keys['search'] }
     }

     const imageTypes = {
        'line': 'Line',
        'clipart': 'Clipart',
        'art': 'Clipart',
        'photo': 'Photo',
        'gif': 'AnimatedGif',
        'product': 'Shopping'
     }

     const imageSizes = {
        'small': 'Small',
        'medium': 'Medium',
        'large': 'Large',
        'wallpaper': 'wallpaper',
        'all': 'All'
     }

     const imageContent = {
        'face': 'Face',
        'portrait': 'Portrait'
     }

     const imageAspect = {
        'square': 'Square',
        'wide': 'Wide',
        'tall': 'Tall',
        'all': 'All'
     }

     var targetCount = '5';
     var targetScale = null;
     var targetSafeSearch = 'strict';
     var targetImageType = null;
     var targetImageSize = null;
     var targetFullImage = false;
     var targetForceImageAscii = false;
     var targetAsciiFormat = '';
     var targetImageInvert = false;
     var targetImageBW = false;
     var targetImageGrey = false;
     var targetImageBGColor = '';
     var targetImageContent = '';
     var targetImageAspect = '';

     var params = process.argv.slice(2);

     if (params.indexOf('-version') >= 0) {
        let me = require('../package.json');
        let isObject = function(a) { return (!!a) && (a.constructor === Object); };
        var author =  isObject(me.author) ? `${me.author.name} <${me.author.email}>` : me.author;
        console.log();      
        console.log(`Bing-CLI v${me.version} by ${author}`);
        console.log();
        process.exit(0);
     }

     if (params.indexOf('-c') >= 0) {
        let i = params.indexOf('-c'); targetCount = params[i+1]; params.splice(i, 2);
     }

     if (params.indexOf('-scale') >= 0) {
        let i = params.indexOf('-scale'); targetScale = parseFloat(params[i+1]); params.splice(i, 2);
     }

     if (params.indexOf('-unsafe') >= 0) {
        let i = params.indexOf('-unsafe'); targetSafeSearch = 'off'; params.splice(i, 1);
     }

     if (params.indexOf('-ascii') >= 0) {
        let i = params.indexOf('-ascii'); targetForceImageAscii = true; params.splice(i, 1);
     }

     if (params.indexOf('-blocks') >= 0) {
        let i = params.indexOf('-blocks'); targetAsciiFormat = 'blocks'; params.splice(i, 1);
     }

     if (params.indexOf('-pixels') >= 0) {
        let i = params.indexOf('-pixels'); targetAsciiFormat = 'pixels'; params.splice(i, 1);
     }

     if (params.indexOf('-invert') >= 0) {
        let i = params.indexOf('-invert'); targetImageInvert = true; params.splice(i, 1);
     }

     if (params.indexOf('-bw') >= 0) {
        let i = params.indexOf('-bw'); targetImageBW = true; params.splice(i, 1);
     }

     if (params.indexOf('-grey') >= 0) {
        let i = params.indexOf('-grey'); targetImageGrey = true; params.splice(i, 1);
     }

     if (params.indexOf('-bg') >= 0) {
        let i = params.indexOf('-bg'); targetImageBGColor = (params[i+1]||'').toLowerCase().trim(); params.splice(i, 2);
     }

     if (params.indexOf('-full') >= 0) {
        let i = params.indexOf('-full'); targetFullImage = true; params.splice(i, 1);
     }

     if (params.indexOf('-type') >= 0) {
        let i = params.indexOf('-type'); targetImageType = (params[i+1]||'').toLowerCase().trim(); params.splice(i, 2);
        targetImageType = imageTypes[targetImageType];
     }

     if (params.indexOf('-size') >= 0) {
        let i = params.indexOf('-size'); targetImageSize = (params[i+1]||'').toLowerCase().trim(); params.splice(i, 2);
        targetImageSize = imageSizes[targetImageSize];
     }

     if (params.indexOf('-content') >= 0) {
        let i = params.indexOf('-content'); targetImageContent = (params[i+1]||'').toLowerCase().trim(); params.splice(i, 2);
        targetImageContent = imageContent[targetImageContent];
     }

     if (params.indexOf('-aspect') >= 0) {
        let i = params.indexOf('-aspect'); targetImageAspect = (params[i+1]||'').toLowerCase().trim(); params.splice(i, 2);
        targetImageAspect = imageAspect[targetImageAspect];
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
        qs.headlineCount = (qt.count || targetCount) + '';
     }
     else {
        qs.q = q;
        qs.safeSearch = targetSafeSearch;
        qs.count = (qt.count || targetCount) + '';
        if (qt.responseFilter) {
           qs.responseFilter = qt.responseFilter;
        }
        if (targetImageType) { qs.imageType = targetImageType; }
        if (targetImageSize) { qs.size = targetImageSize; }
     }

    const apiKey = qt.key;
    const result = { 
      queryType, 
      pathSegment, 
      query, 
      apiKey,
      image: {
        scale: targetScale, 
        thumbnail: !targetFullImage,
        ascii: targetForceImageAscii,
        format: targetAsciiFormat,
        invert: targetImageInvert,
        bw: targetImageBW,
        grey: targetImageGrey,
        bgColor: targetImageBGColor
      },
      qs,
      callback
    }
     
     return result;
  }

  var params = parseParams();
  var _params = params;

  var _q = params.query;
  var _queryType = params.queryType;
  var _category = params.qs.category || null;
  var _scale = params.scale || null;

  var qs = _.compact(_.map(params.qs, function(v, k) { return v ? `${k}=${v}` : ''; })).join('&');
  var url = `https://api.cognitive.microsoft.com/bing/v5.0/${params.pathSegment}?${qs}`;
  var options = { url: url, headers: {'Ocp-Apim-Subscription-Key': params.apiKey}}
  //console.log(url);


  function resolveUrl(url) {
     var resolved = url;
     if ((url.indexOf('http://www.bing.') == 0) || (url.indexOf('https://www.bing.') == 0)) {
        var durl = decodeURIComponent(url).split('?')[1].split('&');
        for (var k = 0; k < durl.length; k++) {
          if (durl[k].indexOf('r=') == 0) {
            resolved = durl[k].slice(2);
            break;
          }
        }
      }
      return resolved;
  }

  function handleResponse(error, response) {
    let resolved = true;
    if (error) {
      console.log(error);
      resolved = false;
    }
    else if (response.statusCode === 401) {
      console.log('The API keys have expired. Please request new keys.');
      resolved = false;
    }
    return resolved;
  }

  function parseColor(color) {
    let rgb = { r: 255, g: 255, b: 255 }
    try {
      let hex = null;
      if (color === 'black') {
        rgb = { r: 0, g: 0, b: 0 }      
      }
      else if (color.length === 3) {
        hex = color.split('');
      }
      else if (color.length === 6) {
        hex = [color.slice(0, 2), color.slice(2, 4), color.slice(4, 6)];
      }
      if (hex) {
        rgb.r = parseInt(hex[0], 16);
        rgb.g = parseInt(hex[1], 16);
        rgb.b = parseInt(hex[2], 16);
        if (color.length === 3) { rgb.r *= 16; rgb.g *= 16; rgb.b *= 16; }
      }
    }
    catch(e) {      
    }
    return rgb;
  }

  function ImageDisplayHandlerAscii(url, name, retryHandler, altUrl, cb) {
    //console.log(`Displaying: ${url}`);
    /*
      pixels (Array|String): An array or string containing the characters used for converting the pixels in strings (default: " .,:;i1tfLCG08@").
      reverse (Boolean): If true, the pixels will be reversed creating a negative image effect (default: false).
      colored (Boolean): If true, the output will contain ANSI styles (default: true).
      bg (Boolean): If true, the background color will be used for coloring (default: false).
      fg (Boolean): If true, the foreground color will be used for coloring (default: true).
      white_bg (Boolean): Turn on the white background for transparent pixels (default: true).
      px_background (Object): An object containing the r (red), g (green) and b (blue) values of the custom background color.    
    */
    let widthPercentage = (49 * (_params.image.scale || 1)) + "%";
    let opt = { size: { width: widthPercentage}, px_size: {width: 1, height: 1}, pixels: ' .,:;i1tfLCG08@', colored: true, white_bg: false }
    if (_params.image.format == 'blocks') {
      opt.colored = true; opt.bg = true; opt.white_bg = false; opt.fg = false; 
    }
    else if (_params.image.format == 'pixels') {
      opt.colored = true; opt.bg = true; opt.white_bg = false; opt.fg = true; 
    }
    if (_params.image.invert) {
      opt.reverse = true; 
    }
    if (_params.image.bw) {
      opt.colored = false;
      opt.pixels = ' ██████████████';
    }
    if (_params.image.grey) {
      opt.colored = false; 
      if (_params.image.format == 'blocks' || _params.image.format == 'pixels') { 
        opt.pixels = ' ░░░▒▒▒▓▓▓█████'; 
      }
    }
    if (_params.image.bgColor) { opt.px_background = parseColor(_params.image.bgColor); opt.white_bg = false; }

    imageToAscii(url, opt, 
      (err, converted) => { 
        if (err) {
          if (retryHandler) {
            retryHandler(altUrl, name, null, null, cb);
          }
          else {
            cb(err);
          }
        }
        else {
          console.log(converted);
          cb(null);
        }
    });
  }

  function ImageDisplayHandlerInline(url, name, retryHandler, altUrl, cb) {
    if (url) {
      let opt = { scale: 1.0, log: true };
      if (_params.image.scale) { opt.scale = _params.image.scale };
      opt.fallback = function() {
        ImageDisplayHandlerAscii(url, name, retryHandler, altUrl, cb);
      };

      imgcat(url, opt)
      .then(function() { cb(null); })
      .catch(function(err) {
        if (!err) {
          cb(null);
        }
        else {
          console.log(err);
          if (retryHandler) {
             retryHandler(altUrl, name, null, null, cb);
          }
          else {
            cb(err);
          }
        }
      });
    }
  }


  function ImageCallback(error, response, body) {
    var x = 0;
    if (!error && response.statusCode == 200) {
      var useThumbail = _params.image.thumbnail;
      var info = JSON.parse(body);
      let contentUrl = _.pluck(info.value, 'contentUrl')[0] || '';
      contentUrl = resolveUrl(contentUrl);
      let url = _.pluck(info.value, 'thumbnailUrl')[0];
      let name = _.pluck(info.value, 'name')[0];
      if (contentUrl && url) {
        var url1 = !useThumbail ? contentUrl : url;
        var url2 = !useThumbail ? url: null;
        var renderFunction = _params.image.ascii ? ImageDisplayHandlerAscii : ImageDisplayHandlerInline;        
        var retryHandler = !useThumbail ? renderFunction : null;
        renderFunction(url1, name, retryHandler, url2, function(err) {
        });
      }
    }
  }

  function ImagesCallback(error, response, body) {
    var x = 0;
    if (!error && response.statusCode == 200) {    
      var info = JSON.parse(body);
      console.log();
      console.log(`Image Search Results: ${_q}`.inverse);
      console.log();
      //console.log(require('pretty-data').pd.json(info));
      let urls = _.pluck(info.value, 'thumbnailUrl');
      let names = _.pluck(info.value, 'name');
      _.each(urls, function(url, i) {
        let opt = { width: "20%", height: "20%", log: true };
        if (_params.image.scale) { opt.scale = _params.image.scale };
        opt.fallback = function() {
           let widthPercentage = (49 * (_params.image.scale || 1)) + "%";
           //imageToAscii(url, {size: {height: 200, width: 200}, size_options: {fit_screen: true}}, (err, converted) => {
           imageToAscii(url, {size: {width: widthPercentage}, px_size: {width: 1, height: 1}}, (err, converted) => {
              console.log(err || converted);
           });
        };
        imgcat(url, opt).then(function() { var z = x; var msg = names[z]; console.log(`${++x}: ${msg}`.bold); console.log(); });;
     });
    }
  }

  function SearchCallback(error, response, body) {
    if (handleResponse(error, response)) {
      console.log();
      console.log("Search Results".inverse);
      var info = JSON.parse(body).webPages.value;
      _.each(info, function(record, i) {
         var url = resolveUrl(record.url);
         let dt = new Date(record.dateLastCrawled);
         console.log(`${i+1}: ${record.name}`.bold);
         console.log(`${url.underline}`); // green
         console.log(record.snippet.italic + ' ' + `@${dt.toLocaleString()}`.grey);
         console.log();
      });
    }
  }

  function SuggestCallback(error, response, body) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      //console.log(pd.json(info.suggestionGroups));
      console.log(); 
      console.log("AutoSuggest".inverse);
      _.each(info.suggestionGroups, function(record, i) {
         let name = record.name;
         if (name === 'Web') {
           _.each(record.searchSuggestions, function(line, i) {
             console.log(`${i+1}: ${line.displayText}`.bold);
           })
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
         console.log("Related Searches".inverse);
         _.each(relatedSearches.value, function(line, i) {
           console.log(`${i+1}: ${line.displayText}`.bold);
         })
      }
      console.log();
    }
  }

  function NewsCallback(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log();
      var info = JSON.parse(body);
      console.log(("News: " + (_category ? _category : _q)).inverse);
      _.each(info.value, function(record, i) {
         let dt = new Date(record.datePublished);
         let provider = _.pluck(record.provider || [], "name")[0] || "";
         let original_url = record.url || '';
         let url = resolveUrl(original_url);
         console.log(`${i+1}: [${provider}] ${record.name}`.bold);
         if (url) { console.log(url.underline); }
         console.log(`${record.description.italic} ` + `@${dt.toLocaleString()}`.dim);
         console.log();
      });
      console.log();
    }
  }

  function TrendingNewsCallback(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log();
      console.log("Trending News".inverse);
      var info = JSON.parse(body).value;
      _.each(info, function(record, i) {
         let query = (record.query || {}).text || '';
         let line = [query, record.name].join(': ');
         console.log(`${i+1}: ${line}`.bold);
      });
      console.log();
    }
  }

  request(options, params.callback)
}

module.exports = bingSearchCLI;

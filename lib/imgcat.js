'use strict'
/* eslint no-unused-expressions: [2, { allowShortCircuit: true }] */

const path = require('path')
const co = require('co')
const tempFile = require('tempfile')
const isUrl = require('is-url')
const pget = require('pget')
const imageInfo = require('image-info');

const termImg = require('./iterm.js')


module.exports = co.wrap(function* (file, options, events) {
  // Handler function used in pre-rendering for the imgcat() function below. Implements image scaling as an option.
  const preImgCatRenderHandler = function(ctx, cb) {
    let newOpts = Object.assign({}, ctx.opts);
    if (newOpts.scale && ctx.imagePath) {
      imageInfo(ctx.imagePath, (err, info) => {
        if (!err) {
          newOpts.width = Math.round(info.width * newOpts.scale, 0) + 'px';
          newOpts.height = Math.round(info.height * newOpts.scale, 0) + 'px';
        }
        cb && cb(err, ctx.img, newOpts);
      });
    }
    else {
      cb && cb(null, ctx.img, newOpts);
    }
  }

  const on = events || {}
  options.preRender = preImgCatRenderHandler
  on.before && on.before()
  let tempPath
  let image
  if (isUrl(file)) {
    tempPath = tempFile()
    const dir = path.dirname(tempPath)
    const target = path.basename(tempPath)
    on.beforeDownload && on.beforeDownload()
    yield pget(file, {dir, target, quiet: true})
    on.afterDownload && on.afterDownload()
    image = termImg(tempPath, options)
  } else {
    image = termImg(file, options)
  }
  on.after && on.after()
  return image
})

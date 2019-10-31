const imgcat = require('./lib/imgcat.js');
let url = process.argv[2];

function render(url, name, retryHandler, altUrl, cb) {
    if (url) {
      let opt = { scale: 1.0, log: true };

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


render(url, 'content', () => console.log('Could not render'), url, () => console.log('done'));

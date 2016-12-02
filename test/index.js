var expect = require('expect.js'),
    bingCli = require('..');

describe('bing-cli', function() {
  it('should say hello', function(done) {
    expect(bingCli()).to.equal('Hello, world');
    done();
  });
});

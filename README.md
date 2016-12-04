# bing-cli

[![Join the chat at https://gitter.im/bing-cli/Lobby](https://badges.gitter.im/bing-cli/Lobby.svg)](https://gitter.im/bing-cli/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
Bing Search CLI with support for Web, News, Related Items, AutoSuggest, and Images. Images are displayed inline in the terminal for iterm2 users (Mac) and in colorized ASCII output.

Note: This project is not affiliated with Microsoft Corporation

[![build status](https://secure.travis-ci.org/scottbea/bing-cli.png)](http://travis-ci.org/scottbea/bing-cli) [![npm version](https://badge.fury.io/js/bing-cli.svg)](https://badge.fury.io/js/bing-cli) [![License](http://img.shields.io/:license-mit-blue.svg)](http://doge.mit-license.org) [![dependency Status](https://david-dm.org/scottbea/bing-cli.svg?style=flat)](https://david-dm.org/scottbea/bing-cli) [![devDependency Status](https://david-dm.org/scottbea/bing-cli/dev-status.png?style=flat)](https://david-dm.org/scottbea/bing-cli?type=dev)

## Installation

This module is installed via npm:

``` bash
$ npm install bing-cli -g
```


## Usage
This package is meant to be used as a command-line tool.

``` js
$ bing puff the magic dragon
$ bing -c 3 "sql server on linux"
$ bing images famous people
$ bing image yosemite
$ bing news
$ bing news politics
$ bing news azure aws google cloud
$ bing related apache spark
$ bing suggest gaussi
```


## Development

### Testing

```
npm test
```

### Bugs

Please report any bugs [here](https://github.com/scottbea/bing-cli/issues).

### Changelog

Available [here](https://github.com/scottbea/bing-cli/CHANGELOG.md).

## Credits

This library is using Microsoft's Cognitive Services APIs for Bing Search queries.

## License

MIT.

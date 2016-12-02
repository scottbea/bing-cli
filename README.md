# bing-cli

Bing Search CLI with support for Web, News, Related Items, AutoSuggest, and Images. Images are displayed inline in the terminal for iterm2 users (Mac) and in colorized ASCII output.

Note: This project is not affiliated 

[![build status](https://secure.travis-ci.org/scottbea/bing-cli.png)](http://travis-ci.org/scottbea/bing-cli)

## Installation

This module is installed via npm:

``` bash
$ npm install bing-cli -g
```

## Example Usage

``` js
var bingCli = require('bing-cli');
```

## Example CLI Usage

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



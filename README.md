# bing-cli

Bing Search CLI with support for Web, News, Related Items, AutoSuggest, and Images. Images are displayed inline in the terminal for iterm2 users (Mac) and in colorized ASCII output.

Note: This project is not affiliated with Microsoft Corporation

[![Join the chat at https://gitter.im/bing-cli/Lobby](https://badges.gitter.im/bing-cli/Lobby.svg)](https://gitter.im/bing-cli/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![build status](https://secure.travis-ci.org/scottbea/bing-cli.png)](http://travis-ci.org/scottbea/bing-cli) [![npm version](https://badge.fury.io/js/bing-cli.svg)](https://badge.fury.io/js/bing-cli) [![License](http://img.shields.io/:license-mit-blue.svg)](http://doge.mit-license.org) [![dependency Status](https://david-dm.org/scottbea/bing-cli.svg?style=flat)](https://david-dm.org/scottbea/bing-cli) [![devDependency Status](https://david-dm.org/scottbea/bing-cli/dev-status.png?style=flat)](https://david-dm.org/scottbea/bing-cli?type=dev)

## Installation

This module is installed via npm:

``` bash
$ npm install bing-cli -g
```

## Setup
Bing-CLI requires API keys from Microsoft Cognitive Services to work. Currently, this only works when the API keys are exported as environment variables. It is recommended you add something like this to your .bash_profile or equivalent shell init script:

``` shell
export BING_SEARCH_KEY=<your key here>
export BING_AUTOSUGGEST_KEY=<your key here>
```

Additional options are planned, including an `-init` command, support for .mscredentials file, and other options.


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

## Registering for Services
To get your API keys, you will need to sign up for Microsoft Congnitive Services by creating a new account with an email, or by signing up with your GitHub or LinkedIn account.

Once you do this, you can visit [subscriptions](https://www.microsoft.com/cognitive-services/en-us/subscriptions) to subscrbe to free-tier of service usage which is more than enough for personal use. There are many services available to sign up for, but the service APIs required for this module are:

- Bing Search - Free
- Bing Autosuggest - Free 

Once you subscribe, you can then click the Show link to reveal the API keys. Then copy these keys and put them in the exports for the .bash_profile (as mentioned above).

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

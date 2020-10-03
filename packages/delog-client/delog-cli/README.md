<p align="center">
    <img src="https://raw.githubusercontent.com/plurid/delog/master/about/identity/delog-logo.png" height="250px">
    <br />
    <br />
    <a target="_blank" href="https://github.com/plurid/delog/blob/master/LICENSE">
        <img src="https://img.shields.io/badge/license-MIT-blue.svg?colorB=1380C3&style=for-the-badge" alt="License: MIT">
    </a>
</p>



<h1 align="center">
    delog command-line interface
</h1>


<h3 align="center">
    Cloud-Native Logger
</h3>


delog is a service or self-hosted logger

Specialized support for the runtimes:

+ `NodeJS`

delog uses [plurid](https://github.com/plurid/plurid) to explore information as a 3D structure.


<p align="center">
    <img src="https://raw.githubusercontent.com/plurid/delog/master/about/screenshots/screenshot-1.png" height="500px">
</p>



### Contents

+ [About](#about)
+ [Install](#install)
+ [Usage](#usage)
+ [Packages](#packages)



## About

`Delog` acts as a central logging center. Once configured with a `token`, the `delog` client can point to the network `endpoint`, passing the `token`.

`Delog` can also function as a log-based tester. The `delog` client is set in the testing mode and a `delog` client call will trigger a `tester` in the `delog` endpoint.



## Install

To install the `CLI` ensure that the [`NodeJS`](https://nodejs.org) runtime is installed.

```
npm install -g @plurid/delog-cli
```



## Usage

```
Usage: delog <command>

Options:
  -v, --version     output the version number
  -h, --help        display help for command

Commands:
  status            show the connection status
  login [options]   log into a delog server using the identonym and the key
  logout [options]  log out of a delog server, default or specified
  setup [options]   setup the configuration for a delog server
  record [options]  record to the delog server, default or specified
```



## Packages

<a target="_blank" href="https://www.npmjs.com/package/@plurid/delog-server">
    <img src="https://img.shields.io/npm/v/@plurid/delog-server.svg?logo=npm&colorB=1380C3&style=for-the-badge" alt="Version">
</a>

[@plurid/delog-server][delog-server] • the server application

[delog-server]: https://github.com/plurid/delog/tree/master/packages/delog-server


<a target="_blank" href="https://www.npmjs.com/package/@plurid/delog-cli">
    <img src="https://img.shields.io/npm/v/@plurid/delog-cli.svg?logo=npm&colorB=1380C3&style=for-the-badge" alt="Version">
</a>

[@plurid/delog-client-cli][delog-client-cli] • the `Command-Line Interface` client

[delog-client-cli]: https://github.com/plurid/delog/tree/master/packages/delog-client/delog-cli


<a target="_blank" href="https://www.npmjs.com/package/@plurid/delog">
    <img src="https://img.shields.io/npm/v/@plurid/delog.svg?logo=npm&colorB=1380C3&style=for-the-badge" alt="Version">
</a>

[@plurid/delog-client-javascript][delog-client-javascript] • the `JavaScript` client

[delog-client-javascript]: https://github.com/plurid/delog/tree/master/packages/delog-client/delog-javascript


<a target="_blank" href="https://pypi.org/project/delog">
    <img src="https://img.shields.io/pypi/v/delog.svg?logo=npm&colorB=1380C3&style=for-the-badge" alt="Version">
</a>

[@plurid/delog-client-python][delog-client-python] • the `Python` client

[delog-client-python]: https://github.com/plurid/delog/tree/master/packages/delog-client/delog-python

<p align="center">
    <img src="https://raw.githubusercontent.com/plurid/delog/master/about/identity/delog-logo.png" height="250px">
    <br />
    <br />
    <a target="_blank" href="https://github.com/plurid/delog/blob/master/LICENSE">
        <img src="https://img.shields.io/badge/license-MIT-blue.svg?colorB=1380C3&style=for-the-badge" alt="License: MIT">
    </a>
</p>



<h1 align="center">
    delog
</h1>


<h3 align="center">
    Cloud-Native Logger
</h3>


delog is a service or self-hosted logger

Specialized support for the runtimes:

+ `NodeJS`
+ `Python`

delog uses [plurid](https://github.com/plurid/plurid) to explore information as a 3D structure.


<p align="center">
    <img src="https://raw.githubusercontent.com/plurid/delog/master/about/screenshots/screenshot-1.png" height="500px">
</p>



### Contents

+ [About](#about)
+ [Packages](#packages)



## About

`Delog` acts as a central logging center. Once configured with a `token`, the `delog` client can point to the network `endpoint`, passing the `token`.

`Delog` can also function as a log-based tester. The `delog` client is set in the testing mode and a `delog` client call will trigger a `tester` in the `delog` endpoint.



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

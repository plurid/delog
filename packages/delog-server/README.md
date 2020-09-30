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

delog uses [plurid](https://github.com/plurid/plurid) to explore information as a 3D structure.


<p align="center">
    <img src="https://raw.githubusercontent.com/plurid/delog/master/about/screenshots/screenshot-1.png" height="500px">
</p>



### Contents

+ [Building](building)
+ [Testing](testing)
+ [Packages](#packages)



## Building

```
docker build \
    -t delog-server \
    -f ./configurations/production.dockerfile \
    --build-arg PORT= \
    --build-arg DELOG_ENDPOINT_GRAPHQL= \
    --build-arg DELOG_DATABASE_TYPE= \
    --build-arg DELOG_LOG_LEVEL= \
    --build-arg DELOG_QUIET= \
    --build-arg DELOG_CUSTOM_LOGIC_USAGE= \
    --build-arg DELOG_PRIVATE_USAGE= \
    --build-arg DELOG_PRIVATE_OWNER_IDENTONYM= \
    --build-arg DELOG_PRIVATE_OWNER_KEY= \
    --build-arg DELOG_PRIVATE_TOKEN= \
    --build-arg DELOG_MONGO_USERNAME= \
    --build-arg DELOG_MONGO_PASSWORD= \
    --build-arg DELOG_MONGO_ADDRESS= \
    --build-arg DELOG_MONGO_CONNECTION_STRING= \
    --build-arg DELOG_TEST_MODE=false \
    .
```

Run the container with `--network="host"` if running the database on the same host.

```
docker run \
    --network="host" \
    -d delog-server
```

Or run on a custom port (`8855`)

```
docker run \
    -d -p 8855:56965 \
    delog-server
```



## Testing

The `delog server` can use MongoDB as a database. For testing purposes, mongo can run in a docker container.

```
docker pull mongo
```

```
docker run -d --name mongo-delog \
    -p 56966:27017 -e MONGO_INITDB_ROOT_USERNAME=admin \
    -e MONGO_INITDB_ROOT_PASSWORD=1234 mongo
```

Connect to the mongo instance with

```
mongodb://admin:1234@localhost:56966/?authSource=admin
```

to verify the connection.



## Packages

<a target="_blank" href="https://www.npmjs.com/package/@plurid/delog-server">
    <img src="https://img.shields.io/npm/v/@plurid/delog-server.svg?logo=npm&colorB=1380C3&style=for-the-badge" alt="Version">
</a>

[@plurid/delog-server][delog-server] • the server application

[delog-server]: https://github.com/plurid/delog/tree/master/packages/delog-server


<a target="_blank" href="https://www.npmjs.com/package/@plurid/delog">
    <img src="https://img.shields.io/npm/v/@plurid/delog.svg?logo=npm&colorB=1380C3&style=for-the-badge" alt="Version">
</a>

[@plurid/delog-client-javascript][delog-client-javascript] • the `JavaScript` client

[delog-client-javascript]: https://github.com/plurid/delog/tree/master/packages/delog-client/delog-javascript

# fastify-mongodb

Fastify MongoDB connection plugin

## Install

```
$ npm install @trubavuong/fastify-mongodb
```

## Usage

```
const fastify = require('fastify');
const plugin = require('@trubavuong/fastify-mongodb');

const app = fastify();
app.register(plugin, {
  name: 'mongo',                    // optional, custom property name, default 'mg'
  url: 'mongodb://localhost:27017', // required, endpoint
  options: {},                      // optional, connection options
  database: 'example',              // required, database name
  collections: {                    // optional, alias - collection name map
    UserCollection: 'user',
  },
});

// later you can use app.mongo in your routes
// - app.mongo.client         // MongoDB client object
// - app.mongo.db             // MongoDB database
// - app.mongo.UserCollection // MongoDB collection alias, same as defined in constructor
```

The `options` object which is passed to plugin will be used to create [MongoManager](https://github.com/trubavuong/mongodb#constructor) instance.

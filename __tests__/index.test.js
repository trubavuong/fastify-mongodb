const fastify = require('fastify');

const plugin = require('../lib/index');

describe('index.js', () => {
  describe('plugin', () => {
    test('should fail when there is no mongodb configuration', async () => {
      const app = fastify();
      app.register(plugin, {
        name: 'abc',
      });
      await expect(app.ready).rejects.toThrow('URI malformed');
    });

    test('should fail when invalid mongodb configuration', async () => {
      const app = fastify();
      app.register(plugin, {
        name: 'abc',
        url: 'http://localhost:6666',
        database: process.env.MONGODB_DB,
        collections: {
          UserCollection: 'user',
        },
      });
      await expect(app.ready).rejects.toThrow('Invalid connection string');
    });

    test('should fail when name already registered', async () => {
      const app = fastify();
      app.register(plugin, {
        name: 'register',
        url: process.env.MONGODB_URL,
        database: process.env.MONGODB_DB,
        collections: {
          UserCollection: 'user',
        },
      });
      await expect(app.ready).rejects.toThrow('fastify.register already registered');
    });

    test('should success with default name mg', async () => {
      const app = fastify();
      app.register(plugin, {
        url: process.env.MONGODB_URL,
        database: process.env.MONGODB_DB,
        collections: {
          UserCollection: 'user',
        },
      });
      await app.ready();
      expect(app.mg).toHaveProperty('UserCollection');

      await app.close();
    });

    test('should success with custom name', async () => {
      const app = fastify();
      app.register(plugin, {
        name: 'hello',
        url: process.env.MONGODB_URL,
        database: process.env.MONGODB_DB,
        collections: {
          UserCollection: 'user',
        },
      });
      await app.ready();
      expect(app.mg).toBeUndefined();
      expect(app.hello).toHaveProperty('UserCollection');

      await app.close();
    });

    test('should close connection when server close', async () => {
      const app = fastify();
      app.register(plugin, {
        url: process.env.MONGODB_URL,
        database: process.env.MONGODB_DB,
        collections: {
          UserCollection: 'user',
        },
      });
      await app.ready();

      const spy = jest.spyOn(app.mg, 'close');

      await app.close();
      expect(spy).toHaveBeenCalledTimes(1);

      spy.mockRestore();
    });
  });
});

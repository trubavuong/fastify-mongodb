const fp = require('fastify-plugin');
const { MongoManager } = require('@trubavuong/mongodb');

const plugin = fp(async (fastify, {
  name = 'mg',
  ...options
}) => {
  const manager = new MongoManager(options);

  if (fastify[name]) {
    throw new Error(`fastify.${name} already registered`);
  }

  fastify.decorate(name, manager);

  fastify.addHook('onClose', () => manager.close());

  await manager.connect();
});

module.exports = plugin;

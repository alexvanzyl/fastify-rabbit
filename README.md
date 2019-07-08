# fastify-rabbit

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)

Fastify RabbitMQ connection plugin, this is a convenience wrapper around [amqplib](https://github.com/squaremo/amqp.node) library.

## Install
```
npm i fastify-rabbit --save
```

## Usage
```js
const fastify = require('fastify')()

// Register plugin
fastify.register(require('fastify-rabbit'), {
  url: 'amqp://localhost'
})

// Publish message to queue
fastify.get('/', async function (req, reply) {
  const channel = this.rabbit.channel

  // Create queue if it does not exist
  const ok = await channel.assertQueue('hello')
  if (!ok) {
    // handle failed to assert queue
  }

  // Push message to queue 
  try {
    await channel.sendToQueue('hello', Buffer.from('The is my message to you...'))
    reply.send('Message sent!')
  } catch (err) {
    reply.log.error(err)
  }
})

// Consume messages from queue
fastify.register(async function(fastify, opts) {
  const channel = fastify.rabbit.channel

  // Create queue if it does not exist
  const ok = await channel.assertQueue('hello')
  if (ok) {
    // start consuming queue
     channel.consume('hello', msg => {
      fastify.log.info(msg.content.toString())
      channel.ack(msg)
    })
  }
}) 
```

## Using connection object
You can also connect using an object instead of an url, like so:
```js
fastify.register(require('fastify-rabbit'), {
  protocol: 'amqp',
  hostname: 'localhost',
  port: 5672,
  username: 'guest',
  password: 'guest',
  locale: 'en_US',
  frameMax: 0,
  heartbeat: 0,
  vhost: '/'
})
```

## Reference
This plugin decorates the `fastify` instance with a `rabbit` object. That object has the
following properties:

- `conn` - reference to the [amqplib connection object](http://www.squaremobius.net/amqp.node/channel_api.html#models)
- `channel` - reference to the [amqplib channel](http://www.squaremobius.net/amqp.node/channel_api.html#channel)

## Running tests
To run tests RabbitMQ is required. You can either install it via a package manager or if you have docker installed you and spin up a RabbitMQ container with:
```
npm run rabbit
```
Under the hood this runs `docker run -p 5672:5672 -p 15672:15672 rabbitmq:management`.

You can now run the tests with:
```
npm test
```

## License
Licensed under [MIT](./LICENSE).

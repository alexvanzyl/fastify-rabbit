'use strict'

const fp = require('fastify-plugin')
const amqp = require('amqplib')

async function fastifyRabbitMQ (fastify, opts, next) {
  let connectionObject = (opts.url) ? opts.url : opts
  let conn, channel
  try {
    conn = await amqp.connect(connectionObject)
    channel = await conn.createChannel()
  } catch (err) {
    next(err)
    return
  }

  const rabbit = {
    conn,
    channel
  }

  fastify.addHook('onClose', () => conn.close())
  fastify.decorate('rabbit', rabbit)

  next()
}

module.exports = fp(fastifyRabbitMQ, {
  fastify: '>=2.0.0',
  name: 'fastify-rabbit'
})

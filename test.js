'use strict'

const t = require('tap')
const { test } = t
const Fastify = require('fastify')
const fastifyRabbitMQ = require('./index')

const INVALID_URL = 'unknown://protocol'
const VALID_URL = 'amqp://localhost'

test('{ url: INVALID_URL }', t => {
  t.plan(2)

  register(t, { url: INVALID_URL }, (err, fastify) => {
    t.ok(err)
    t.notOk(fastify.rabbit)
  })
})

test('{ url: VALID_URL }', t => {
  t.plan(4)

  register(t, { url: VALID_URL }, (err, fastify) => {
    t.error(err)
    t.ok(fastify.rabbit)
    t.ok(fastify.rabbit.conn)
    t.ok(fastify.rabbit.channel)
  })
})

test('connecting with object', t => {
  t.plan(4)

  register(t, {
    protocol: 'amqp',
    hostname: 'localhost',
    port: 5672,
    username: 'guest',
    password: 'guest',
    locale: 'en_US',
    frameMax: 0,
    heartbeat: 0,
    vhost: '/'
  }, (err, fastify) => {
    t.error(err)
    t.ok(fastify.rabbit)
    t.ok(fastify.rabbit.conn)
    t.ok(fastify.rabbit.channel)
  })
})

function register (t, options, callback) {
  const fastify = Fastify()
  t.teardown(() => fastify.close())

  fastify.register(fastifyRabbitMQ, options)
    .ready(err => callback(err, fastify))
}

Object.defineProperty(exports, '__esModule', { value: true });

const index$2 = require('../http/index.js');
const amqplib = require('./amqplib.js');
const connect = require('./connect.js');
const express = require('./express.js');
const fastify = require('./fastify.js');
const genericPool = require('./genericPool.js');
const graphql = require('./graphql.js');
const index = require('./hapi/index.js');
const kafka = require('./kafka.js');
const koa = require('./koa.js');
const lrumemoizer = require('./lrumemoizer.js');
const mongo = require('./mongo.js');
const mongoose = require('./mongoose.js');
const mysql = require('./mysql.js');
const mysql2 = require('./mysql2.js');
const nest = require('./nest/nest.js');
const postgres = require('./postgres.js');
const redis = require('./redis.js');
const tedious = require('./tedious.js');
const index$1 = require('./vercelai/index.js');

/**
 * With OTEL, all performance integrations will be added, as OTEL only initializes them when the patched package is actually required.
 */
function getAutoPerformanceIntegrations() {
  return [
    express.expressIntegration(),
    fastify.fastifyIntegration(),
    graphql.graphqlIntegration(),
    mongo.mongoIntegration(),
    mongoose.mongooseIntegration(),
    mysql.mysqlIntegration(),
    mysql2.mysql2Integration(),
    redis.redisIntegration(),
    postgres.postgresIntegration(),
    // For now, we do not include prisma by default because it has ESM issues
    // See https://github.com/prisma/prisma/issues/23410
    // TODO v8: Figure out a better solution for this, maybe only disable in ESM mode?
    // prismaIntegration(),
    // eslint-disable-next-line deprecation/deprecation
    nest.nestIntegration(),
    index.hapiIntegration(),
    koa.koaIntegration(),
    connect.connectIntegration(),
    tedious.tediousIntegration(),
    genericPool.genericPoolIntegration(),
    kafka.kafkaIntegration(),
    amqplib.amqplibIntegration(),
    lrumemoizer.lruMemoizerIntegration(),
    index$1.vercelAIIntegration(),
  ];
}

/**
 * Get a list of methods to instrument OTEL, when preload instrumentation.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getOpenTelemetryInstrumentationToPreload() {
  return [
    index$2.instrumentOtelHttp,
    express.instrumentExpress,
    connect.instrumentConnect,
    fastify.instrumentFastify,
    index.instrumentHapi,
    kafka.instrumentKafka,
    koa.instrumentKoa,
    lrumemoizer.instrumentLruMemoizer,
    // eslint-disable-next-line deprecation/deprecation
    nest.instrumentNest,
    mongo.instrumentMongo,
    mongoose.instrumentMongoose,
    mysql.instrumentMysql,
    mysql2.instrumentMysql2,
    postgres.instrumentPostgres,
    index.instrumentHapi,
    graphql.instrumentGraphql,
    redis.instrumentRedis,
    tedious.instrumentTedious,
    genericPool.instrumentGenericPool,
    amqplib.instrumentAmqplib,
    index$1.instrumentVercelAi,
  ];
}

exports.getAutoPerformanceIntegrations = getAutoPerformanceIntegrations;
exports.getOpenTelemetryInstrumentationToPreload = getOpenTelemetryInstrumentationToPreload;
//# sourceMappingURL=index.js.map

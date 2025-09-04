import { instrumentOtelHttp } from '../http/index.js';
import { amqplibIntegration, instrumentAmqplib } from './amqplib.js';
import { connectIntegration, instrumentConnect } from './connect.js';
import { expressIntegration, instrumentExpress } from './express.js';
import { fastifyIntegration, instrumentFastify } from './fastify.js';
import { genericPoolIntegration, instrumentGenericPool } from './genericPool.js';
import { graphqlIntegration, instrumentGraphql } from './graphql.js';
import { hapiIntegration, instrumentHapi } from './hapi/index.js';
import { kafkaIntegration, instrumentKafka } from './kafka.js';
import { koaIntegration, instrumentKoa } from './koa.js';
import { lruMemoizerIntegration, instrumentLruMemoizer } from './lrumemoizer.js';
import { mongoIntegration, instrumentMongo } from './mongo.js';
import { mongooseIntegration, instrumentMongoose } from './mongoose.js';
import { mysqlIntegration, instrumentMysql } from './mysql.js';
import { mysql2Integration, instrumentMysql2 } from './mysql2.js';
import { nestIntegration, instrumentNest } from './nest/nest.js';
import { postgresIntegration, instrumentPostgres } from './postgres.js';
import { redisIntegration, instrumentRedis } from './redis.js';
import { tediousIntegration, instrumentTedious } from './tedious.js';
import { vercelAIIntegration, instrumentVercelAi } from './vercelai/index.js';

/**
 * With OTEL, all performance integrations will be added, as OTEL only initializes them when the patched package is actually required.
 */
function getAutoPerformanceIntegrations() {
  return [
    expressIntegration(),
    fastifyIntegration(),
    graphqlIntegration(),
    mongoIntegration(),
    mongooseIntegration(),
    mysqlIntegration(),
    mysql2Integration(),
    redisIntegration(),
    postgresIntegration(),
    // For now, we do not include prisma by default because it has ESM issues
    // See https://github.com/prisma/prisma/issues/23410
    // TODO v8: Figure out a better solution for this, maybe only disable in ESM mode?
    // prismaIntegration(),
    // eslint-disable-next-line deprecation/deprecation
    nestIntegration(),
    hapiIntegration(),
    koaIntegration(),
    connectIntegration(),
    tediousIntegration(),
    genericPoolIntegration(),
    kafkaIntegration(),
    amqplibIntegration(),
    lruMemoizerIntegration(),
    vercelAIIntegration(),
  ];
}

/**
 * Get a list of methods to instrument OTEL, when preload instrumentation.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getOpenTelemetryInstrumentationToPreload() {
  return [
    instrumentOtelHttp,
    instrumentExpress,
    instrumentConnect,
    instrumentFastify,
    instrumentHapi,
    instrumentKafka,
    instrumentKoa,
    instrumentLruMemoizer,
    // eslint-disable-next-line deprecation/deprecation
    instrumentNest,
    instrumentMongo,
    instrumentMongoose,
    instrumentMysql,
    instrumentMysql2,
    instrumentPostgres,
    instrumentHapi,
    instrumentGraphql,
    instrumentRedis,
    instrumentTedious,
    instrumentGenericPool,
    instrumentAmqplib,
    instrumentVercelAi,
  ];
}

export { getAutoPerformanceIntegrations, getOpenTelemetryInstrumentationToPreload };
//# sourceMappingURL=index.js.map

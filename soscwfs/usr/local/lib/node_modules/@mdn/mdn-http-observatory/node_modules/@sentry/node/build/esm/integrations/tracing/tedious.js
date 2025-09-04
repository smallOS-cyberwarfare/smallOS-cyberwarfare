import { _optionalChain } from '@sentry/core';
import { TediousInstrumentation } from '@opentelemetry/instrumentation-tedious';
import { defineIntegration, spanToJSON, SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN } from '@sentry/core';
import { generateInstrumentOnce } from '../../otel/instrument.js';

const TEDIUS_INSTRUMENTED_METHODS = new Set([
  'callProcedure',
  'execSql',
  'execSqlBatch',
  'execBulkLoad',
  'prepare',
  'execute',
]);

const INTEGRATION_NAME = 'Tedious';

const instrumentTedious = generateInstrumentOnce(INTEGRATION_NAME, () => new TediousInstrumentation({}));

const _tediousIntegration = (() => {
  return {
    name: INTEGRATION_NAME,
    setupOnce() {
      instrumentTedious();
    },

    setup(client) {
      client.on('spanStart', span => {
        const { description, data } = spanToJSON(span);
        // Tedius integration always set a span name and `db.system` attribute to `mssql`.
        if (!description || _optionalChain([data, 'optionalAccess', _ => _['db.system']]) !== 'mssql') {
          return;
        }

        const operation = _optionalChain([description, 'optionalAccess', _2 => _2.split, 'call', _3 => _3(' '), 'access', _4 => _4[0]]) || '';
        if (TEDIUS_INSTRUMENTED_METHODS.has(operation)) {
          span.setAttribute(SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN, 'auto.db.otel.tedious');
        }
      });
    },
  };
}) ;

/**
 * Adds Sentry tracing instrumentation for the [tedious](https://www.npmjs.com/package/tedious) library.
 *
 * For more information, see the [`tediousIntegration` documentation](https://docs.sentry.io/platforms/javascript/guides/node/configuration/integrations/tedious/).
 *
 * @example
 * ```javascript
 * const Sentry = require('@sentry/node');
 *
 * Sentry.init({
 *  integrations: [Sentry.tediousIntegration()],
 * });
 * ```
 */
const tediousIntegration = defineIntegration(_tediousIntegration);

export { instrumentTedious, tediousIntegration };
//# sourceMappingURL=tedious.js.map

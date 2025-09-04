import { _optionalChain } from '@sentry/core';
import { DataloaderInstrumentation } from '@opentelemetry/instrumentation-dataloader';
import { defineIntegration, spanToJSON, SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN, SEMANTIC_ATTRIBUTE_SENTRY_OP } from '@sentry/core';
import { generateInstrumentOnce } from '../../otel/instrument.js';

const INTEGRATION_NAME = 'Dataloader';

const instrumentDataloader = generateInstrumentOnce(
  INTEGRATION_NAME,
  () =>
    new DataloaderInstrumentation({
      requireParentSpan: true,
    }),
);

const _dataloaderIntegration = (() => {
  return {
    name: INTEGRATION_NAME,
    setupOnce() {
      instrumentDataloader();
    },

    setup(client) {
      client.on('spanStart', span => {
        const spanJSON = spanToJSON(span);
        if (_optionalChain([spanJSON, 'access', _ => _.description, 'optionalAccess', _2 => _2.startsWith, 'call', _3 => _3('dataloader')])) {
          span.setAttribute(SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN, 'auto.db.otel.dataloader');
        }

        // These are all possible dataloader span descriptions
        // Still checking for the future versions
        // in case they add support for `clear` and `prime`
        if (
          spanJSON.description === 'dataloader.load' ||
          spanJSON.description === 'dataloader.loadMany' ||
          spanJSON.description === 'dataloader.batch'
        ) {
          span.setAttribute(SEMANTIC_ATTRIBUTE_SENTRY_OP, 'cache.get');
          // TODO: We can try adding `key` to the `data` attribute upstream.
          // Or alternatively, we can add `requestHook` to the dataloader instrumentation.
        }
      });
    },
  };
}) ;

/**
 * Adds Sentry tracing instrumentation for the [dataloader](https://www.npmjs.com/package/dataloader) library.
 *
 * For more information, see the [`dataloaderIntegration` documentation](https://docs.sentry.io/platforms/javascript/guides/node/configuration/integrations/dataloader/).
 *
 * @example
 * ```javascript
 * const Sentry = require('@sentry/node');
 *
 * Sentry.init({
 *  integrations: [Sentry.dataloaderIntegration()],
 * });
 * ```
 */
const dataloaderIntegration = defineIntegration(_dataloaderIntegration);

export { dataloaderIntegration, instrumentDataloader };
//# sourceMappingURL=dataloader.js.map

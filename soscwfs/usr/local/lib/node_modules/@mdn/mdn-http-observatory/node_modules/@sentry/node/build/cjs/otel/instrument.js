Object.defineProperty(exports, '__esModule', { value: true });

const instrumentation = require('@opentelemetry/instrumentation');

/** Exported only for tests. */
const INSTRUMENTED = {};

/**
 * Instrument an OpenTelemetry instrumentation once.
 * This will skip running instrumentation again if it was already instrumented.
 */
function generateInstrumentOnce(
  name,
  creator,
) {
  return Object.assign(
    (options) => {
      const instrumented = INSTRUMENTED[name];
      if (instrumented) {
        // If options are provided, ensure we update them
        if (options) {
          instrumented.setConfig(options);
        }
        return;
      }

      const instrumentation$1 = creator(options);
      INSTRUMENTED[name] = instrumentation$1;

      instrumentation.registerInstrumentations({
        instrumentations: [instrumentation$1],
      });
    },
    { id: name },
  );
}

exports.INSTRUMENTED = INSTRUMENTED;
exports.generateInstrumentOnce = generateInstrumentOnce;
//# sourceMappingURL=instrument.js.map

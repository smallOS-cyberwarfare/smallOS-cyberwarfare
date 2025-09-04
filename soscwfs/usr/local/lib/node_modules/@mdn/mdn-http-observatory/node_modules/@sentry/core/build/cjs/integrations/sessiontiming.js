Object.defineProperty(exports, '__esModule', { value: true });

const integration = require('../integration.js');
const time = require('../utils-hoist/time.js');

const INTEGRATION_NAME = 'SessionTiming';

const _sessionTimingIntegration = (() => {
  const startTime = time.timestampInSeconds() * 1000;

  return {
    name: INTEGRATION_NAME,
    processEvent(event) {
      const now = time.timestampInSeconds() * 1000;

      return {
        ...event,
        extra: {
          ...event.extra,
          ['session:start']: startTime,
          ['session:duration']: now - startTime,
          ['session:end']: now,
        },
      };
    },
  };
}) ;

/**
 * This function adds duration since the sessionTimingIntegration was initialized
 * till the time event was sent.
 *
 * @deprecated This integration is deprecated and will be removed in the next major version of the SDK.
 * To capture session durations alongside events, use [Context](https://docs.sentry.io/platforms/javascript/enriching-events/context/) (`Sentry.setContext()`).
 */
const sessionTimingIntegration = integration.defineIntegration(_sessionTimingIntegration);

exports.sessionTimingIntegration = sessionTimingIntegration;
//# sourceMappingURL=sessiontiming.js.map

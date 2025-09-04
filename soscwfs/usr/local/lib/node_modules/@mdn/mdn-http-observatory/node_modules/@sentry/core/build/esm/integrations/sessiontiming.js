import { defineIntegration } from '../integration.js';
import { timestampInSeconds } from '../utils-hoist/time.js';

const INTEGRATION_NAME = 'SessionTiming';

const _sessionTimingIntegration = (() => {
  const startTime = timestampInSeconds() * 1000;

  return {
    name: INTEGRATION_NAME,
    processEvent(event) {
      const now = timestampInSeconds() * 1000;

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
const sessionTimingIntegration = defineIntegration(_sessionTimingIntegration);

export { sessionTimingIntegration };
//# sourceMappingURL=sessiontiming.js.map

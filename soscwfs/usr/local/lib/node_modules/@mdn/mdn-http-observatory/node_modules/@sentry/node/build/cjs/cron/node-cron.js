var {
  _optionalChain
} = require('@sentry/core');

Object.defineProperty(exports, '__esModule', { value: true });

const core = require('@sentry/core');
const common = require('./common.js');

/**
 * Wraps the `node-cron` library with check-in monitoring.
 *
 * ```ts
 * import * as Sentry from "@sentry/node";
 * import * as cron from "node-cron";
 *
 * const cronWithCheckIn = Sentry.cron.instrumentNodeCron(cron);
 *
 * cronWithCheckIn.schedule(
 *   "* * * * *",
 *   () => {
 *     console.log("running a task every minute");
 *   },
 *   { name: "my-cron-job" },
 * );
 * ```
 */
function instrumentNodeCron(lib) {
  return new Proxy(lib, {
    get(target, prop) {
      if (prop === 'schedule' && target.schedule) {
        // When 'get' is called for schedule, return a proxied version of the schedule function
        return new Proxy(target.schedule, {
          apply(target, thisArg, argArray) {
            const [expression, callback, options] = argArray;

            if (!_optionalChain([options, 'optionalAccess', _ => _.name])) {
              throw new Error('Missing "name" for scheduled job. A name is required for Sentry check-in monitoring.');
            }

            async function monitoredCallback() {
              return core.withMonitor(
                options.name,
                async () => {
                  // We have to manually catch here and capture the exception because node-cron swallows errors
                  // https://github.com/node-cron/node-cron/issues/399
                  try {
                    return await callback();
                  } catch (e) {
                    core.captureException(e);
                    throw e;
                  }
                },
                {
                  schedule: { type: 'crontab', value: common.replaceCronNames(expression) },
                  timezone: _optionalChain([options, 'optionalAccess', _2 => _2.timezone]),
                },
              );
            }

            return target.apply(thisArg, [expression, monitoredCallback, options]);
          },
        });
      } else {
        return target[prop];
      }
    },
  });
}

exports.instrumentNodeCron = instrumentNodeCron;
//# sourceMappingURL=node-cron.js.map

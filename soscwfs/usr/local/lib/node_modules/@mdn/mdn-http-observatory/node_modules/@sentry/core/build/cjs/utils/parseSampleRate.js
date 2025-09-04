Object.defineProperty(exports, '__esModule', { value: true });

const debugBuild = require('../debug-build.js');
const logger = require('../utils-hoist/logger.js');

/**
 * Parse a sample rate from a given value.
 * This will either return a boolean or number sample rate, if the sample rate is valid (between 0 and 1).
 * If a string is passed, we try to convert it to a number.
 *
 * Any invalid sample rate will return `undefined`.
 */
function parseSampleRate(sampleRate) {
  if (typeof sampleRate === 'boolean') {
    return Number(sampleRate);
  }

  const rate = typeof sampleRate === 'string' ? parseFloat(sampleRate) : sampleRate;
  if (typeof rate !== 'number' || isNaN(rate) || rate < 0 || rate > 1) {
    debugBuild.DEBUG_BUILD &&
      logger.logger.warn(
        `[Tracing] Given sample rate is invalid. Sample rate must be a boolean or a number between 0 and 1. Got ${JSON.stringify(
          sampleRate,
        )} of type ${JSON.stringify(typeof sampleRate)}.`,
      );
    return undefined;
  }

  return rate;
}

exports.parseSampleRate = parseSampleRate;
//# sourceMappingURL=parseSampleRate.js.map

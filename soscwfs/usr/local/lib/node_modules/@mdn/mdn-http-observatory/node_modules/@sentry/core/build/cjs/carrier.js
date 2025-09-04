Object.defineProperty(exports, '__esModule', { value: true });

const version = require('./utils-hoist/version.js');
const worldwide = require('./utils-hoist/worldwide.js');

/**
 * An object that contains globally accessible properties and maintains a scope stack.
 * @hidden
 */

/**
 * Returns the global shim registry.
 *
 * FIXME: This function is problematic, because despite always returning a valid Carrier,
 * it has an optional `__SENTRY__` property, which then in turn requires us to always perform an unnecessary check
 * at the call-site. We always access the carrier through this function, so we can guarantee that `__SENTRY__` is there.
 **/
function getMainCarrier() {
  // This ensures a Sentry carrier exists
  getSentryCarrier(worldwide.GLOBAL_OBJ);
  return worldwide.GLOBAL_OBJ;
}

/** Will either get the existing sentry carrier, or create a new one. */
function getSentryCarrier(carrier) {
  const __SENTRY__ = (carrier.__SENTRY__ = carrier.__SENTRY__ || {});

  // For now: First SDK that sets the .version property wins
  __SENTRY__.version = __SENTRY__.version || version.SDK_VERSION;

  // Intentionally populating and returning the version of "this" SDK instance
  // rather than what's set in .version so that "this" SDK always gets its carrier
  return (__SENTRY__[version.SDK_VERSION] = __SENTRY__[version.SDK_VERSION] || {});
}

exports.getMainCarrier = getMainCarrier;
exports.getSentryCarrier = getSentryCarrier;
//# sourceMappingURL=carrier.js.map

var {
  _optionalChain
} = require('@sentry/core');

Object.defineProperty(exports, '__esModule', { value: true });

const moduleModule = require('module');
const api = require('@opentelemetry/api');
const resources = require('@opentelemetry/resources');
const sdkTraceBase = require('@opentelemetry/sdk-trace-base');
const semanticConventions = require('@opentelemetry/semantic-conventions');
const core = require('@sentry/core');
const opentelemetry = require('@sentry/opentelemetry');
const importInTheMiddle = require('import-in-the-middle');
const debugBuild = require('../debug-build.js');
const index = require('../integrations/tracing/index.js');
const contextManager = require('../otel/contextManager.js');
const commonjs = require('../utils/commonjs.js');

var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
// About 277h - this must fit into new Array(len)!
const MAX_MAX_SPAN_WAIT_DURATION = 1000000;

/**
 * Initialize OpenTelemetry for Node.
 */
function initOpenTelemetry(client, options = {}) {
  if (client.getOptions().debug) {
    setupOpenTelemetryLogger();
  }

  const provider = setupOtel(client, options);
  client.traceProvider = provider;
}

function getRegisterOptions(esmHookConfig) {
  // TODO(v9): Make onlyIncludeInstrumentedModules: true the default behavior.
  if (_optionalChain([esmHookConfig, 'optionalAccess', _ => _.onlyIncludeInstrumentedModules])) {
    const { addHookMessagePort } = importInTheMiddle.createAddHookMessageChannel();
    // If the user supplied include, we need to use that as a starting point or use an empty array to ensure no modules
    // are wrapped if they are not hooked
    // eslint-disable-next-line deprecation/deprecation
    return { data: { addHookMessagePort, include: esmHookConfig.include || [] }, transferList: [addHookMessagePort] };
  }

  return { data: esmHookConfig };
}

/** Initialize the ESM loader. */
function maybeInitializeEsmLoader(esmHookConfig) {
  const [nodeMajor = 0, nodeMinor = 0] = process.versions.node.split('.').map(Number);

  // Register hook was added in v20.6.0 and v18.19.0
  if (nodeMajor >= 22 || (nodeMajor === 20 && nodeMinor >= 6) || (nodeMajor === 18 && nodeMinor >= 19)) {
    // We need to work around using import.meta.url directly because jest complains about it.
    const importMetaUrl =
      typeof (typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('sdk/initOtel.js', document.baseURI).href)) !== 'undefined' ? (typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('sdk/initOtel.js', document.baseURI).href)) : undefined;

    if (!core.GLOBAL_OBJ._sentryEsmLoaderHookRegistered && importMetaUrl) {
      try {
        // @ts-expect-error register is available in these versions
        moduleModule.default.register('import-in-the-middle/hook.mjs', importMetaUrl, getRegisterOptions(esmHookConfig));
        core.GLOBAL_OBJ._sentryEsmLoaderHookRegistered = true;
      } catch (error) {
        core.logger.warn('Failed to register ESM hook', error);
      }
    }
  } else {
    core.consoleSandbox(() => {
      // eslint-disable-next-line no-console
      console.warn(
        '[Sentry] You are using Node.js in ESM mode ("import syntax"). The Sentry Node.js SDK is not compatible with ESM in Node.js versions before 18.19.0 or before 20.6.0. Please either build your application with CommonJS ("require() syntax"), or upgrade your Node.js version.',
      );
    });
  }
}

/**
 * Preload OpenTelemetry for Node.
 * This can be used to preload instrumentation early, but set up Sentry later.
 * By preloading the OTEL instrumentation wrapping still happens early enough that everything works.
 */
function preloadOpenTelemetry(options = {}) {
  const { debug } = options;

  if (debug) {
    core.logger.enable();
    setupOpenTelemetryLogger();
  }

  if (!commonjs.isCjs()) {
    maybeInitializeEsmLoader(options.registerEsmLoaderHooks);
  }

  // These are all integrations that we need to pre-load to ensure they are set up before any other code runs
  getPreloadMethods(options.integrations).forEach(fn => {
    fn();

    if (debug) {
      core.logger.log(`[Sentry] Preloaded ${fn.id} instrumentation`);
    }
  });
}

function getPreloadMethods(integrationNames) {
  const instruments = index.getOpenTelemetryInstrumentationToPreload();

  if (!integrationNames) {
    return instruments;
  }

  return instruments.filter(instrumentation => integrationNames.includes(instrumentation.id));
}

/** Just exported for tests. */
function setupOtel(client, options = {}) {
  // Create and configure NodeTracerProvider
  const provider = new sdkTraceBase.BasicTracerProvider({
    sampler: new opentelemetry.SentrySampler(client),
    resource: new resources.Resource({
      [semanticConventions.ATTR_SERVICE_NAME]: 'node',
      // eslint-disable-next-line deprecation/deprecation
      [semanticConventions.SEMRESATTRS_SERVICE_NAMESPACE]: 'sentry',
      [semanticConventions.ATTR_SERVICE_VERSION]: core.SDK_VERSION,
    }),
    forceFlushTimeoutMillis: 500,
    spanProcessors: [
      new opentelemetry.SentrySpanProcessor({
        timeout: _clampSpanProcessorTimeout(client.getOptions().maxSpanWaitDuration),
      }),
      ...(options.spanProcessors || []),
    ],
  });

  // Initialize the provider
  provider.register({
    propagator: new opentelemetry.SentryPropagator(),
    contextManager: new contextManager.SentryContextManager(),
  });

  return provider;
}

/** Just exported for tests. */
function _clampSpanProcessorTimeout(maxSpanWaitDuration) {
  if (maxSpanWaitDuration == null) {
    return undefined;
  }

  // We guard for a max. value here, because we create an array with this length
  // So if this value is too large, this would fail
  if (maxSpanWaitDuration > MAX_MAX_SPAN_WAIT_DURATION) {
    debugBuild.DEBUG_BUILD &&
      core.logger.warn(`\`maxSpanWaitDuration\` is too high, using the maximum value of ${MAX_MAX_SPAN_WAIT_DURATION}`);
    return MAX_MAX_SPAN_WAIT_DURATION;
  } else if (maxSpanWaitDuration <= 0 || Number.isNaN(maxSpanWaitDuration)) {
    debugBuild.DEBUG_BUILD && core.logger.warn('`maxSpanWaitDuration` must be a positive number, using default value instead.');
    return undefined;
  }

  return maxSpanWaitDuration;
}

/**
 * Setup the OTEL logger to use our own logger.
 */
function setupOpenTelemetryLogger() {
  const otelLogger = new Proxy(core.logger , {
    get(target, prop, receiver) {
      const actualProp = prop === 'verbose' ? 'debug' : prop;
      return Reflect.get(target, actualProp, receiver);
    },
  });

  // Disable diag, to ensure this works even if called multiple times
  api.diag.disable();
  api.diag.setLogger(otelLogger, api.DiagLogLevel.DEBUG);
}

exports._clampSpanProcessorTimeout = _clampSpanProcessorTimeout;
exports.initOpenTelemetry = initOpenTelemetry;
exports.maybeInitializeEsmLoader = maybeInitializeEsmLoader;
exports.preloadOpenTelemetry = preloadOpenTelemetry;
exports.setupOtel = setupOtel;
//# sourceMappingURL=initOtel.js.map

Object.defineProperty(exports, '__esModule', { value: true });

const core$1 = require('@opentelemetry/core');
const instrumentation = require('@opentelemetry/instrumentation');
const core = require('@sentry/core');
const helpers = require('./helpers.js');

const supportedVersions = ['>=2.0.0'];

/**
 * Custom instrumentation for nestjs event-emitter
 *
 * This hooks into the `OnEvent` decorator, which is applied on event handlers.
 */
class SentryNestEventInstrumentation extends instrumentation.InstrumentationBase {
   static  __initStatic() {this.COMPONENT = '@nestjs/event-emitter';}
   static  __initStatic2() {this.COMMON_ATTRIBUTES = {
    component: SentryNestEventInstrumentation.COMPONENT,
  };}

   constructor(config = {}) {
    super('sentry-nestjs-event', core.SDK_VERSION, config);
  }

  /**
   * Initializes the instrumentation by defining the modules to be patched.
   */
   init() {
    const moduleDef = new instrumentation.InstrumentationNodeModuleDefinition(
      SentryNestEventInstrumentation.COMPONENT,
      supportedVersions,
    );

    moduleDef.files.push(this._getOnEventFileInstrumentation(supportedVersions));
    return moduleDef;
  }

  /**
   * Wraps the @OnEvent decorator.
   */
   _getOnEventFileInstrumentation(versions) {
    return new instrumentation.InstrumentationNodeModuleFile(
      '@nestjs/event-emitter/dist/decorators/on-event.decorator.js',
      versions,
      (moduleExports) => {
        if (core$1.isWrapped(moduleExports.OnEvent)) {
          this._unwrap(moduleExports, 'OnEvent');
        }
        this._wrap(moduleExports, 'OnEvent', this._createWrapOnEvent());
        return moduleExports;
      },
      (moduleExports) => {
        this._unwrap(moduleExports, 'OnEvent');
      },
    );
  }

  /**
   * Creates a wrapper function for the @OnEvent decorator.
   */
   _createWrapOnEvent() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function wrapOnEvent(original) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return function wrappedOnEvent(event, options) {
        const eventName = Array.isArray(event)
          ? event.join(',')
          : typeof event === 'string' || typeof event === 'symbol'
            ? event.toString()
            : '<unknown_event>';

        // Get the original decorator result
        const decoratorResult = original(event, options);

        // Return a new decorator function that wraps the handler
        return function (target, propertyKey, descriptor) {
          if (!descriptor.value || typeof descriptor.value !== 'function' || target.__SENTRY_INTERNAL__) {
            return decoratorResult(target, propertyKey, descriptor);
          }

          // Get the original handler
          const originalHandler = descriptor.value;
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          const handlerName = originalHandler.name || propertyKey;

          // Instrument the handler
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          descriptor.value = async function (...args) {
            return core.startSpan(helpers.getEventSpanOptions(eventName), async () => {
              try {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                const result = await originalHandler.apply(this, args);
                return result;
              } catch (error) {
                // exceptions from event handlers are not caught by global error filter
                core.captureException(error);
                throw error;
              }
            });
          };

          // Preserve the original function name
          Object.defineProperty(descriptor.value, 'name', {
            value: handlerName,
            configurable: true,
          });

          // Apply the original decorator
          return decoratorResult(target, propertyKey, descriptor);
        };
      };
    };
  }
} SentryNestEventInstrumentation.__initStatic(); SentryNestEventInstrumentation.__initStatic2();

exports.SentryNestEventInstrumentation = SentryNestEventInstrumentation;
//# sourceMappingURL=sentry-nest-event-instrumentation.js.map

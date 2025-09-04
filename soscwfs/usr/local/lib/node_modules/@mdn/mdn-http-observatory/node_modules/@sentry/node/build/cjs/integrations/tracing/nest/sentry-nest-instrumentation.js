var {
  _nullishCoalesce,
  _optionalChain
} = require('@sentry/core');

Object.defineProperty(exports, '__esModule', { value: true });

const core$1 = require('@opentelemetry/core');
const instrumentation = require('@opentelemetry/instrumentation');
const core = require('@sentry/core');
const helpers = require('./helpers.js');

const supportedVersions = ['>=8.0.0 <11'];

/**
 * Custom instrumentation for nestjs.
 *
 * This hooks into
 * 1. @Injectable decorator, which is applied on class middleware, interceptors and guards.
 * 2. @Catch decorator, which is applied on exception filters.
 */
class SentryNestInstrumentation extends instrumentation.InstrumentationBase {
   static  __initStatic() {this.COMPONENT = '@nestjs/common';}
   static  __initStatic2() {this.COMMON_ATTRIBUTES = {
    component: SentryNestInstrumentation.COMPONENT,
  };}

   constructor(config = {}) {
    super('sentry-nestjs', core.SDK_VERSION, config);
  }

  /**
   * Initializes the instrumentation by defining the modules to be patched.
   */
   init() {
    const moduleDef = new instrumentation.InstrumentationNodeModuleDefinition(SentryNestInstrumentation.COMPONENT, supportedVersions);

    moduleDef.files.push(
      this._getInjectableFileInstrumentation(supportedVersions),
      this._getCatchFileInstrumentation(supportedVersions),
    );
    return moduleDef;
  }

  /**
   * Wraps the @Injectable decorator.
   */
   _getInjectableFileInstrumentation(versions) {
    return new instrumentation.InstrumentationNodeModuleFile(
      '@nestjs/common/decorators/core/injectable.decorator.js',
      versions,
      (moduleExports) => {
        if (core$1.isWrapped(moduleExports.Injectable)) {
          this._unwrap(moduleExports, 'Injectable');
        }
        this._wrap(moduleExports, 'Injectable', this._createWrapInjectable());
        return moduleExports;
      },
      (moduleExports) => {
        this._unwrap(moduleExports, 'Injectable');
      },
    );
  }

  /**
   * Wraps the @Catch decorator.
   */
   _getCatchFileInstrumentation(versions) {
    return new instrumentation.InstrumentationNodeModuleFile(
      '@nestjs/common/decorators/core/catch.decorator.js',
      versions,
      (moduleExports) => {
        if (core$1.isWrapped(moduleExports.Catch)) {
          this._unwrap(moduleExports, 'Catch');
        }
        this._wrap(moduleExports, 'Catch', this._createWrapCatch());
        return moduleExports;
      },
      (moduleExports) => {
        this._unwrap(moduleExports, 'Catch');
      },
    );
  }

  /**
   * Creates a wrapper function for the @Injectable decorator.
   */
   _createWrapInjectable() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function wrapInjectable(original) {
      return function wrappedInjectable(options) {
        return function (target) {
          // patch middleware
          if (typeof target.prototype.use === 'function' && !target.__SENTRY_INTERNAL__) {
            // patch only once
            if (helpers.isPatched(target)) {
              return original(options)(target);
            }

            target.prototype.use = new Proxy(target.prototype.use, {
              apply: (originalUse, thisArgUse, argsUse) => {
                const [req, res, next, ...args] = argsUse;

                // Check that we can reasonably assume that the target is a middleware.
                // Without these guards, instrumentation will fail if a function named 'use' on a service, which is
                // decorated with @Injectable, is called.
                if (!req || !res || !next || typeof next !== 'function') {
                  return originalUse.apply(thisArgUse, argsUse);
                }

                const prevSpan = core.getActiveSpan();

                return core.startSpanManual(helpers.getMiddlewareSpanOptions(target), (span) => {
                  // proxy next to end span on call
                  const nextProxy = helpers.getNextProxy(next, span, prevSpan);
                  return originalUse.apply(thisArgUse, [req, res, nextProxy, args]);
                });
              },
            });
          }

          // patch guards
          if (typeof target.prototype.canActivate === 'function' && !target.__SENTRY_INTERNAL__) {
            // patch only once
            if (helpers.isPatched(target)) {
              return original(options)(target);
            }

            target.prototype.canActivate = new Proxy(target.prototype.canActivate, {
              apply: (originalCanActivate, thisArgCanActivate, argsCanActivate) => {
                const context = argsCanActivate[0];

                if (!context) {
                  return originalCanActivate.apply(thisArgCanActivate, argsCanActivate);
                }

                return core.startSpan(helpers.getMiddlewareSpanOptions(target), () => {
                  return originalCanActivate.apply(thisArgCanActivate, argsCanActivate);
                });
              },
            });
          }

          // patch pipes
          if (typeof target.prototype.transform === 'function' && !target.__SENTRY_INTERNAL__) {
            if (helpers.isPatched(target)) {
              return original(options)(target);
            }

            target.prototype.transform = new Proxy(target.prototype.transform, {
              apply: (originalTransform, thisArgTransform, argsTransform) => {
                const value = argsTransform[0];
                const metadata = argsTransform[1];

                if (!value || !metadata) {
                  return originalTransform.apply(thisArgTransform, argsTransform);
                }

                return core.startSpan(helpers.getMiddlewareSpanOptions(target), () => {
                  return originalTransform.apply(thisArgTransform, argsTransform);
                });
              },
            });
          }

          // patch interceptors
          if (typeof target.prototype.intercept === 'function' && !target.__SENTRY_INTERNAL__) {
            if (helpers.isPatched(target)) {
              return original(options)(target);
            }

            target.prototype.intercept = new Proxy(target.prototype.intercept, {
              apply: (originalIntercept, thisArgIntercept, argsIntercept) => {
                const context = argsIntercept[0];
                const next = argsIntercept[1];

                const parentSpan = core.getActiveSpan();
                let afterSpan;

                // Check that we can reasonably assume that the target is an interceptor.
                if (!context || !next || typeof next.handle !== 'function') {
                  return originalIntercept.apply(thisArgIntercept, argsIntercept);
                }

                return core.startSpanManual(helpers.getMiddlewareSpanOptions(target), (beforeSpan) => {
                  // eslint-disable-next-line @typescript-eslint/unbound-method
                  next.handle = new Proxy(next.handle, {
                    apply: (originalHandle, thisArgHandle, argsHandle) => {
                      beforeSpan.end();

                      if (parentSpan) {
                        return core.withActiveSpan(parentSpan, () => {
                          const handleReturnObservable = Reflect.apply(originalHandle, thisArgHandle, argsHandle);

                          if (!context._sentryInterceptorInstrumented) {
                            core.addNonEnumerableProperty(context, '_sentryInterceptorInstrumented', true);
                            afterSpan = core.startInactiveSpan(
                              helpers.getMiddlewareSpanOptions(target, 'Interceptors - After Route'),
                            );
                          }

                          return handleReturnObservable;
                        });
                      } else {
                        const handleReturnObservable = Reflect.apply(originalHandle, thisArgHandle, argsHandle);

                        if (!context._sentryInterceptorInstrumented) {
                          core.addNonEnumerableProperty(context, '_sentryInterceptorInstrumented', true);
                          afterSpan = core.startInactiveSpan(helpers.getMiddlewareSpanOptions(target, 'Interceptors - After Route'));
                        }

                        return handleReturnObservable;
                      }
                    },
                  });

                  let returnedObservableInterceptMaybePromise;

                  try {
                    returnedObservableInterceptMaybePromise = originalIntercept.apply(thisArgIntercept, argsIntercept);
                  } catch (e) {
                    _optionalChain([beforeSpan, 'optionalAccess', _ => _.end, 'call', _2 => _2()]);
                    _optionalChain([afterSpan, 'optionalAccess', _3 => _3.end, 'call', _4 => _4()]);
                    throw e;
                  }

                  if (!afterSpan) {
                    return returnedObservableInterceptMaybePromise;
                  }

                  // handle async interceptor
                  if (core.isThenable(returnedObservableInterceptMaybePromise)) {
                    return returnedObservableInterceptMaybePromise.then(
                      observable => {
                        helpers.instrumentObservable(observable, _nullishCoalesce(afterSpan, () => ( parentSpan)));
                        return observable;
                      },
                      e => {
                        _optionalChain([beforeSpan, 'optionalAccess', _5 => _5.end, 'call', _6 => _6()]);
                        _optionalChain([afterSpan, 'optionalAccess', _7 => _7.end, 'call', _8 => _8()]);
                        throw e;
                      },
                    );
                  }

                  // handle sync interceptor
                  if (typeof returnedObservableInterceptMaybePromise.subscribe === 'function') {
                    helpers.instrumentObservable(returnedObservableInterceptMaybePromise, _nullishCoalesce(afterSpan, () => ( parentSpan)));
                  }

                  return returnedObservableInterceptMaybePromise;
                });
              },
            });
          }

          return original(options)(target);
        };
      };
    };
  }

  /**
   * Creates a wrapper function for the @Catch decorator. Used to instrument exception filters.
   */
   _createWrapCatch() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function wrapCatch(original) {
      return function wrappedCatch(...exceptions) {
        return function (target) {
          if (typeof target.prototype.catch === 'function' && !target.__SENTRY_INTERNAL__) {
            // patch only once
            if (helpers.isPatched(target)) {
              return original(...exceptions)(target);
            }

            target.prototype.catch = new Proxy(target.prototype.catch, {
              apply: (originalCatch, thisArgCatch, argsCatch) => {
                const exception = argsCatch[0];
                const host = argsCatch[1];

                if (!exception || !host) {
                  return originalCatch.apply(thisArgCatch, argsCatch);
                }

                return core.startSpan(helpers.getMiddlewareSpanOptions(target), () => {
                  return originalCatch.apply(thisArgCatch, argsCatch);
                });
              },
            });
          }

          return original(...exceptions)(target);
        };
      };
    };
  }
}SentryNestInstrumentation.__initStatic();SentryNestInstrumentation.__initStatic2();

exports.SentryNestInstrumentation = SentryNestInstrumentation;
//# sourceMappingURL=sentry-nest-instrumentation.js.map

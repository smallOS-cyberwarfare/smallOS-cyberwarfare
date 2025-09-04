import { _nullishCoalesce } from '@sentry/core';
import { addNonEnumerableProperty, SEMANTIC_ATTRIBUTE_SENTRY_OP, SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN, withActiveSpan } from '@sentry/core';

const sentryPatched = 'sentryPatched';

/**
 * Helper checking if a concrete target class is already patched.
 *
 * We already guard duplicate patching with isWrapped. However, isWrapped checks whether a file has been patched, whereas we use this check for concrete target classes.
 * This check might not be necessary, but better to play it safe.
 */
function isPatched(target) {
  if (target.sentryPatched) {
    return true;
  }

  addNonEnumerableProperty(target, sentryPatched, true);
  return false;
}

/**
 * Returns span options for nest middleware spans.
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function getMiddlewareSpanOptions(target, name = undefined) {
  const span_name = _nullishCoalesce(name, () => ( target.name)); // fallback to class name if no name is provided

  return {
    name: span_name,
    attributes: {
      [SEMANTIC_ATTRIBUTE_SENTRY_OP]: 'middleware.nestjs',
      [SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: 'auto.middleware.nestjs',
    },
  };
}

/**
 * Returns span options for nest event spans.
 */
function getEventSpanOptions(event)

 {
  return {
    name: `event ${event}`,
    attributes: {
      [SEMANTIC_ATTRIBUTE_SENTRY_OP]: 'event.nestjs',
      [SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: 'auto.event.nestjs',
    },
    forceTransaction: true,
  };
}

/**
 * Adds instrumentation to a js observable and attaches the span to an active parent span.
 */
function instrumentObservable(observable, activeSpan) {
  if (activeSpan) {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    observable.subscribe = new Proxy(observable.subscribe, {
      apply: (originalSubscribe, thisArgSubscribe, argsSubscribe) => {
        return withActiveSpan(activeSpan, () => {
          const subscription = originalSubscribe.apply(thisArgSubscribe, argsSubscribe);
          subscription.add(() => activeSpan.end());
          return subscription;
        });
      },
    });
  }
}

/**
 * Proxies the next() call in a nestjs middleware to end the span when it is called.
 */
function getNextProxy(next, span, prevSpan) {
  return new Proxy(next, {
    apply: (originalNext, thisArgNext, argsNext) => {
      span.end();

      if (prevSpan) {
        return withActiveSpan(prevSpan, () => {
          return Reflect.apply(originalNext, thisArgNext, argsNext);
        });
      } else {
        return Reflect.apply(originalNext, thisArgNext, argsNext);
      }
    },
  });
}

export { getEventSpanOptions, getMiddlewareSpanOptions, getNextProxy, instrumentObservable, isPatched };
//# sourceMappingURL=helpers.js.map

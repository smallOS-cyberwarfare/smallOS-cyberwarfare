import type { Span } from '@sentry/core';
import type { CatchTarget, InjectableTarget, NextFunction, Observable } from './types';
/**
 * Helper checking if a concrete target class is already patched.
 *
 * We already guard duplicate patching with isWrapped. However, isWrapped checks whether a file has been patched, whereas we use this check for concrete target classes.
 * This check might not be necessary, but better to play it safe.
 */
export declare function isPatched(target: InjectableTarget | CatchTarget): boolean;
/**
 * Returns span options for nest middleware spans.
 */
export declare function getMiddlewareSpanOptions(target: InjectableTarget | CatchTarget, name?: string | undefined): {
    name: string;
    attributes: {
        "sentry.op": string;
        "sentry.origin": string;
    };
};
/**
 * Returns span options for nest event spans.
 */
export declare function getEventSpanOptions(event: string): {
    name: string;
    attributes: Record<string, string>;
    forceTransaction: boolean;
};
/**
 * Adds instrumentation to a js observable and attaches the span to an active parent span.
 */
export declare function instrumentObservable(observable: Observable<unknown>, activeSpan: Span | undefined): void;
/**
 * Proxies the next() call in a nestjs middleware to end the span when it is called.
 */
export declare function getNextProxy(next: NextFunction, span: Span, prevSpan: undefined | Span): NextFunction;
//# sourceMappingURL=helpers.d.ts.map
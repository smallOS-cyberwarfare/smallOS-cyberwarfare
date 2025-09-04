import type { Client, HandlerDataFetch, Scope, Span, SpanOrigin } from './types-hoist';
type PolymorphicRequestHeaders = Record<string, string | undefined> | Array<[string, string]> | {
    append: (key: string, value: string) => void;
    get: (key: string) => string | null | undefined;
};
/**
 * Create and track fetch request spans for usage in combination with `addFetchInstrumentationHandler`.
 *
 * @returns Span if a span was created, otherwise void.
 */
export declare function instrumentFetchRequest(handlerData: HandlerDataFetch, shouldCreateSpan: (url: string) => boolean, shouldAttachHeaders: (url: string) => boolean, spans: Record<string, Span>, spanOrigin?: SpanOrigin): Span | undefined;
/**
 * Adds sentry-trace and baggage headers to the various forms of fetch headers.
 *
 * @deprecated This function will not be exported anymore in v9.
 */
export declare function addTracingHeadersToFetchRequest(request: string | unknown, _client: Client | undefined, _scope: Scope | undefined, fetchOptionsObj: {
    headers?: {
        [key: string]: string[] | string | undefined;
    } | PolymorphicRequestHeaders;
}, span?: Span): PolymorphicRequestHeaders | undefined;
export {};
//# sourceMappingURL=fetch.d.ts.map
/// <reference types="node" />
import { ClientRequest, IncomingMessage, RequestOptions, ServerResponse } from 'node:http';
import { HttpInstrumentationConfig } from '@opentelemetry/instrumentation-http';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { Span } from '@sentry/core';
import { HTTPModuleRequestIncomingMessage } from '../../transports/http-module';
interface HttpOptions {
    /**
     * Whether breadcrumbs should be recorded for outgoing requests.
     * Defaults to true
     */
    breadcrumbs?: boolean;
    /**
     * If set to false, do not emit any spans.
     * This will ensure that the default HttpInstrumentation from OpenTelemetry is not setup,
     * only the Sentry-specific instrumentation for request isolation is applied.
     */
    spans?: boolean;
    /**
     * Whether the integration should create [Sessions](https://docs.sentry.io/product/releases/health/#sessions) for incoming requests to track the health and crash-free rate of your releases in Sentry.
     * Read more about Release Health: https://docs.sentry.io/product/releases/health/
     *
     * Defaults to `true`.
     *
     * Note: If `autoSessionTracking` is set to `false` in `Sentry.init()` or the Client owning this integration, this option will be ignored.
     */
    trackIncomingRequestsAsSessions?: boolean;
    /**
     * Do not capture spans or breadcrumbs for outgoing HTTP requests to URLs where the given callback returns `true`.
     * This controls both span & breadcrumb creation - spans will be non recording if tracing is disabled.
     *
     * The `url` param contains the entire URL, including query string (if any), protocol, host, etc. of the outgoing request.
     * For example: `'https://someService.com/users/details?id=123'`
     *
     * The `request` param contains the original {@type RequestOptions} object used to make the outgoing request.
     * You can use it to filter on additional properties like method, headers, etc.
     */
    ignoreOutgoingRequests?: (url: string, request: RequestOptions) => boolean;
    /**
     * Do not capture spans for incoming HTTP requests to URLs where the given callback returns `true`.
     * Spans will be non recording if tracing is disabled.
     *
     * The `urlPath` param consists of the URL path and query string (if any) of the incoming request.
     * For example: `'/users/details?id=123'`
     *
     * The `request` param contains the original {@type IncomingMessage} object of the incoming request.
     * You can use it to filter on additional properties like method, headers, etc.
     */
    ignoreIncomingRequests?: (urlPath: string, request: IncomingMessage) => boolean;
    /**
     * If true, do not generate spans for incoming requests at all.
     * This is used by Remix to avoid generating spans for incoming requests, as it generates its own spans.
     */
    disableIncomingRequestSpans?: boolean;
    /**
     * Additional instrumentation options that are passed to the underlying HttpInstrumentation.
     */
    instrumentation?: {
        requestHook?: (span: Span, req: ClientRequest | HTTPModuleRequestIncomingMessage) => void;
        responseHook?: (span: Span, response: HTTPModuleRequestIncomingMessage | ServerResponse) => void;
        applyCustomAttributesOnSpan?: (span: Span, request: ClientRequest | HTTPModuleRequestIncomingMessage, response: HTTPModuleRequestIncomingMessage | ServerResponse) => void;
        /**
         * You can pass any configuration through to the underlying instrumentation.
         * Note that there are no semver guarantees for this!
         */
        _experimentalConfig?: ConstructorParameters<typeof HttpInstrumentation>[0];
    };
}
export declare const instrumentSentryHttp: ((options?: {
    breadcrumbs?: HttpOptions['breadcrumbs'];
    ignoreOutgoingRequests?: HttpOptions['ignoreOutgoingRequests'];
} | undefined) => void) & {
    id: string;
};
export declare const instrumentOtelHttp: ((options?: HttpInstrumentationConfig | undefined) => void) & {
    id: string;
};
/**
 * The http integration instruments Node's internal http and https modules.
 * It creates breadcrumbs and spans for outgoing HTTP requests which will be attached to the currently active span.
 */
export declare const httpIntegration: (options?: HttpOptions | undefined) => import("@sentry/core").Integration;
export {};
//# sourceMappingURL=index.d.ts.map

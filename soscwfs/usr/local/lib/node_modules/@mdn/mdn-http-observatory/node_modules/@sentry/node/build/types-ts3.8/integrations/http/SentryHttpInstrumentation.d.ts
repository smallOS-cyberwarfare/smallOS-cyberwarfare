/// <reference types="node" />
import { RequestOptions } from 'node:http';
import { InstrumentationConfig } from '@opentelemetry/instrumentation';
import { InstrumentationBase, InstrumentationNodeModuleDefinition } from '@opentelemetry/instrumentation';
type SentryHttpInstrumentationOptions = InstrumentationConfig & {
    /**
     * Whether breadcrumbs should be recorded for requests.
     *
     * @default `true`
     */
    breadcrumbs?: boolean;
    /**
     * Do not capture breadcrumbs for outgoing HTTP requests to URLs where the given callback returns `true`.
     * For the scope of this instrumentation, this callback only controls breadcrumb creation.
     * The same option can be passed to the top-level httpIntegration where it controls both, breadcrumb and
     * span creation.
     *
     * @param url Contains the entire URL, including query string (if any), protocol, host, etc. of the outgoing request.
     * @param request Contains the {@type RequestOptions} object used to make the outgoing request.
     */
    ignoreOutgoingRequests?: (url: string, request: RequestOptions) => boolean;
};
/**
 * This custom HTTP instrumentation is used to isolate incoming requests and annotate them with additional information.
 * It does not emit any spans.
 *
 * The reason this is isolated from the OpenTelemetry instrumentation is that users may overwrite this,
 * which would lead to Sentry not working as expected.
 *
 * Important note: Contrary to other OTEL instrumentation, this one cannot be unwrapped.
 * It only does minimal things though and does not emit any spans.
 *
 * This is heavily inspired & adapted from:
 * https://github.com/open-telemetry/opentelemetry-js/blob/f8ab5592ddea5cba0a3b33bf8d74f27872c0367f/experimental/packages/opentelemetry-instrumentation-http/src/http.ts
 */
export declare class SentryHttpInstrumentation extends InstrumentationBase<SentryHttpInstrumentationOptions> {
    constructor(config?: SentryHttpInstrumentationOptions);
    /** @inheritdoc */
    init(): [
        InstrumentationNodeModuleDefinition,
        InstrumentationNodeModuleDefinition
    ];
    /** Get the instrumentation for the http module. */
    private _getHttpInstrumentation;
    /** Get the instrumentation for the https module. */
    private _getHttpsInstrumentation;
    /**
     * Patch the incoming request function for request isolation.
     */
    private _getPatchIncomingRequestFunction;
    /**
     * Patch the outgoing request function for breadcrumbs.
     */
    private _getPatchOutgoingRequestFunction;
    /** Path the outgoing get function for breadcrumbs. */
    private _getPatchOutgoingGetFunction;
}
export {};
//# sourceMappingURL=SentryHttpInstrumentation.d.ts.map

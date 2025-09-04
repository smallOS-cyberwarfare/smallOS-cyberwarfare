import type { BaseTransportOptions, CheckIn, ClientOptions, DynamicSamplingContext, Event, EventHint, MonitorConfig, ParameterizedString, SeverityLevel, TraceContext } from './types-hoist';
import { BaseClient } from './baseclient';
import type { Scope } from './scope';
import { SessionFlusher } from './sessionflusher';
export interface ServerRuntimeClientOptions extends ClientOptions<BaseTransportOptions> {
    platform?: string;
    runtime?: {
        name: string;
        version?: string;
    };
    serverName?: string;
}
/**
 * The Sentry Server Runtime Client SDK.
 */
export declare class ServerRuntimeClient<O extends ClientOptions & ServerRuntimeClientOptions = ServerRuntimeClientOptions> extends BaseClient<O> {
    protected _sessionFlusher: SessionFlusher | undefined;
    /**
     * Creates a new Edge SDK instance.
     * @param options Configuration options for this SDK.
     */
    constructor(options: O);
    /**
     * @inheritDoc
     */
    eventFromException(exception: unknown, hint?: EventHint): PromiseLike<Event>;
    /**
     * @inheritDoc
     */
    eventFromMessage(message: ParameterizedString, level?: SeverityLevel, hint?: EventHint): PromiseLike<Event>;
    /**
     * @inheritDoc
     */
    captureException(exception: unknown, hint?: EventHint, scope?: Scope): string;
    /**
     * @inheritDoc
     */
    captureEvent(event: Event, hint?: EventHint, scope?: Scope): string;
    /**
     *
     * @inheritdoc
     */
    close(timeout?: number): PromiseLike<boolean>;
    /**
     * Initializes an instance of SessionFlusher on the client which will aggregate and periodically flush session data.
     *
     * NOTICE: This method will implicitly create an interval that is periodically called.
     * To clean up this resources, call `.close()` when you no longer intend to use the client.
     * Not doing so will result in a memory leak.
     */
    initSessionFlusher(): void;
    /**
     * Create a cron monitor check in and send it to Sentry.
     *
     * @param checkIn An object that describes a check in.
     * @param upsertMonitorConfig An optional object that describes a monitor config. Use this if you want
     * to create a monitor automatically when sending a check in.
     */
    captureCheckIn(checkIn: CheckIn, monitorConfig?: MonitorConfig, scope?: Scope): string;
    /**
     * Method responsible for capturing/ending a request session by calling `incrementSessionStatusCount` to increment
     * appropriate session aggregates bucket
     *
     * @deprecated This method should not be used or extended. It's functionality will move into the `httpIntegration` and not be part of any public API.
     */
    protected _captureRequestSession(): void;
    /**
     * @inheritDoc
     */
    protected _prepareEvent(event: Event, hint: EventHint, scope?: Scope, isolationScope?: Scope): PromiseLike<Event | null>;
    /** Extract trace information from scope */
    protected _getTraceInfoFromScope(scope: Scope | undefined): [dynamicSamplingContext: Partial<DynamicSamplingContext> | undefined, traceContext: TraceContext | undefined];
}
//# sourceMappingURL=server-runtime-client.d.ts.map
interface DebugOptions {
    /** Controls whether console output created by this integration should be stringified. Default: `false` */
    stringify?: boolean;
    /** Controls whether a debugger should be launched before an event is sent. Default: `false` */
    debugger?: boolean;
}
/**
 * Integration to debug sent Sentry events.
 * This integration should not be used in production.
 *
 * @deprecated This integration is deprecated and will be removed in the next major version of the SDK.
 * To log outgoing events, use [Hook Options](https://docs.sentry.io/platforms/javascript/configuration/options/#hooks) (`beforeSend`, `beforeSendTransaction`, ...).
 */
export declare const debugIntegration: (options?: DebugOptions | undefined) => import("../types-hoist").Integration;
export {};
//# sourceMappingURL=debug.d.ts.map

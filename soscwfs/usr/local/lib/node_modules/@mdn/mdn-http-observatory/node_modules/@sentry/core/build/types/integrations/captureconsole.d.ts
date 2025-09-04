interface CaptureConsoleOptions {
    levels?: string[];
    /**
     * By default, Sentry will mark captured console messages as unhandled.
     * Set this to `true` if you want to mark them as handled instead.
     *
     * Note: in v9 of the SDK, this option will default to `true`, meaning the default behavior will change to mark console messages as handled.
     * @default false
     */
    handled?: boolean;
}
/**
 * Send Console API calls as Sentry Events.
 */
export declare const captureConsoleIntegration: (options?: CaptureConsoleOptions | undefined) => import("../types-hoist").Integration;
export {};
//# sourceMappingURL=captureconsole.d.ts.map
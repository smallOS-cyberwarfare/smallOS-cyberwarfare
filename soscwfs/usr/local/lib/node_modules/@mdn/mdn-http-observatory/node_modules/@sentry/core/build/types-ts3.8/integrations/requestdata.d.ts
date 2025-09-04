export type RequestDataIntegrationOptions = {
    /**
     * Controls what data is pulled from the request and added to the event
     */
    include?: {
        cookies?: boolean;
        data?: boolean;
        headers?: boolean;
        ip?: boolean;
        query_string?: boolean;
        url?: boolean;
        user?: boolean | {
            id?: boolean;
            username?: boolean;
            email?: boolean;
        };
    };
    /**
     * Whether to identify transactions by parameterized path, parameterized path with method, or handler name.
     * @deprecated This option does not do anything anymore, and will be removed in v9.
     */
    transactionNamingScheme?: 'path' | 'methodPath' | 'handler';
};
/**
 * Add data about a request to an event. Primarily for use in Node-based SDKs, but included in `@sentry/core`
 * so it can be used in cross-platform SDKs like `@sentry/nextjs`.
 */
export declare const requestDataIntegration: (options?: RequestDataIntegrationOptions | undefined) => import("../types-hoist").Integration;
//# sourceMappingURL=requestdata.d.ts.map

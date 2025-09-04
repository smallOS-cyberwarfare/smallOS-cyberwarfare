interface Options {
    /**
     * Whether to include child process arguments in breadcrumbs data.
     *
     * @default false
     */
    includeChildProcessArgs?: boolean;
}
/**
 * Capture breadcrumbs for child processes and worker threads.
 */
export declare const childProcessIntegration: (options?: Options | undefined) => import("@sentry/core").Integration;
/**
 * Capture breadcrumbs for child processes and worker threads.
 *
 * @deprecated Use `childProcessIntegration` integration instead. Functionally they are the same. `processThreadBreadcrumbIntegration` will be removed in the next major version.
 */
export declare const processThreadBreadcrumbIntegration: (options?: Options | undefined) => import("@sentry/core").Integration;
export {};
//# sourceMappingURL=childProcess.d.ts.map

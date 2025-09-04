export type NestedArray<T> = Array<NestedArray<T> | T>;
/** Flattens a multi-dimensional array
 *
 * @deprecated This function is deprecated and will be removed in the next major version.
 */
export declare function flatten<T>(input: NestedArray<T>): T[];
//# sourceMappingURL=array.d.ts.map
/**
 * Vendored in from https://github.com/open-telemetry/opentelemetry-js/commit/87bd98edd24c98a5fbb9a56fed4b673b7f17a724
 */
import type { RequestOptions } from 'node:http';
import * as url from 'url';
import type { DiagLogger } from '@opentelemetry/api';
/**
 * Makes sure options is an url object
 * return an object with default value and parsed options
 * @param logger component logger
 * @param options original options for the request
 * @param [extraOptions] additional options for the request
 */
export declare const getRequestInfo: (logger: DiagLogger, options: url.URL | RequestOptions | string, extraOptions?: RequestOptions) => {
    origin: string;
    pathname: string;
    method: string;
    invalidUrl: boolean;
    optionsParsed: RequestOptions;
};
//# sourceMappingURL=getRequestInfo.d.ts.map
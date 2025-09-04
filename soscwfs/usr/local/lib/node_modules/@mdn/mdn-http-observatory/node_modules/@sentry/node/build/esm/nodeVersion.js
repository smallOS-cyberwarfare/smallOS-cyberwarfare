import { parseSemver } from '@sentry/core';

const NODE_VERSION = parseSemver(process.versions.node) ;
const NODE_MAJOR = NODE_VERSION.major;

export { NODE_MAJOR, NODE_VERSION };
//# sourceMappingURL=nodeVersion.js.map

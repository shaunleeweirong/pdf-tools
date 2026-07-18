// Empty stub for Node.js built-in modules that should not be bundled in the browser.
// @jspawn/qpdf-wasm conditionally imports 'fs', 'path', and 'module' only when
// running in Node.js (guarded by `if (globalThis.process)`). In the browser these
// imports are never executed at runtime, but Turbopack still resolves them statically.
// Pointing them here silences the build errors safely.
module.exports = {};

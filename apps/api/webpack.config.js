/**
 * Webpack Configuration for NestJS API
 * Excludes native modules from bundling
 */
module.exports = {
  externals: /^(bcrypt|passport-jwt|@mapbox\/node-pre-gyp|class-transformer\/storage)/,
};

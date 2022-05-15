import helper from '~/helper';

export default {
  env: helper.getEnv('NODE_ENV', 'dev'),
  port: helper.number(helper.getEnv('PORT', 8080)),
  version: helper.getEnv('npm_package_version'),
  debug: helper.truth(helper.getEnv('DEBUG_MODE', false)),

  corsOriginWhitelist: helper.getEnv('CORS_WHITE_LIST', '').split(','),
};

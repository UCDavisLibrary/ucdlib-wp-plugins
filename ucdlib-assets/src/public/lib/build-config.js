require('dotenv').config();

let config = {
  fileName: 'ucdlib.js',
  clientModules: [
    'node_modules', 
    '../../../../ucdlib-locations/src/public/node_modules'
  ],
  theme: '../../../../../themes/ucdlib-theme-wp/',
  isDockerEnv: process.env.WORDPRESS_DB_HOST ? true: false
};

config.themePublicJs = config.theme + "src/public";

if ( config.isDockerEnv ) {
  config.clientModules.push(config.themePublicJs + "node_modules");
} else {
  config.clientModules.push('../../../../ucdlib-theme-wp/src/public/node_modules',);
}


module.exports = config;
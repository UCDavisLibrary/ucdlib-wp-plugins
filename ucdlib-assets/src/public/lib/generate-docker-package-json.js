const fs = require('fs');
const buildConfig = require('./build-config');

// change npm link path to reflect wordpress structure, instead of for main-wp-website repo
let package = JSON.parse(fs.readFileSync('package.json'));
package.dependencies['@ucd-lib/brand-theme'] = "file:" + buildConfig.themePublicJs;

fs.writeFileSync('package-docker.json', JSON.stringify(package, null, 2));
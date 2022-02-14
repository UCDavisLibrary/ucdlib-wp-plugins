const fs = require('fs');

// change npm link path to reflect wordpress structure, instead of for main-wp-website repo
let package = JSON.parse(fs.readFileSync('package.json'));
package.dependencies['@ucd-lib/brand-theme-editor'] = "file:../../../../../themes/ucdlib-theme-wp/node_modules";

fs.writeFileSync('package-docker.json', JSON.stringify(package, null, 2));
const path = require('path');
const fs = require('fs-extra');

let dist = '../../assets/js/dist';
let distFolder = path.join(__dirname, dist);
if( fs.existsSync(distFolder) ) {
  fs.removeSync(distFolder);
}

let config = require('@ucd-lib/cork-app-build').dist({
  // root directory, all paths below will be relative to root
  root : __dirname,
  // path to your entry .js file
  entry : './index.js',
  // folder where bundle.js will be written
  dist : dist,
  clientModules : 'node_modules'
});

module.exports = config;
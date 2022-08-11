const path = require('path');
const fs = require('fs-extra');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const buildConfig = require('./build-config');

let dist = `${buildConfig.assetsPath}js/dist`;
let distFolder = path.join(__dirname, dist);
if( fs.existsSync(distFolder) ) {
  fs.removeSync(distFolder);
}

let config = require('@ucd-lib/cork-app-build').dist({
  // root directory, all paths below will be relative to root
  root : __dirname,
  // path to your entry .js file
  entry : '../index.js',
  dist: distFolder,
  modern : buildConfig.fileName,
  ie: `${buildConfig.fileName.split(".")[0]}-ie.js`,
  clientModules : buildConfig.clientModules
});


if( !Array.isArray(config) ) config = [config];
config.forEach(conf => {
  
  // make stylesheet
  if( !Array.isArray(conf.entry) ) conf.entry = [conf.entry]; 
  conf.entry.push(path.join(__dirname, './scss/style.scss'));
  conf.module.rules.push({
     test: /\.s[ac]ss$/i,
     use: [
       { loader: MiniCssExtractPlugin.loader},
       buildConfig.loaderOptions.css,
       buildConfig.loaderOptions.scss,
     ]
   });

   conf.plugins = [
     new MiniCssExtractPlugin({
       filename: `${buildConfig.assetsPath}css/ucdlib.css`
     })
   ]
});

module.exports = config;
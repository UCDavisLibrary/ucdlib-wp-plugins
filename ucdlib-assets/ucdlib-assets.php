<?php
/**
 * Plugin Name: UCD Library Assets
 * Plugin URI: https://github.com/UCDavisLibrary/ucdlib-wp-plugins/tree/main/ucdlib-assets
 * Description: Manages UCD Library static assets. Primarily, builds and loads JS bundles from theme and plugins.
 * Version: 1.0.0-alpha.2
 * Author: UC Davis Library Online Strategy
 */

require_once( __DIR__ . '/includes/main.php' );
new UCDLibPluginAssets();

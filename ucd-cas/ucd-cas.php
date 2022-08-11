<?php
/**
 * Plugin Name: UCD CAS
 * Plugin URI: https://github.com/UCDavisLibrary/ucdlib-wp-plugins/tree/main/ucd-cas
 * Description: Reroutes WP auth through CAS
 * Version: 1.0.0-alpha.1
 * Author: UC Davis Library Online Strategy
 */

// Load dependencies if necessary
// Should already be done by theme
require_once(ABSPATH . 'wp-admin/includes/file.php');
$composer_autoload = get_home_path() . 'vendor/autoload.php';
if ( file_exists( $composer_autoload ) ) {
  require_once $composer_autoload;
} 

// Load plugin
require_once( __DIR__ . '/includes/main.php' );
new UCDPluginCAS();
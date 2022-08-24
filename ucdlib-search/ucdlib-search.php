<?php
/**
 * Plugin Name: UCD Library Search
 * Plugin URI: https://github.com/UCDavisLibrary/ucdlib-wp-plugins/tree/main/ucdlib-search
 * Description: Integrates WP and Libguides search. Assumes you are running an elasticsearch instance.
 * Version: 1.0.0
 * Author: UC Davis Library Online Strategy
 */

// Load dependencies if necessary
// Should already be done by theme
require_once(ABSPATH . 'wp-admin/includes/file.php');
$composer_autoload = get_home_path() . 'vendor/autoload.php';
if ( file_exists( $composer_autoload ) ) {
  require_once $composer_autoload;
} 

if( !class_exists('ACF') ) {
  add_action(
    'admin_notices',
    function() {
      echo '<div class="error"><p>ACF plugin not activated. This is required for ucdlib-search plugin. </p></div>';
    }
  );
  
  } elseif ( !class_exists('Elasticsearch\ClientBuilder') ) {
    add_action(
      'admin_notices',
      function() {
        echo '<div class="error"><p>Elasticsearch PHP client not installed. This is required for ucdlib-search plugin. </p></div>';
      }
    );
  } else {
    require_once( __DIR__ . '/includes/main.php' );
    new UCDLibPluginSearch();

  };
<?php
/**
 * Plugin Name: UCD Library Directory
 * Plugin URI: https://github.com/UCDavisLibrary/ucdlib-wp-plugins/tree/main/ucdlib-directory
 * Description: Enhanced profile pages and directory/people search.
 * Version: 1.0.0
 * Author: UC Davis Library Online Strategy
 */

if( !class_exists('ACF') ) {
  add_action(
    'admin_notices',
    function() {
      echo '<div class="error"><p>ACF plugin not activated. This is required for ucdlib-directory plugin. </p></div>';
    }
  ); 
} else {
  require_once(ABSPATH . 'wp-admin/includes/file.php');
  $composer_autoload = get_home_path() . 'vendor/autoload.php';
  if ( file_exists( $composer_autoload ) ) {
    require_once $composer_autoload;
  } 
  require_once( __DIR__ . '/includes/main.php' );
  new UCDLibPluginDirectory();
}

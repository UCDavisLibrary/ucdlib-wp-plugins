<?php
/**
 * Plugin Name: UCD Library Locations
 * Plugin URI: https://github.com/UCDavisLibrary/ucdlib-wp-plugins/tree/main/ucdlib-locations
 * Description: Enables the 'location' post type, api, and custom elements for displaying hours.
 * Version: 1.0.0
 * Author: UC Davis Library Online Strategy
 */

if( class_exists('ACF') ) {
  require_once(ABSPATH . 'wp-admin/includes/file.php');
  $composer_autoload = get_home_path() . 'vendor/autoload.php';
  if ( file_exists( $composer_autoload ) ) {
    require_once $composer_autoload;
  } 

  require_once( __DIR__ . '/includes/main.php' );
  new UCDLibPluginLocations();

} else {
    add_action(
        'admin_notices',
        function() {
          echo '<div class="error"><p>ACF plugin not activated. This is required for ucdlib-locations plugin. </p></div>';
        }
      );
};
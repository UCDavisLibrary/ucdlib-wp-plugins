<?php
/**
 * Plugin Name: UCD Library Search
 * Plugin URI: https://github.com/UCDavisLibrary/ucdlib-wp-plugins/tree/main/ucdlib-search
 * Description: Integrates WP and Libguides search. Assumes you are running an elasticsearch instance.
 * Version: 1.0.0-alpha.1
 * Author: UC Davis Library Online Strategy
 */

if( class_exists('ACF') ) {

    require_once( __DIR__ . '/includes/main.php' );
    new UCDLibPluginSearch();
  
  } else {
      add_action(
          'admin_notices',
          function() {
            echo '<div class="error"><p>ACF plugin not activated. This is required for ucdlib-search plugin. </p></div>';
          }
        );
  };
<?php
require_once( __DIR__ . '/assets.php' );
require_once( __DIR__ . '/post-types.php' );
require_once( __DIR__ . '/acf.php' );
require_once( __DIR__ . '/api.php' );
require_once( __DIR__ . '/timber.php' );
require_once( __DIR__ . '/meta-data.php' );

class UCDLibPluginLocations {
  public function __construct(){
    $this->slug = "ucdlib-locations";

    $config = array(
      'slug' => $this->slug,
      'postTypeSlug' => 'location',
      'entryPath' => plugin_dir_path( __DIR__ ) . $this->slug . '.php',
      'version' => false
    );

    $plugin_metadata = get_file_data( $config['entryPath'], array(
      'Version' => 'Version'
    ) );

    if ( ! empty( $plugin_metadata['Version'] ) ) {
      $config['version'] = $plugin_metadata['Version'];
    } 

    add_action( 'admin_head', array($this, 'admin_head') );

    // enqueue all assets
    $this->assets = new UCDLibPluginLocationsAssets($config);

    // register 'location' post type
    $this->postTypes = new UCDLibPluginLocationsPostTypes($config);

    // register settings menu and other ACF functionality
    $this->acf = new UCDLibPluginLocationsACF($config);

    // register our API endpoints at /wp-json/ucdlib-locations
    $this->api = new UCDLibPluginLocationsAPI($config);

    // register location views and custom Timber class
    $this->timber = new UCDLibPluginLocationsTimber($config);

    $this->metaData = new UCDLibPluginLocationsMetaData($config);

  }

  /**
   * if this element is detected, editor JS for this plugin will be executed.
   * Necessary because we use a single js build process for all plugins and the theme
   */
  public function admin_head(){
    echo "
    <ucdlib-plugin plugin='$this->slug' style='display:none'>
    </ucdlib-plugin>
    ";
  }

}
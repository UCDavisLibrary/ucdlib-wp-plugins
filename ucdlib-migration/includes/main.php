<?php
require_once( __DIR__ . '/meta-data.php' );
require_once( __DIR__ . '/guides.php' );
require_once( __DIR__ . '/redirection.php' );

class UCDLibPluginMigration {
  public function __construct(){
    $this->slug = "ucdlib-migration";

    $config = array(
      'slug' => $this->slug,
      'guideSlug' => 'guide-stub',
      'entryPath' => plugin_dir_path( __DIR__ ) . $this->slug . '.php',
      'version' => false
    );

    $plugin_metadata = get_file_data( $config['entryPath'], array(
      'Version' => 'Version'
    ) );

    if ( ! empty( $plugin_metadata['Version'] ) ) {
      $config['version'] = $plugin_metadata['Version'];
    } 
    $this->config = $config;

    add_action( 'admin_head', array($this, 'admin_head') );
    add_filter( 'timber/locations', array($this, 'add_timber_locations') );

    // register custom metadata for posts
    $this->metaData = new UCDLibPluginMigrationMetaData( $config );

    // register guide stub post type
    $this->guides = new UCDLibPluginMigrationGuides( $config );

    $this->redirection = new UCDLibPluginMigrationRedirection( $config );
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

  public function add_timber_locations($paths){
    $paths[$this->config['slug']] = array(WP_PLUGIN_DIR . "/" . $this->config['slug'] . '/views');
    return $paths;
  }

}
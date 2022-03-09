<?php
require_once( __DIR__ . '/meta-data.php' );

class UCDLibPluginMigration {
  public function __construct(){
    $this->slug = "ucdlib-migration";

    $config = array(
      'slug' => $this->slug,
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

    $this->metaData = new UCDLibPluginMigrationMetaData( $config );
  }

  /**
   * if this element is detected, editor JS for this plugin will be executed.
   */
  public function admin_head(){
    echo "
    <ucdlib-plugin plugin='$this->slug' style='display:none'>
    </ucdlib-plugin>
    ";
  }

}
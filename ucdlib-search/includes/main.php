<?php
require_once( __DIR__ . '/acf.php' );
require_once( __DIR__ . '/activation.php' );

class UCDLibPluginSearch {
  public function __construct(){
    $this->slug = "ucdlib-search";

    $config = array(
      'slug' => $this->slug,
      'entryPoint' => plugin_dir_path( __DIR__ ) . $this->slug . '.php',
      'version' => false
    );

    // Get version number from entrypoint doc string
    $plugin_metadata = get_file_data( $config['entryPoint'], array(
      'Version' => 'Version'
    ) );
    if ( ! empty( $plugin_metadata['Version'] ) ) {
      $config['version'] = $plugin_metadata['Version'];
    } 

    // Options menu + other custom field stuff
    $this->acf = new UCDLibPluginSearchACF( $config );

    // Does work on plugin activation/deactivation
    $this->activation = new UCDLibPluginSearchActivation( $config );

  }

}
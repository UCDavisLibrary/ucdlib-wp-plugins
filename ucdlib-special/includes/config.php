<?php

// all config values go here
class UCDLibPluginSpecialConfig {

  public $slug = "ucdlib-special";

  public $postTypes = [
    'exhibit' => 'exhibit',
    'collection' => 'special-collection'
  ];

  public function __construct(){
    $this->entryPoint = plugin_dir_path( __DIR__ ) . $this->slug . '.php';
    // Get version number from entrypoint doc string
    $plugin_metadata = get_file_data( $this->entryPoint, array(
      'Version' => 'Version'
    ) );
    if ( ! empty( $plugin_metadata['Version'] ) ) {
      $this->version = $plugin_metadata['Version'];
    }
  }

}
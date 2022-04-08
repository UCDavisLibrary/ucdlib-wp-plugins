<?php

require_once( __DIR__ . '/services.php' );

class UCDLibPluginDirectory {
  public function __construct(){
    $this->slug = "ucdlib-directory";
    $this->config = $this->getConfig();

    $this->services = new UCDLibPluginDirectoryServices( $this->config );

  }

  public function getConfig(){
    $config = $this->getBaseConfig();
    return $config;
  }

  public function getBaseConfig(){
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

    return $config;
  }

}
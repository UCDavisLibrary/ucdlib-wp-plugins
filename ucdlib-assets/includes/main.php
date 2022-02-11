<?php

class UCDLibPluginAssets {
  public function __construct(){
    $this->slug = "ucdlib-assets";

    $config = array(
      'slug' => $this->slug,
      'entryPath' => plugin_dir_path( __DIR__ ) . $this->slug . '.php',
      'version' => false,
      'isDevEnv' => getenv('UCD_THEME_ENV') == 'dev',
    );

    // static asset uris
    $config['uris'] = array(
      'base' => trailingslashit( plugins_url() ) . $config['slug'] . "/assets"
    );
    $config['uris']['js'] = $config['uris']['base'] . "/js";
    $config['uris']['css'] = $config['uris']['base'] . "/css";

    // list of assets we will stop from loading and include in this build instead
    $config['rmAssets'] = [
      ['slug' => 'ucd-public', "type" => 'script'],
      ['slug' => 'ucd-public', "type" => 'style'],
      ['slug' => 'ucdlib-locations/public', "type" => 'script']
    ];

    // extract data from plugin docstring
    $plugin_metadata = get_file_data( $config['entryPath'], array(
      'Version' => 'Version'
    ) );
    if ( ! empty( $plugin_metadata['Version'] ) ) {
      $config['version'] = $plugin_metadata['Version'];
    }

    $this->config = $config;


    add_action( 'wp_enqueue_scripts', array($this, "enqueue_scripts") );
    add_action( 'wp_enqueue_scripts', array($this, "deregister"), 1000);

  }

  public function deregister(){
    foreach ($this->config['rmAssets'] as $s) {
      if ( $s['type'] == 'script' ) {
        wp_deregister_script( $s['slug'] );
      } elseif ( $s['type'] == 'style' ) {
        wp_deregister_style( $s['slug'] );
      }
      
    }
    
  }

  public function enqueue_scripts(){

    $slug = 'ucdlib';

    if ( $this->config['isDevEnv'] ){
      wp_enqueue_script(
        $slug,
        $this->config['uris']['js'] . "/dev/ucdlib.js",
        array(),
        $this->config['version'],
        true
      );
      wp_enqueue_style( 
        $slug,
        $this->config['uris']['css'] . "/ucdlib-dev.css",
        array(), 
        $this->config['version']
      );
    } else {
      wp_enqueue_script(
        $slug,
        $this->config['uris']['js'] . "/dist/ucdlib.js",
        array(),
        $this->config['version'],
        true
      );
      wp_enqueue_style( 
        $slug,
        $this->config['uris']['css'] . "/ucdlib.css",
        array(), 
        $this->config['version']
      );
    }
  }

}
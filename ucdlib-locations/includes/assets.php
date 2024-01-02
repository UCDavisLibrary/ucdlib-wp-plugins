<?php

class UCDLibPluginLocationsAssets {

  public $config;
  public $isDevEnv;
  public $uris;

  public function __construct( $config ) {
    $this->config = $config;
    $this->isDevEnv = getenv('UCDLIB_LOCATIONS_ENV') == 'dev';

    $this->uris = array(
      'base' => trailingslashit( plugins_url() ) . $config['slug'] . "/assets"
    );
    $this->uris['js'] = $this->uris['base'] . "/js";


    add_action( 'wp_enqueue_scripts', array($this, "wp_enqueue_scripts"), 4);
  }

  public function wp_enqueue_scripts(){

    if ( $this->isDevEnv ){
      wp_enqueue_script(
        $this->config['slug'] . "/public",
        $this->uris['js'] . "/dev/bundle.js",
        array(),
        $this->config['version'],
        true
      );
    } else {
      wp_enqueue_script(
        $this->config['slug'] . "/public",
        $this->uris['js'] . "/dist/bundle.js",
        array(),
        $this->config['version'],
        true
      );
    }

  }
}

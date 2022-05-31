<?php
require_once( __DIR__ . '/acf.php' );
require_once( __DIR__ . '/elasticsearch.php' );
require_once( __DIR__ . '/config.php' );

class UCDLibPluginSearch {
  public function __construct(){
    $this->config = new UCDLibPluginSearchConfig();

    add_filter( 'timber/locations', array($this, 'add_timber_locations') );
    add_filter( 'query_vars', [$this, 'registerQueryVar'] );

    // Options menu + other custom field stuff
    $this->acf = new UCDLibPluginSearchACF( $this->config );

    // Wire up elasticsearch
    $this->elasticsearch = new UCDLibPluginSearchElasticsearch( $this->config );

  }

  /**
   * Adds twig files under the @ucdlib-search namespace
   */
  public function add_timber_locations($paths){
    $paths[$this->config->slug] = array(WP_PLUGIN_DIR . "/" . $this->config->slug . '/views');
    return $paths;
  }

  public function registerQueryVar( $vars ){
    $vars[] = 'type';
    $vars[] = 'sortby';
    return $vars;
  }

}
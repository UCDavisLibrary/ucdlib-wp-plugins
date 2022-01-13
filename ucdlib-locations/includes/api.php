<?php

class UCDLibPluginLocationsAPI {

  public function __construct( $config ){
    $this->config = $config;

    add_action( 'rest_api_init', array($this, 'register_endpoints') );
  }

  public function register_endpoints(){
    register_rest_route($this->config['slug'], 'locations', array(
      'methods' => 'GET',
      'callback' => array($this, 'epcb_locations'),
    ) );
  }

  public function epcb_locations($request){
    return array('hello' => 'world');
  }
  
}
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
      'permission_callback' => function (){return true;}
    ) );
  }

  public function epcb_locations($request){
    $locations = Timber::get_posts( [
      'post_type' => $this->config['postTypeSlug'],
      'nopaging' => true,
    ] );

    $out = array();
    foreach ($locations as $location) {
      $loc = $location->core_data();
      $out[] = $loc;
    }
    return $out;
  }
  
}
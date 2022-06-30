<?php

class UCDLibPluginSpecialAPIExhibit {

  public function __construct( $config ){
    $this->config = $config;

    add_action( 'rest_api_init', array($this, 'register_endpoints') );
  }

  public function register_endpoints(){

    register_rest_route($this->config->slug, 'exhibit-page/(?P<id>\d+)', array(
      'methods' => 'GET',
      'callback' => array($this, 'epcb_exhibit'),
      'permission_callback' => function (){return true;}
    ) );
  }

  // Endpoint callback for a single exhibit page
  public function epcb_exhibit($request){
    $id = $request['id'];

    $post = Timber::get_post( [
      'post_type' => $this->config->postTypes['exhibit'],
      'p' => $id
    ] );

    if ( !$post ) {
      return new WP_Error( 'rest_not_found', 'This exhibit page does not exist.', array( 'status' => 404 ) );
    }
    $out = [
      'id' => $post->id,
      'pageTitle' => $post->title(),
      'exhibitTitle' => $post->exhibitTitle(),
      'exhibitId' => $post->exhibitId(),
      'exhibitIsOnline' => $post->exhibitIsOnline() ? true : false,
      'exhibitIsPhysical' => $post->exhibitIsPhysical() ? true : false,
      'exhibitIsPermanent' => $post->exhibitIsPermanent() ? true : false,
      'exhibitDateFrom' => $post->exhibitDateFrom(),
      'exhibitDateTo' => $post->exhibitDateTo(),
      'exhibitCuratorOrgs' => $post->exhibitCuratorOrgs(),
      'exhibitCurators' => array_map(function($x){return $x->ID;},(array)$post->exhibitCurators()),
      'exhibitLocations' => $post->exhibitLocations(),
      'exhibitLocationDirections' => $post->exhibitLocationDirections(),
      'exhibitLocationMap' => $post->exhibitLocationMap()
    ];

    return rest_ensure_response($out);
  }
  
}
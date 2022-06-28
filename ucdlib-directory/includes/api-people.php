<?php

class UCDLibPluginDirectoryAPIPeople {

  public function __construct( $config ){
    $this->config = $config;

    add_action( 'rest_api_init', array($this, 'register_endpoints') );
  }

  public function register_endpoints(){

    register_rest_route($this->config['slug'], 'people', array(
      'methods' => 'GET',
      'callback' => array($this, 'epcb_people'),
      'permission_callback' => function (){return true;}
    ) );
  }

  // Endpoint callback for a single exhibit page
  public function epcb_people($request){

    $posts = Timber::get_posts( [
      'post_type' => $this->config['postSlugs']['person'],
      'posts_per_page' => -1
    ] );

    $out = [];
    foreach ($posts as $post) {
      $out[] = [
        'id' => $post->id,
        'name_last' => $post->name_last(),
        'name_first' => $post->name_first()
      ];
    }
    
    return rest_ensure_response($out);
  }
  
}
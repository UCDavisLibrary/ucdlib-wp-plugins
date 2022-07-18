<?php

class UCDLibPluginDirectoryAPIFilters {

  public function __construct( $config ){
    $this->config = $config;

    add_action( 'rest_api_init', array($this, 'register_endpoints') );
  }

  public function register_endpoints(){

    register_rest_route($this->config['slug'], 'filters', array(
      'methods' => 'GET',
      'callback' => array($this, 'epcb_filters'),
      'permission_callback' => function (){return true;}
    ) );
  }


  // Endpoint callback for a single exhibit page
  public function epcb_filters($request){
    $out = [];

    $slug = $this->config['taxSlugs']['library'];
    $libraries = Timber::get_terms([
      'taxonomy' => $slug,
      'orderby'  => 'name',
      'order'    => 'ASC',
    ]);
    $out[$slug] = array_map(function($t) {
      return [
        'id' => $t->ID,
        'name' => $t->name
      ];
    }, $libraries);

    $slug = $this->config['postSlugs']['department'];
    $departments = Timber::get_posts([
      'post_type' => $slug,
      'orderby' => 'title',
      'order' => 'ASC',
      'posts_per_page' => -1
    ]);
    $out[$slug] = array_map(function($t) {
      return [
        'id' => $t->ID,
        'name' => $t->post_title
      ];
    }, (array)$departments);

    $slug = $this->config['taxSlugs']['directory'];
    $out[$slug] = [
      'subjectArea' => [],
      'tag' => []
    ];
    $tags = Timber::get_terms([
      'taxonomy' => $slug,
      'orderby'  => 'name',
      'order'    => 'ASC',
    ]);
    foreach ($tags as $tag) {
      $t = [
        'id' => $tag->ID,
        'name' => $tag->name
      ];
      if ( $tag->meta('isSubjectArea')) {
        $out[$slug]['subjectArea'][] = $t;
      } else {
        $out[$slug]['tag'][] = $t;
      }
    }
    
    
    return rest_ensure_response($out);
  }
  
}
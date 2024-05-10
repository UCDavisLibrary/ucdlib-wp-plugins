<?php

class UCDLibPluginDirectoryAPIFilters {

  public $config;

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
    register_rest_route($this->config['slug'], 'service-filters', array(
      'methods' => 'GET',
      'callback' => array($this, 'epcb_service_filters'),
      'permission_callback' => function (){return true;}
    ) );
  }

  public function epcb_service_filters($request){
    $out = [];

    $slug = $this->config['taxSlugs']['library'];
    $out[$slug] = $this->getLibraries($this->config['postSlugs']['service']);

    $slug = $this->config['taxSlugs']['service-type'];
    $terms = Timber::get_terms([
      'taxonomy' => $slug,
      'orderby'  => 'term_order',
      'order'    => 'ASC',
    ]);
    $out[$slug] = array_map(function($t) {
      return [
        'id' => $t->ID,
        'name' => $t->name
      ];
    }, (array)$terms);
    $out[$slug] = array_values($out[$slug]);

    return rest_ensure_response($out);
  }

  public function getLibraries($postType=''){
    $out = [];

    $slug = $this->config['taxSlugs']['library'];
    $libraries = Timber::get_terms([
      'taxonomy' => $slug,
      'orderby'  => 'name',
      'order'    => 'ASC',
    ]);
    foreach ($libraries as $library) {

      $include = true;
      if ( $postType ){
        $include = count($library->posts(['post_type' => $postType, 'posts_per_page' => 1])) > 0;
      }
      if ( $include ) {
        $out[] = [
          'id' => $library->ID,
          'name' => $library->name
        ];
      }
    }
    $out = array_values($out);

    return $out;
  }


  public function epcb_filters($request){
    $out = [];

    $slug = $this->config['taxSlugs']['library'];
    $out[$slug] = $this->getLibraries($this->config['postSlugs']['person']);

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
    $out[$slug] = array_values($out[$slug]);

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

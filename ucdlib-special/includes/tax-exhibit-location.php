<?php

// Organization Curator Taxonomy
class UCDLibPluginSpecialExhibitLocations {

  public $config;
  public $slug;

  public function __construct($config){
    $this->config = $config;
    $this->slug = $config->taxonomies['location'];

    add_action( 'init', array($this, 'register') );
    add_filter( 'rest_prepare_taxonomy', [ $this, 'hide_metabox'], 10, 3);

    add_filter( 'timber/term/classmap', array($this, 'extend_timber_class') );

  }

  // register taxonomy
  public function register(){
    $labels = [
      'name'              => _x( 'Exhibit Locations', 'taxonomy general name' ),
      'singular_name'     => _x( 'Exhibit Location', 'taxonomy singular name' ),
      'search_items'      => __( 'Search Locations' ),
      'all_items'         => __( 'All Locations' ),
      'parent_item'       => __( 'Parent Exhibit Location' ),
      'parent_item_colon' => __( 'Parent Exhibit Location:' ),
      'edit_item'         => __( 'Edit Exhibit Location' ),
      'update_item'       => __( 'Update Exhibit Location' ),
      'add_new_item'      => __( 'Add New Exhibit Location' ),
      'new_item_name'     => __( 'New Exhibit Location' ),
      'menu_name'         => __( 'Exhibit Locations' ),
    ];
    $args = [
      'labels' => $labels,
      'description' => 'Controlled list of exhibit locations',
      'public' => false,
      'publicly_queryable' => false,
      'hierarchical' => true,
      'show_ui' => true,
      'show_in_menu' => true,
      'capabilities' => [
        'manage_terms'  => $this->config->capabilities['manage_exhibits'],
        'edit_terms'    => $this->config->capabilities['manage_exhibits'],
        'delete_terms'  => $this->config->capabilities['manage_exhibits'],
        'assign_terms'  => "edit_posts"
      ],
      'show_in_nav_menus' => false,
      'show_in_rest' => true,
      'show_admin_column' => true,
      'meta_box_cb' => false
    ];

    register_taxonomy(
      $this->slug,
      [$this->config->postTypes['exhibit']],
      $args
    );

  }

  // hides taxonomy box on exhibit pages
  // we will build our own
  public function hide_metabox( $response, $taxonomy, $request ){
    $context = ! empty( $request['context'] ) ? $request['context'] : 'view';

    if( $context === 'edit'  && $taxonomy->name === $this->slug){
      $data_response = $response->get_data();
      $data_response['visibility']['show_ui'] = false;
      $response->set_data( $data_response );
    }

    return $response;

  }

  public function extend_timber_class($classmap){
    $custom_classmap = [
      $this->slug => UCDLibPluginSpecialTaxLocationTerm::class,
    ];

    return array_merge($classmap, $custom_classmap);
  }

}

class UCDLibPluginSpecialTaxLocationTerm extends \Timber\Term {

  protected $map;
  public function map(){
    if ( ! empty( $this->map ) ) {
      return $this->map;
    }
    $imgId = $this->meta('map');
    if ( !$imgId ) {
      $this->map = false;
      return $this->map;
    }
    $this->map = Timber::get_image($imgId);
    return $this->map;
  }

  protected $directions;
  public function directions(){
    if ( ! empty( $this->directions ) ) {
      return $this->directions;
    }
    $this->directions = $this->meta('directions');
    return $this->directions;
  }

}

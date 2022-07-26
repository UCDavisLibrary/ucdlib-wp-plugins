<?php

// Organization Curator Taxonomy
class UCDLibPluginSpecialCurators {
  public function __construct($config){
    $this->config = $config;
    $this->slug = $config->taxonomies['curator'];

    add_action( 'init', array($this, 'register') );
    add_filter( 'rest_prepare_taxonomy', [ $this, 'hide_metabox'], 10, 3);
    add_filter( 'query_vars', [$this, 'register_query_vars'] );
  }

  // register taxonomy
  public function register(){
    $labels = [
      'name'              => _x( 'Exhibit Curator Orgs', 'taxonomy general name' ),
      'singular_name'     => _x( 'Exhibit Curator Org', 'taxonomy singular name' ),
      'search_items'      => __( 'Search Organizations' ),
      'all_items'         => __( 'All Curator Organizations' ),
      'parent_item'       => __( 'Parent Curator Organization' ),
      'parent_item_colon' => __( 'Parent Curator Organization:' ),
      'edit_item'         => __( 'Edit Curator Organization' ),
      'update_item'       => __( 'Update Curator Organization' ),
      'add_new_item'      => __( 'Add New Curator Organization' ),
      'new_item_name'     => __( 'New Curator Organization' ),
      'menu_name'         => __( 'Curator Orgs' ),
    ];
    $args = [
      'labels' => $labels,
      'description' => 'Controlled list of curator organizations for exhibits',
      'public' => false,
      'publicly_queryable' => false,
      'hierarchical' => true,
      'show_in_menu' => true,
      'show_ui' => true,
      'show_in_nav_menus' => false,
      'show_in_rest' => true,
      'show_admin_column' => true,
      'meta_box_cb' => false,
      'capabilities' => [
        'manage_terms'  => $this->config->capabilities['manage_exhibits'],
        'edit_terms'    => $this->config->capabilities['manage_exhibits'],
        'delete_terms'  => $this->config->capabilities['manage_exhibits'],
        'assign_terms'  => "edit_posts"
      ],
    ];

    register_taxonomy(
      $this->slug, 
      [$this->config->postTypes['exhibit']],
      $args
    );
    
  }

  public function register_query_vars( $qvars ) {
    $qvars[] =  $this->slug;
    return $qvars;
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

}

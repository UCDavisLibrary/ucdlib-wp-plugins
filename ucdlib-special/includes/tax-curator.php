<?php

// Organization Curator Taxonomy
class UCDLibPluginSpecialCurators {
  public function __construct($config){
    $this->config = $config;
    $this->slug = $config->taxonomies['curator'];

    add_action( 'init', array($this, 'register') );
    add_action( 'admin_menu', array($this, 'add_to_menu'));
    add_action( 'parent_file',  array($this, 'expand_parent_menu') );
    add_filter( 'rest_prepare_taxonomy', [ $this, 'hide_metabox'], 10, 3);

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
      'menu_name'         => __( 'Exhibit Curator Orgs' ),
    ];
    $args = [
      'labels' => $labels,
      'description' => 'Controlled list of curator organizations for exhibits',
      'public' => false,
      'publicly_queryable' => false,
      'hierarchical' => true,
      'show_ui' => true,
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

  // add to plugin admin menu
  public function add_to_menu(){
    $label = 'Exhibit Curator Orgs';
    add_submenu_page($this->config->slug, $label, $label, 'edit_posts', "edit-tags.php?taxonomy=$this->slug",false );
  }

  // expand plugin menu when on taxonomy admin page
  public function expand_parent_menu($parent_file){
    if ( get_current_screen()->taxonomy == $this->slug ) {
      $parent_file = $this->config->slug;
    }
    return $parent_file;
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

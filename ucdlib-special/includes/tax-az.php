<?php

class UCDLibPluginSpecialTaxAZ {
  public function __construct( $config ){
    $this->config = $config;
    $this->slug = $config->taxonomies['az'];

    add_action( 'init', array($this, 'register') );
    add_action( 'admin_menu', array($this, 'add_to_menu'));
    add_action( 'parent_file',  array($this, 'expand_parent_menu') );
    add_filter( 'query_vars', [$this, 'register_query_vars'] );

  }

  // register taxonomy
  public function register(){
    $slug = $this->slug;
    $labels = [
      'name'              => _x( 'AZ', 'taxonomy general name' ),
      'singular_name'     => _x( 'Letter', 'taxonomy singular name' ),
      'search_items'      => __( 'Search AZ' ),
      'all_items'         => __( 'All Letters' ),
      'edit_item'         => __( 'Edit AZ' ),
      'update_item'       => __( 'Update Letter' ),
      'add_new_item'      => __( 'Add New Letter' ),
      'new_item_name'     => __( 'New Letter' ),
      'menu_name'         => __( 'AZ' ),
    ];
    $args = [
      'labels' => $labels,
      'description' => 'Collections categorized by first letter',
      'public' => true,
      'publicly_queryable' => true,
      'hierarchical' => false,
      'show_ui' => true,
      'show_in_nav_menus' => false,
      'show_in_rest' => true,
      'show_admin_column' => false,
      'meta_box_cb' => false
    ];

    register_taxonomy(
      $slug, 
      [$this->config->postTypes['collection']],
      $args
    );
    
  }

  public function register_query_vars( $qvars ) {
    $qvars[] =  $this->slug;
    $qvars[] =  "collection-tax";
    return $qvars;
  }

  // add to plugin admin menu
  public function add_to_menu(){
    $label = 'Collections A-Z';
    add_submenu_page($this->config->slug, $label, $label, 'edit_posts', "edit-tags.php?taxonomy=$this->slug",false );
  }

  // expand plugin menu when on taxonomy admin page
  public function expand_parent_menu($parent_file){
    if ( get_current_screen()->taxonomy == $this->slug ) {
      $parent_file = $this->config->slug;
    }
    return $parent_file;
  }
  
}
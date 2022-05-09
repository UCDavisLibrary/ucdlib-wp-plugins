<?php

// Service Type taxonomy
class UCDLibPluginDirectoryServiceTypes {
  public function __construct($config){
    $this->config = $config;
    $this->slug = $this->config['taxSlugs']['service-type'];

    add_action( 'init', array($this, 'register') );
    add_action( 'admin_menu', array($this, 'add_to_menu'));
    add_action( 'parent_file',  array($this, 'expand_parent_menu') );

  }

  // register taxonomy
  public function register(){
    $slug = $this->config['taxSlugs']['service-type'];
    $labels = [
      'name'              => _x( 'Service Types', 'taxonomy general name' ),
      'singular_name'     => _x( 'Service Type', 'taxonomy singular name' ),
      'search_items'      => __( 'Search Service Types' ),
      'all_items'         => __( 'All Service Types' ),
      'parent_item'       => __( 'Parent Service Type' ),
      'parent_item_colon' => __( 'Parent Service Type:' ),
      'edit_item'         => __( 'Edit Service Type' ),
      'update_item'       => __( 'Update Service Type' ),
      'add_new_item'      => __( 'Add New Service Type' ),
      'new_item_name'     => __( 'New Service Type' ),
      'menu_name'         => __( 'Service Types' ),
    ];
    $args = [
      'labels' => $labels,
      'description' => 'Controlled list of categories for Library services',
      'public' => false,
      'publicly_queryable' => false,
      'hierarchical' => false,
      'show_ui' => true,
      'show_in_nav_menus' => false,
      'show_in_rest' => true,
      'show_admin_column' => true,
      'meta_box_cb' => 'post_categories_meta_box'
    ];

    register_taxonomy(
      $slug, 
      [$this->config['postSlugs']['service']],
      $args
    );
    
  }

  // add to plugin admin menu
  public function add_to_menu(){
    $label = 'Service Types';
    add_submenu_page($this->config['slug'], $label, $label, 'edit_posts', "edit-tags.php?taxonomy=$this->slug",false );
  }

  // expand plugin menu when on taxonomy admin page
  public function expand_parent_menu($parent_file){
    if ( get_current_screen()->taxonomy == $this->slug ) {
      $parent_file = $this->config['slug'];
    }
    return $parent_file;
  }

}

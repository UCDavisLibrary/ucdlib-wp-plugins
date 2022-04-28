<?php

// Sets up the service post type and associated taxonomies
class UCDLibPluginDirectoryLibraries {
  public function __construct($config){
    $this->config = $config;

    add_action( 'init', array($this, 'register') );
    add_action( 'admin_menu', array($this, 'add_to_menu'));
  }

  // register taxonomy
  public function register(){
    $labels = [
      'name'              => _x( 'Libraries', 'taxonomy general name' ),
      'singular_name'     => _x( 'Library', 'taxonomy singular name' ),
      'search_items'      => __( 'Search Libraries' ),
      'all_items'         => __( 'All Libraries' ),
      'edit_item'         => __( 'Edit Library' ),
      'update_item'       => __( 'Update Library' ),
      'add_new_item'      => __( 'Add New Library' ),
      'new_item_name'     => __( 'New Library' ),
      'menu_name'         => __( 'Library Filters' ),
    ];
    $args = [
      'labels' => $labels,
      'description' => 'Let user filter services and people by library',
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
      $this->config['taxSlugs']['library'], 
      [$this->config['postSlugs']['service'], $this->config['postSlugs']['person']],
      $args
    );
  }

  // add admin page to custom plugin menu
  public function add_to_menu(){
    $slug = $this->config['taxSlugs']['library'];
    $label = 'Library Filters';
    add_submenu_page($this->config['slug'], $label, $label, 'edit_posts', "edit-tags.php?taxonomy=$slug",false );
  }

}
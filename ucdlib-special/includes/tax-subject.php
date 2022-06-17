<?php

class UCDLibPluginSpecialTaxSubject {
  public function __construct( $config ){
    $this->config = $config;
    $this->slug = $config->taxonomies['subject'];

    add_action( 'init', array($this, 'register') );
    add_action( 'admin_menu', array($this, 'add_to_menu'));
    add_action( 'parent_file',  array($this, 'expand_parent_menu') );
  }

  // register taxonomy
  public function register(){
    $slug = $this->slug;
    $labels = [
      'name'              => _x( 'Subjects', 'taxonomy general name' ),
      'singular_name'     => _x( 'Subject', 'taxonomy singular name' ),
      'search_items'      => __( 'Search Subjects' ),
      'all_items'         => __( 'All Subjects' ),
      'edit_item'         => __( 'Edit Subject' ),
      'update_item'       => __( 'Update Subject' ),
      'add_new_item'      => __( 'Add New Subject' ),
      'new_item_name'     => __( 'New Subject' ),
      'menu_name'         => __( 'Manuscript Subjects' ),
    ];
    $args = [
      'labels' => $labels,
      'description' => 'Manuscript subject areas',
      'public' => true,
      'publicly_queryable' => true,
      'hierarchical' => true,
      'show_ui' => true,
      'show_in_nav_menus' => false,
      'show_in_rest' => true,
      'show_admin_column' => false,
    ];

    register_taxonomy(
      $slug, 
      [$this->config->postTypes['collection']],
      $args
    );
    
  }

  // add to plugin admin menu
  public function add_to_menu(){
    $label = 'Manuscript Subjects';
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
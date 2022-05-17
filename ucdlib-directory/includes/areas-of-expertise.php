<?php

// Areas of Expertise taxonomy
// Is not filterable in people directory, just shows on person profile
class UCDLibPluginDirectoryAreasOfExpertise {
  public function __construct($config){
    $this->config = $config;
    $this->slug = $this->config['taxSlugs']['expertise'];

    add_action( 'init', array($this, 'register') );
    add_action( 'admin_menu', array($this, 'add_to_menu'));
    add_action( 'parent_file',  array($this, 'expand_parent_menu') );
  }

  // register taxonomy
  public function register(){
    $labels = [
      'name'              => _x( 'Areas of Expertise', 'taxonomy general name' ),
      'singular_name'     => _x( 'Area of Expertise', 'taxonomy singular name' ),
      'search_items'      => __( 'Search Areas of Expertise' ),
      'all_items'         => __( 'All Areas of Expertise' ),
      'edit_item'         => __( 'Edit Area of Expertise' ),
      'update_item'       => __( 'Update Area of Expertise' ),
      'add_new_item'      => __( 'Add New Area of Expertise' ),
      'new_item_name'     => __( 'New Area of Expertise' ),
      'menu_name'         => __( 'Areas of Expertise' ),
    ];
    $args = [
      'labels' => $labels,
      'description' => 'Uncontrolled list of areas of expertise assigned to people',
      'public' => false,
      'publicly_queryable' => false,
      'hierarchical' => false,
      'show_ui' => true,
      'show_in_nav_menus' => false,
      'show_in_rest' => true,
      //'show_admin_column' => true
    ];

    register_taxonomy(
      $this->slug, 
      [$this->config['postSlugs']['person']],
      $args
    );
    
  }

  // add to plugin admin menu
  public function add_to_menu(){
    $label = 'Areas of Expertise';
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

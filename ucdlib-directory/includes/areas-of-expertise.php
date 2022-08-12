<?php

// Areas of Expertise taxonomy
// Is not filterable in people directory, just shows on person profile
class UCDLibPluginDirectoryAreasOfExpertise {
  public function __construct($config){
    $this->config = $config;
    $this->slug = $this->config['taxSlugs']['expertise'];
    $this->postType = $this->config['postSlugs']['person'];

    add_action( 'init', array($this, 'register') );
    add_action( 'admin_menu', array($this, 'add_to_menu'));
    add_action( 'parent_file',  array($this, 'expand_parent_menu') );
  }

  // register taxonomy
  public function register(){
    $people = $this->config['postSlugs']['personPlural'];
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
      'capabilities' => [
        'manage_terms'  => $this->config['capabilities']['manage_directory'],
        'edit_terms'    => "edit_$people",
        'delete_terms'  => $this->config['capabilities']['manage_directory'],
        'assign_terms'  => "edit_$people"
      ],
      //'show_admin_column' => true
    ];

    register_taxonomy(
      $this->slug, 
      [$this->postType],
      $args
    );
    
  }

  // add to plugin admin menu
  public function add_to_menu(){
    $label = 'Areas of Expertise';
    add_submenu_page(
      $this->config['slug'], 
      $label, 
      $label, 
      $this->config['capabilities']['manage_directory'], 
      "edit-tags.php?taxonomy=$this->slug&post_type=$this->postType",
      false );
  }

  // expand plugin menu when on taxonomy admin page
  public function expand_parent_menu($parent_file){
    if ( get_current_screen()->taxonomy == $this->slug ) {
      $parent_file = $this->config['slug'];
    }
    return $parent_file;
  }

}

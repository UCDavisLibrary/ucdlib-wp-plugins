<?php

// Sets up library taxonomy
class UCDLibPluginDirectoryLibraries {

  public $config;
  public $slug;

  public function __construct($config){
    $this->config = $config;
    $this->slug = $this->config['taxSlugs']['library'];

    add_action( 'init', array($this, 'register') );
    add_action( 'admin_menu', array($this, 'add_to_menu'));
    add_action( 'parent_file',  array($this, 'expand_parent_menu') );
    add_filter( 'query_vars', [$this, 'register_query_vars'] );
  }

  // register taxonomy
  public function register(){
    $people = $this->config['postSlugs']['personPlural'];
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
      'hierarchical' => true,
      'show_ui' => true,
      'show_in_nav_menus' => false,
      'show_in_rest' => true,
      'capabilities' => [
        'manage_terms'  => $this->config['capabilities']['manage_directory'],
        'edit_terms'    => $this->config['capabilities']['manage_directory'],
        'delete_terms'  => $this->config['capabilities']['manage_directory'],
        'assign_terms'  => "edit_$people"
      ],
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
    $label = 'Library Filters';
    add_submenu_page($this->config['slug'], $label, $label, 'edit_posts', "edit-tags.php?taxonomy=$this->slug",false );
  }

  public function register_query_vars( $qvars ) {
    $qvars[] =  $this->slug;
    return $qvars;
}

  // expand plugin menu when on taxonomy admin page
  public function expand_parent_menu($parent_file){
    if ( get_current_screen()->taxonomy == $this->slug ) {
      $parent_file = $this->config['slug'];
    }
    return $parent_file;
  }

}

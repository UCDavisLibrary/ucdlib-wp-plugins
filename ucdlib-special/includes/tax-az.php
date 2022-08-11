<?php

class UCDLibPluginSpecialTaxAZ {
  public function __construct( $config ){
    $this->config = $config;
    $this->postType = $this->config->postTypes['collection'];
    $this->slug = $config->taxonomies['az'];

    add_action( 'init', array($this, 'register') );
    add_action( 'admin_menu', array($this, 'add_to_menu'));
    add_filter( 'parent_file',  array($this, 'expand_parent_menu') );
    add_action( 'save_post_' . $this->postType, [$this, 'assign_on_post_update'], 10, 3 );
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
      [$this->postType],
      $args
    );
    
  }

  // add to plugin admin menu
  public function add_to_menu(){
    $label = 'Collections A-Z';
    add_submenu_page($this->config->slug, $label, $label, 'edit_posts', "edit-tags.php?taxonomy=$this->slug&post_type=$this->postType",false );
  }

  // expand plugin menu when on taxonomy admin page
  public function expand_parent_menu($parent_file){
    if ( get_current_screen()->taxonomy == $this->slug ) {
      $parent_file = $this->config->slug;
    }
    return $parent_file;
  }

  public function get_first_letter($title){
    $letters = str_split(strtolower($title));
    foreach ($letters as $letter) {
      if ( is_numeric( $letter ) ){
        return "numeric";
      }
      if ( ctype_alpha($letter) ) {
        return $letter;
      }
    }
  }

  // assigns az term when a collection is updated
  public function assign_on_post_update($post_id, $post, $update){
    if ( wp_is_post_revision( $post_id ) ) {
      return;
    }
    if ( !$post->post_title ) return;
    $letter = $this->get_first_letter($post->post_title);
    if ( !$letter ) return;

    wp_set_post_terms( $post_id, $letter, $this->slug, false );
  }
}
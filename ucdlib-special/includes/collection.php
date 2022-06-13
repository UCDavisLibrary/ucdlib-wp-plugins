<?php

require_once( get_template_directory() . "/includes/classes/post.php");

// the "special collection" post type
class UCDLibPluginSpecialCollections {
  public function __construct( $config ){
    $this->config = $config;
    $this->slug = $config->postTypes['collection'];

    add_action('init', [$this, 'register']);
  }

  public function register(){
    // new posts will start with this template
    $template = [];
    
    $labels = array(
      'name'                  => _x( 'Special Collections', 'Post type general name', 'textdomain' ),
      'singular_name'         => _x( 'Special Collection', 'Post type singular name', 'textdomain' ),
      'menu_name'             => _x( 'Collections', 'Admin Menu text', 'textdomain' ),
      'name_admin_bar'        => _x( 'Special Collection', 'Add New on Toolbar', 'textdomain' ),
      'add_new'               => __( 'Add New', 'textdomain' ),
      'add_new_item'          => __( 'Add New Special Collection', 'textdomain' ),
      'new_item'              => __( 'New Special Collection', 'textdomain' ),
      'edit_item'             => __( 'Edit Special Collection', 'textdomain' ),
      'view_item'             => __( 'View Special Collection', 'textdomain' ),
      'all_items'             => __( 'All Collections', 'textdomain' ),
      'search_items'          => __( 'Search Special Collections', 'textdomain' ),
      'parent_item_colon'     => __( 'Parent Special Collections:', 'textdomain' ),
      'not_found'             => __( 'No collection found.', 'textdomain' ),
      'not_found_in_trash'    => __( 'No collection found in Trash.', 'textdomain' ),
      'featured_image'        => _x( 'Featured Image', 'textdomain' ),
      'set_featured_image'    => _x( 'Set featured image', 'textdomain' ),
      'remove_featured_image' => _x( 'Remove featured image', 'textdomain' ),
      'use_featured_image'    => _x( 'Use as featured image', 'textdomain' ),
      'archives'              => _x( 'Special Collection archives', 'textdomain' ),
      'insert_into_item'      => _x( 'Insert into special collection', 'textdomain' ),
      'uploaded_to_this_item' => _x( 'Uploaded to this special collection', 'textdomain' ),
      'filter_items_list'     => _x( 'Filter special collections', 'textdomain' ),
      'items_list_navigation' => _x( 'Special Collections list navigation', 'textdomain' ),
      'items_list'            => _x( 'Special Collections list', 'textdomain' ),
  );
    $args = array(
      'labels' => $labels,
      'description' => 'A manuscript or university archive',
      'public' => true,
      'exclude_from_search' => false,
      'publicly_queryable' => true,
      'show_ui' => true,
      'show_in_rest' => true,
      'show_in_nav_menus' => false,
      'show_in_menu' => $this->config->slug,
      'menu_position' => 15,
      'menu_icon' => 'dashicons-media-document',
      'rewrite'			  => array(
			  'with_front'	  => false,
		  ),
      'template' => $template,
      //'template_lock' => 'all',
      'supports' => array(
        'title', 
        'editor', 
        'author', 
        'thumbnail', 
        // 'excerpt', 
        //'revisions',
        'page-attributes',
        'custom-fields'
      )
    );

    register_post_type( $this->slug, $args );
  }
}

// custom post class when using timber::get_post()
class UCDLibPluginSpecialCollection extends UcdThemePost {

}
<?php

require_once( get_template_directory() . "/includes/classes/post.php");

// Sets up the person post type
class UCDLibPluginDirectoryPeople {
  public function __construct($config){
    $this->config = $config;

    add_action( 'init', array($this, 'register') );
    add_filter( 'timber/post/classmap', array($this, 'extend_timber_post') );
    add_action('init', array($this, 'register_post_meta'));
  }

  // register 'person' post type
  public function register(){
    $labels = array(
      'name'                  => _x( 'People', 'Post type general name', 'textdomain' ),
      'singular_name'         => _x( 'Person', 'Post type singular name', 'textdomain' ),
      'menu_name'             => _x( 'People', 'Admin Menu text', 'textdomain' ),
      'name_admin_bar'        => _x( 'Person', 'Add New on Toolbar', 'textdomain' ),
      'add_new'               => __( 'Add New', 'textdomain' ),
      'add_new_item'          => __( 'Add New Person', 'textdomain' ),
      'new_item'              => __( 'New Person', 'textdomain' ),
      'edit_item'             => __( 'Edit Person', 'textdomain' ),
      'view_item'             => __( 'View Person', 'textdomain' ),
      'all_items'             => __( 'All People', 'textdomain' ),
      'search_items'          => __( 'Search People', 'textdomain' ),
      'parent_item_colon'     => __( 'Parent People:', 'textdomain' ),
      'not_found'             => __( 'No people found.', 'textdomain' ),
      'not_found_in_trash'    => __( 'No people found in Trash.', 'textdomain' ),
      'featured_image'        => _x( 'Profile Image', 'Overrides the “Featured Image” phrase for this post type. Added in 4.3', 'textdomain' ),
      'set_featured_image'    => _x( 'Set profile image', 'Overrides the “Set featured image” phrase for this post type. Added in 4.3', 'textdomain' ),
      'remove_featured_image' => _x( 'Remove profile image', 'Overrides the “Remove featured image” phrase for this post type. Added in 4.3', 'textdomain' ),
      'use_featured_image'    => _x( 'Use as profile image', 'Overrides the “Use as featured image” phrase for this post type. Added in 4.3', 'textdomain' ),
      'archives'              => _x( 'Person archives', 'The post type archive label used in nav menus. Default “Post Archives”. Added in 4.4', 'textdomain' ),
      'insert_into_item'      => _x( 'Insert into person', 'Overrides the “Insert into post”/”Insert into page” phrase (used when inserting media into a post). Added in 4.4', 'textdomain' ),
      'uploaded_to_this_item' => _x( 'Uploaded to this person', 'Overrides the “Uploaded to this post”/”Uploaded to this page” phrase (used when viewing media attached to a post). Added in 4.4', 'textdomain' ),
      'filter_items_list'     => _x( 'Filter people list', 'Screen reader text for the filter links heading on the post type listing screen. Default “Filter posts list”/”Filter pages list”. Added in 4.4', 'textdomain' ),
      'items_list_navigation' => _x( 'People list navigation', 'Screen reader text for the pagination heading on the post type listing screen. Default “Posts list navigation”/”Pages list navigation”. Added in 4.4', 'textdomain' ),
      'items_list'            => _x( 'People list', 'Screen reader text for the items list heading on the post type listing screen. Default “Posts list”/”Pages list”. Added in 4.4', 'textdomain' ),
  );
    $args = array(
      'labels' => $labels,
      'description' => 'People searcheable in the directory.',
      'public' => true,
      'exclude_from_search' => false,
      'publicly_queryable' => true,
      'show_ui' => true,
      'show_in_rest' => true,
      'show_in_nav_menus' => false,
      'show_in_menu' => $this->config['slug'],
      'menu_position' => 10,
      'menu_icon' => 'dashicons-admin-users',
      'supports' => array(
        //'title', 
        'editor', 
        'author', 
        'thumbnail', 
        // 'excerpt', 
        //'revisions',
        'page-attributes',
        'custom-fields'
      )
    );

    register_post_type( $this->config['postSlugs']['person'], $args );
  }

  // register metadata for the person post type
  public function register_post_meta(){
    $slug = $this->config['postSlugs']['person'];

    register_post_meta( $slug, 'name_first', array(
      'show_in_rest' => true,
      'single' => true,
      'default' => '',
      'type' => 'string',
    ) );
    register_post_meta( $slug, 'name_last', array(
      'show_in_rest' => true,
      'single' => true,
      'default' => '',
      'type' => 'string',
    ) );

  }

  // Tell Timber to always load our custom person class when returned by a query
  public function extend_timber_post( $classmap ){
    $custom_classmap = array(
      $this->config['postSlugs']['person'] => UCDLibPluginDirectoryPerson::class,
    );

    return array_merge( $classmap, $custom_classmap );
  }

}

// custom methods to be called in templates
// where we will fetch postmeta
class UCDLibPluginDirectoryPerson extends UcdThemePost {

}
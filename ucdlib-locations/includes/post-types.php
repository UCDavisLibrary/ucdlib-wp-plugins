<?php

class UCDLibPluginLocationsPostTypes {
  public function __construct( $config ){
    $this->config = $config;

    add_action( 'init', array($this, 'registerLocation') );
  }

  public function registerLocation(){

    $labels = array(
      'name'                  => _x( 'Locations', 'Post type general name', 'textdomain' ),
      'singular_name'         => _x( 'Location', 'Post type singular name', 'textdomain' ),
      'menu_name'             => _x( 'Locations', 'Admin Menu text', 'textdomain' ),
      'name_admin_bar'        => _x( 'Location', 'Add New on Toolbar', 'textdomain' ),
      'add_new'               => __( 'Add New', 'textdomain' ),
      'add_new_item'          => __( 'Add New Location', 'textdomain' ),
      'new_item'              => __( 'New Location', 'textdomain' ),
      'edit_item'             => __( 'Edit Location', 'textdomain' ),
      'view_item'             => __( 'View Location', 'textdomain' ),
      'all_items'             => __( 'All Locations', 'textdomain' ),
      'search_items'          => __( 'Search Locations', 'textdomain' ),
      'parent_item_colon'     => __( 'Parent Locations:', 'textdomain' ),
      'not_found'             => __( 'No locations found.', 'textdomain' ),
      'not_found_in_trash'    => __( 'No locations found in Trash.', 'textdomain' ),
      'featured_image'        => _x( 'Location Cover Image', 'Overrides the “Featured Image” phrase for this post type. Added in 4.3', 'textdomain' ),
      'set_featured_image'    => _x( 'Set cover image', 'Overrides the “Set featured image” phrase for this post type. Added in 4.3', 'textdomain' ),
      'remove_featured_image' => _x( 'Remove cover image', 'Overrides the “Remove featured image” phrase for this post type. Added in 4.3', 'textdomain' ),
      'use_featured_image'    => _x( 'Use as cover image', 'Overrides the “Use as featured image” phrase for this post type. Added in 4.3', 'textdomain' ),
      'archives'              => _x( 'Location archives', 'The post type archive label used in nav menus. Default “Post Archives”. Added in 4.4', 'textdomain' ),
      'insert_into_item'      => _x( 'Insert into location', 'Overrides the “Insert into post”/”Insert into page” phrase (used when inserting media into a post). Added in 4.4', 'textdomain' ),
      'uploaded_to_this_item' => _x( 'Uploaded to this location', 'Overrides the “Uploaded to this post”/”Uploaded to this page” phrase (used when viewing media attached to a post). Added in 4.4', 'textdomain' ),
      'filter_items_list'     => _x( 'Filter locations list', 'Screen reader text for the filter links heading on the post type listing screen. Default “Filter posts list”/”Filter pages list”. Added in 4.4', 'textdomain' ),
      'items_list_navigation' => _x( 'Locations list navigation', 'Screen reader text for the pagination heading on the post type listing screen. Default “Posts list navigation”/”Pages list navigation”. Added in 4.4', 'textdomain' ),
      'items_list'            => _x( 'Locations list', 'Screen reader text for the items list heading on the post type listing screen. Default “Posts list”/”Pages list”. Added in 4.4', 'textdomain' ),
  );
    $args = array(
      'labels' => $labels,
      'description' => 'A library, building, or business unit',
      'public' => true,
      'show_in_rest' => true,
      'menu_position' => 20,
      'menu_icon' => 'dashicons-location',
      'rewrite'			  => array(
			  'with_front'	  => false,
		  ),
      'supports' => array(
        'title', 
        'editor', 
        //'author', 
        'thumbnail', 
        // 'excerpt', 
        //'revisions',
        'page-attributes'
      )
    );

    register_post_type( $this->config['postTypeSlug'], $args );
  }

}
<?php

// Sets up the service post type and associated taxonomies
class UCDLibPluginDirectoryServices {
  public function __construct($config){
    $this->config = $config;
    $this->config['postTypeSlug'] = 'service';
    $this->config['taxSlugs'] = array(
      'type' => 'service-type',
      'library' => 'service-library'
    );

    // register 'service' non-public post type
    add_action( 'init', array($this, 'register') );
    add_filter( 'timber/post/classmap', array($this, 'extend_timber_post') );

    // register taxonomies for 'service' post type
    add_action( 'init', array($this, 'register_type_taxonomy') );
    add_action( 'init', array($this, 'register_library_taxonomy') );
  }

  public function register(){
    $labels = array(
      'name'                  => _x( 'Services', 'Post type general name', 'textdomain' ),
      'singular_name'         => _x( 'Service', 'Post type singular name', 'textdomain' ),
      'menu_name'             => _x( 'Services', 'Admin Menu text', 'textdomain' ),
      'name_admin_bar'        => _x( 'Service', 'Add New on Toolbar', 'textdomain' ),
      'add_new'               => __( 'Add New', 'textdomain' ),
      'add_new_item'          => __( 'Add New Service', 'textdomain' ),
      'new_item'              => __( 'New Service', 'textdomain' ),
      'edit_item'             => __( 'Edit Service', 'textdomain' ),
      'view_item'             => __( 'View Service', 'textdomain' ),
      'all_items'             => __( 'All Services', 'textdomain' ),
      'search_items'          => __( 'Search Services', 'textdomain' ),
      'parent_item_colon'     => __( 'Parent Services:', 'textdomain' ),
      'not_found'             => __( 'No services found.', 'textdomain' ),
      'not_found_in_trash'    => __( 'No services found in Trash.', 'textdomain' ),
      'featured_image'        => _x( 'Service Cover Image', 'Overrides the “Featured Image” phrase for this post type. Added in 4.3', 'textdomain' ),
      'set_featured_image'    => _x( 'Set cover image', 'Overrides the “Set featured image” phrase for this post type. Added in 4.3', 'textdomain' ),
      'remove_featured_image' => _x( 'Remove cover image', 'Overrides the “Remove featured image” phrase for this post type. Added in 4.3', 'textdomain' ),
      'use_featured_image'    => _x( 'Use as cover image', 'Overrides the “Use as featured image” phrase for this post type. Added in 4.3', 'textdomain' ),
      'archives'              => _x( 'Service archives', 'The post type archive label used in nav menus. Default “Post Archives”. Added in 4.4', 'textdomain' ),
      'insert_into_item'      => _x( 'Insert into service', 'Overrides the “Insert into post”/”Insert into page” phrase (used when inserting media into a post). Added in 4.4', 'textdomain' ),
      'uploaded_to_this_item' => _x( 'Uploaded to this service', 'Overrides the “Uploaded to this post”/”Uploaded to this page” phrase (used when viewing media attached to a post). Added in 4.4', 'textdomain' ),
      'filter_items_list'     => _x( 'Filter services list', 'Screen reader text for the filter links heading on the post type listing screen. Default “Filter posts list”/”Filter pages list”. Added in 4.4', 'textdomain' ),
      'items_list_navigation' => _x( 'Services list navigation', 'Screen reader text for the pagination heading on the post type listing screen. Default “Posts list navigation”/”Pages list navigation”. Added in 4.4', 'textdomain' ),
      'items_list'            => _x( 'Services list', 'Screen reader text for the items list heading on the post type listing screen. Default “Posts list”/”Pages list”. Added in 4.4', 'textdomain' ),
  );
    $args = array(
      'labels' => $labels,
      'description' => 'Information about services offered by the UC Davis Library.',
      'public' => false,
      'exclude_from_search' => true,
      'publicly_queryable' => false,
      'show_ui' => true,
      'show_in_rest' => true,
      'show_in_nav_menus' => false,
      'show_in_menu' => true,
      'menu_position' => 20,
      'menu_icon' => 'dashicons-info',
      'supports' => array(
        'title', 
        //'editor', 
        //'author', 
        //'thumbnail', 
        // 'excerpt', 
        //'revisions',
        'page-attributes',
        'custom-fields'
      )
    );

    register_post_type( $this->config['postTypeSlug'], $args );
  }


  public function register_type_taxonomy(){
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
      $this->config['taxSlugs']['type'], 
      $this->config['postTypeSlug'],
      $args
    );
  }

  public function register_library_taxonomy(){
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
      'description' => 'Let user filter services by library',
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
      $this->config['postTypeSlug'],
      $args
    );
  }



  // Tell Timber to always load our custom service class when returned by a query
  public function extend_timber_post( $classmap ){
    $custom_classmap = array(
      $this->config['postTypeSlug'] => UCDLibPluginDirectoryService::class,
    );

    return array_merge( $classmap, $custom_classmap );
  }

}

// custom methods to be called in templates
class UCDLibPluginDirectoryService extends Timber\Post {

}
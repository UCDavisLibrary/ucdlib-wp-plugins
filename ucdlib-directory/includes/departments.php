<?php

require_once( __DIR__ . '/utils.php' );
require_once( get_template_directory() . "/includes/classes/post.php");

// Sets up the department post type
class UCDLibPluginDirectoryDepartments {
  public function __construct($config){
    $this->config = $config;
    $this->slug = $config['postSlugs']['department'];

    add_action( 'init', array($this, 'register') );
    add_action( 'init', [$this, 'register_post_meta'] );
    add_filter( 'timber/post/classmap', array($this, 'extend_timber_post') );
    add_filter( 'query_vars', [$this, 'register_query_vars'] );
  }

  // register 'department' non-public post type
  public function register(){
    $template = [
      [
        'ucdlib-directory/description', 
        ['placeholder' => 'About this department...']
      ],
      [
        'ucdlib-directory/contact', 
        [
          'placeholder' => 'Department contact info...',
          'allowAppointment' => false
        ]
      ]
    ];

    $labels = array(
      'name'                  => _x( 'Departments', 'Post type general name', 'textdomain' ),
      'singular_name'         => _x( 'Department', 'Post type singular name', 'textdomain' ),
      'menu_name'             => _x( 'Departments', 'Admin Menu text', 'textdomain' ),
      'name_admin_bar'        => _x( 'Department', 'Add New on Toolbar', 'textdomain' ),
      'add_new'               => __( 'Add New', 'textdomain' ),
      'add_new_item'          => __( 'Add New Department', 'textdomain' ),
      'new_item'              => __( 'New Department', 'textdomain' ),
      'edit_item'             => __( 'Edit Department', 'textdomain' ),
      'view_item'             => __( 'View Department', 'textdomain' ),
      'all_items'             => __( 'All Departments', 'textdomain' ),
      'search_items'          => __( 'Search Departments', 'textdomain' ),
      'parent_item_colon'     => __( 'Parent Departments:', 'textdomain' ),
      'not_found'             => __( 'No departments found.', 'textdomain' ),
      'not_found_in_trash'    => __( 'No departments found in Trash.', 'textdomain' ),
      'featured_image'        => _x( 'Department Cover Image', 'Overrides the “Featured Image” phrase for this post type. Added in 4.3', 'textdomain' ),
      'set_featured_image'    => _x( 'Set cover image', 'Overrides the “Set featured image” phrase for this post type. Added in 4.3', 'textdomain' ),
      'remove_featured_image' => _x( 'Remove cover image', 'Overrides the “Remove featured image” phrase for this post type. Added in 4.3', 'textdomain' ),
      'use_featured_image'    => _x( 'Use as cover image', 'Overrides the “Use as featured image” phrase for this post type. Added in 4.3', 'textdomain' ),
      'archives'              => _x( 'Department archives', 'The post type archive label used in nav menus. Default “Post Archives”. Added in 4.4', 'textdomain' ),
      'insert_into_item'      => _x( 'Insert into department', 'Overrides the “Insert into post”/”Insert into page” phrase (used when inserting media into a post). Added in 4.4', 'textdomain' ),
      'uploaded_to_this_item' => _x( 'Uploaded to this department', 'Overrides the “Uploaded to this post”/”Uploaded to this page” phrase (used when viewing media attached to a post). Added in 4.4', 'textdomain' ),
      'filter_items_list'     => _x( 'Filter departments list', 'Screen reader text for the filter links heading on the post type listing screen. Default “Filter posts list”/”Filter pages list”. Added in 4.4', 'textdomain' ),
      'items_list_navigation' => _x( 'Departments list navigation', 'Screen reader text for the pagination heading on the post type listing screen. Default “Posts list navigation”/”Pages list navigation”. Added in 4.4', 'textdomain' ),
      'items_list'            => _x( 'Departments list', 'Screen reader text for the items list heading on the post type listing screen. Default “Posts list”/”Pages list”. Added in 4.4', 'textdomain' ),
  );
    $args = array(
      'labels' => $labels,
      'description' => 'UC Davis Library departments',
      'public' => false,
      'exclude_from_search' => true,
      'publicly_queryable' => false,
      'hierarchical' => true,
      'show_ui' => true,
      'show_in_rest' => true,
      'show_in_nav_menus' => false,
      'show_in_menu' => $this->config['slug'],
      'menu_position' => 30,
      'template' => $template,
      'template_lock' => 'all',
      'supports' => array(
        'title', 
        'editor', 
        //'author', 
        //'thumbnail', 
        // 'excerpt', 
        //'revisions',
        'page-attributes',
        'custom-fields'
      )
    );

    register_post_type( $this->slug, $args );
  }

  // Tell Timber to always load our custom department class when returned by a query
  public function extend_timber_post( $classmap ){
    $custom_classmap = array(
      $this->slug => UCDLibPluginDirectoryDepartment::class,
    );

    return array_merge( $classmap, $custom_classmap );
  }

    // register custom metadata for this post type
    public function register_post_meta(){
      $slug = $this->slug;
  
      register_post_meta( $slug, 'description', array(
        'show_in_rest' => true,
        'single' => true,
        'default' => '',
        'type' => 'string',
      ) );

      UCDLibPluginDirectoryUtils::registerContactMeta($slug);

    }

    public function register_query_vars( $qvars ) {
      $qvars[] =  $this->slug;
      return $qvars;
  }

}

// custom methods to be called in templates
// where we will fetch postmeta
class UCDLibPluginDirectoryDepartment extends UcdThemePost {

  protected $description;
  public function description(){
    if ( ! empty( $this->description ) ) {
      return $this->description;
    }
    $this->description = $this->meta('description');
    return $this->description;
  }

  protected $contactInfo;
  public function contactInfo(){
    if ( ! empty( $this->contactInfo ) ) {
      return $this->contactInfo;
    }
    $this->contactInfo = [];


    $attrs['hide'] = false;
    $attrs['websites'] = $this->meta('contactWebsite');
    $attrs['emails'] = $this->meta('contactEmail');
    $attrs['phones'] = $this->meta('contactPhone');
    $attrs['appointmentUrl'] = '';
    $attrs = UCDLibPluginDirectoryUtils::formatContactList($attrs);
    
    foreach ($attrs['icons'] as $icon) {
      $this->iconsUsed[] = $icon;
    }

    
    $this->contactInfo = $attrs;
    return $this->contactInfo;
  }

}
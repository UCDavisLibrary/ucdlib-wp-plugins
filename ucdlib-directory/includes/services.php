<?php
require_once( get_template_directory() . "/includes/classes/post.php");
require_once( __DIR__ . '/utils.php' );

// Sets up the service post type
class UCDLibPluginDirectoryServices {
  public function __construct($config){
    $this->config = $config;
    $this->slug = $config['postSlugs']['service'];

    add_action( 'init', array($this, 'register') );
    add_action( 'init', [$this, 'register_post_meta']);
    add_filter( 'timber/post/classmap', array($this, 'extend_timber_post') );
  }

  // register 'service' non-public post type
  public function register(){
    $template = [
      [
        'ucdlib-directory/description', 
        ['placeholder' => 'About this service...']
      ],
      [
        'ucdlib-directory/contact', 
        [
          'placeholder' => 'Service contact info...',
          'allowAppointment' => false,
          'allowAdditionalText' => true
        ]
      ]
    ];

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
      'show_in_menu' => $this->config['slug'],
      'menu_position' => 30,
      'menu_icon' => 'dashicons-info',
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

  // Tell Timber to always load our custom service class when returned by a query
  public function extend_timber_post( $classmap ){
    $custom_classmap = array(
      $this->slug => UCDLibPluginDirectoryService::class,
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

}

// custom methods to be called in templates
// where we will fetch postmeta
class UCDLibPluginDirectoryService extends UcdThemePost {
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

  protected $description;
  public function description(){
    if ( ! empty( $this->description ) ) {
      return $this->description;
    }
    $this->description = $this->meta('description');
    return $this->description;
  }

}
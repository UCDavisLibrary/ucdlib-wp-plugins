<?php
require_once( __DIR__ . '/api-exhibit.php' );
require_once( get_template_directory() . "/includes/classes/post.php");

// the "exhibit" post type
class UCDLibPluginSpecialExhibits {
  public function __construct( $config ){
    $this->config = $config;
    $this->slug = $config->postTypes['exhibit'];

    $this->api = new UCDLibPluginSpecialAPIExhibit( $config );

    // register taxonomies

    add_action('init', [$this, 'register']);
    add_action( 'init', [$this, 'register_post_meta'] );
    add_action( 'widgets_init', [$this, 'register_sidebar'] );
    add_filter( 'timber/post/classmap', array($this, 'extend_timber_post') );
    

    add_filter( 'ucd-theme/context/single', array($this, 'set_context') );
    add_filter( 'ucd-theme/templates/single', array($this, 'set_template'), 10, 2 );
  }

  // registers the post type
  public function register(){
    
    $labels = array(
      'name'                  => _x( 'Exhibits', 'Post type general name', 'textdomain' ),
      'singular_name'         => _x( 'Exhibit', 'Post type singular name', 'textdomain' ),
      'menu_name'             => _x( 'Exhibits', 'Admin Menu text', 'textdomain' ),
      'name_admin_bar'        => _x( 'Exhibit', 'Add New on Toolbar', 'textdomain' ),
      'add_new'               => __( 'Add New', 'textdomain' ),
      'add_new_item'          => __( 'Add New Exhibit', 'textdomain' ),
      'new_item'              => __( 'New Exhibit', 'textdomain' ),
      'edit_item'             => __( 'Edit Exhibit', 'textdomain' ),
      'view_item'             => __( 'View Exhibit', 'textdomain' ),
      'all_items'             => __( 'All Exhibits', 'textdomain' ),
      'search_items'          => __( 'Search Exhibits', 'textdomain' ),
      'parent_item_colon'     => __( 'Parent Exhibit:', 'textdomain' ),
      'not_found'             => __( 'No exhibit found.', 'textdomain' ),
      'not_found_in_trash'    => __( 'No exhibit found in Trash.', 'textdomain' ),
      'featured_image'        => _x( 'Featured Image', 'textdomain' ),
      'set_featured_image'    => _x( 'Set featured image', 'textdomain' ),
      'remove_featured_image' => _x( 'Remove featured image', 'textdomain' ),
      'use_featured_image'    => _x( 'Use as featured image', 'textdomain' ),
      'archives'              => _x( 'Exhibit archives', 'textdomain' ),
      'insert_into_item'      => _x( 'Insert into exhibit', 'textdomain' ),
      'uploaded_to_this_item' => _x( 'Uploaded to this exhibit', 'textdomain' ),
      'filter_items_list'     => _x( 'Filter exhibits', 'textdomain' ),
      'items_list_navigation' => _x( 'Exhibits list navigation', 'textdomain' ),
      'items_list'            => _x( 'Exhibits list', 'textdomain' ),
    );


    $args = array(
      'labels' => $labels,
      'description' => 'A physical or online exhibit',
      'public' => true,
      'exclude_from_search' => false,
      'publicly_queryable' => true,
      'hierarchical' => true,
      'show_ui' => true,
      'show_in_rest' => true,
      'show_in_nav_menus' => false,
      'show_in_menu' => $this->config->slug,
      'menu_position' => 15,
      'menu_icon' => 'dashicons-format-image',
      'rewrite'			  => ['with_front' => false],
      //'template' => $template,
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

  // register custom metadata for this post type
  public function register_post_meta(){
    $slug = $this->slug;

    // 'physical' or 'online'
    register_post_meta( $slug, 'exhibitType', array(
      'show_in_rest' => true,
      'single' => true,
      'default' => 'physical',
      'type' => 'string',
    ) );

  }

  // Tell Timber to always load our custom person class when returned by a query
  public function extend_timber_post( $classmap ){
    $custom_classmap = array(
      $this->slug => UCDLibPluginSpecialExhibitPage::class,
    );

    return array_merge( $classmap, $custom_classmap );
  }

  // add data to view context
  public function set_context($context){
    if ( $context['post']->post_type !== $this->slug ) return $context;
    $p = $context['post'];
    $context['config'] = $this->config;
    $context['sidebar'] = Timber::get_widgets( $this->slug );
    
    return $context;
  }

  // set the twig to call
  public function set_template($templates, $context){
    if ( $context['post']->post_type !== $this->slug ) return $templates;
    
    $templates = array_merge( array("@" . $this->config->slug . "/exhibit.twig"), $templates );
    return $templates;
  }

  // edit with Appearance>>Widgets
  public function register_sidebar(){
    register_sidebar(
      array(
        'id'            => $this->slug,
        'name'          => "Single Exhibit",
        'description'   => "Sidebar widgets for a single exhibit.",
        'before_widget' => '',
        'after_widget' => ''
      )
    );
  }
}

// custom post class when using timber::get_post()
// is available in context as 'post'
class UCDLibPluginSpecialExhibitPage extends UcdThemePost {
  protected $exhibitType;
  public function exhibitType(){
    if ( ! empty( $this->exhibitType ) ) {
      return $this->exhibitType;
    }
    $this->exhibitType = $this->meta('exhibitType');

    return $this->exhibitType;
  }

  // returns top-level exhibit page
  protected $exhibit;
  public function exhibit(){
    if ( ! empty( $this->exhibit ) ) {
      return $this->exhibit;
    }
    $ancestors = $this->ancestors();
    if (count( $ancestors )) {
      $this->exhibit = end($ancestors);
    } else {
      $this->exhibit = false;
    }
    return $this->exhibit;
  }

  protected $exhibitTitle;
  public function exhibitTitle(){
    if ( ! empty( $this->exhibitTitle ) ) {
      return $this->exhibitTitle;
    }
    $ancestor = $this->exhibit();
    if ( $ancestor ) {
      $this->exhibitTitle = $ancestor->title();
    } else {
      $this->exhibitTitle = $this->title();
    }
    return $this->exhibitTitle;
  }

  protected $exhibitId;
  public function exhibitId(){
    if ( ! empty( $this->exhibitId ) ) {
      return $this->exhibitId;
    }
    $ancestor = $this->exhibit();
    if ( $ancestor ) {
      $this->exhibitId = $ancestor->id;
    } else {
      $this->exhibitId = $this->id;
    }
    return $this->exhibitId;
  }
}
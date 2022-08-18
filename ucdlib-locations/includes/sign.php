<?php

require_once( get_template_directory() . "/includes/classes/post.php");

class UCDLibPluginLocationsSigns {
  public function __construct( $config ){
    $this->config = $config;
    $this->slug = $config['postTypes']['sign'];

    add_action('init', [$this, 'register']);

    add_filter( 'ucd-theme/context/single', array($this, 'set_context') );
    add_filter( 'ucd-theme/templates/single', array($this, 'set_template'), 10, 2 );
  }

  public function register(){
    
    $labels = array(
      'name'                  => _x( 'Digital Signs', 'Post type general name', 'textdomain' ),
      'singular_name'         => _x( 'Digital Sign', 'Post type singular name', 'textdomain' ),
      'menu_name'             => _x( 'Digital Signs', 'Admin Menu text', 'textdomain' ),
      'name_admin_bar'        => _x( 'Digital Sign', 'Add New on Toolbar', 'textdomain' ),
      'add_new'               => __( 'Add New', 'textdomain' ),
      'add_new_item'          => __( 'Add New Digital Sign', 'textdomain' ),
      'new_item'              => __( 'New Digital Sign', 'textdomain' ),
      'edit_item'             => __( 'Edit Digital Sign', 'textdomain' ),
      'view_item'             => __( 'View Digital Sign', 'textdomain' ),
      'all_items'             => __( 'All Digital Signs', 'textdomain' ),
      'search_items'          => __( 'Search Digital Signs', 'textdomain' ),
      'parent_item_colon'     => __( 'Parent Digital Sign Page:', 'textdomain' ),
      'not_found'             => __( 'No sign found.', 'textdomain' ),
      'not_found_in_trash'    => __( 'No sign found in Trash.', 'textdomain' ),
      'featured_image'        => _x( 'Featured Image', 'textdomain' ),
      'set_featured_image'    => _x( 'Set featured image', 'textdomain' ),
      'remove_featured_image' => _x( 'Remove featured image', 'textdomain' ),
      'use_featured_image'    => _x( 'Use as featured image', 'textdomain' ),
      'archives'              => _x( 'Digital Sign archives', 'textdomain' ),
      'insert_into_item'      => _x( 'Insert into sign', 'textdomain' ),
      'uploaded_to_this_item' => _x( 'Uploaded to this sign', 'textdomain' ),
      'filter_items_list'     => _x( 'Filter signs', 'textdomain' ),
      'items_list_navigation' => _x( 'Digital Signs list navigation', 'textdomain' ),
      'items_list'            => _x( 'Digital Signs list', 'textdomain' ),
    );

    $template = [
      ['ucdlib-locations/sign-sections', ['lock' => ['remove' => true]], [
        ['ucdlib-locations/sign-section', 
          ['backgroundColor' => '#022851', 'textColor' => '#fff', 'alignItems' => 'center'],
          [['ucdlib-locations/sign-text', ['placeholder' => 'SIGN HEADER', 'size' => 'lg']]]
        ],
        ['ucdlib-locations/sign-section', 
          ['flexGrow' => '1', 'justifyContent' => 'center', 'alignItems' => 'center'],
          [['ucdlib-locations/sign-text', ['placeholder' => 'Body text...']]]
        ],
        ['ucdlib-locations/sign-section', 
          [ 'alignItems' => 'center' ],
          [['ucdlib-locations/sign-text', ['placeholder' => 'footer text', 'size' => 'sm']]]
        ],
      ]]
    ];

    $args = array(
      'labels' => $labels,
      'description' => 'A digital sign to be displayed by a location',
      'public' => true,
      'exclude_from_search' => false,
      'publicly_queryable' => true,
      'hierarchical' => true,
      'show_ui' => true,
      'show_in_rest' => true,
      'show_in_nav_menus' => false,
      'show_in_menu' => $this->config['slug'],
      'menu_position' => 20,
      //'menu_icon' => 'dashicons-format-image',
      'rewrite'			  => ['with_front' => false],
      'template' => $template,
      //'template_lock' => 'all',
      'supports' => array(
        'title', 
        'editor',
        'page-attributes',
        'custom-fields'
      )
    );

    register_post_type( $this->slug, $args );
  }

  // add data to view context
  public function set_context($context){
    if ( $context['post']->post_type !== $this->slug ) return $context;
    return $context;
  }

  // set the twig to call
  public function set_template($templates, $context){
    if ( $context['post']->post_type !== $this->slug ) return $templates;
    
    $templates = array_merge( array("@" . $this->config['slug'] . "/sign.twig"), $templates );
    return $templates;
  }
}

class UCDLibPluginLocationsSign extends UcdThemePost {

}
<?php

/**
 * Subject/course guide stubs.
 * So we can gracefully handle redirects to libguides if a guide doesn't have a lg counterpart
 */
class UCDLibPluginMigrationGuides {
  public function __construct( $config ){
    $this->config = $config;

    add_action('init', array($this, 'register'));
    add_filter( 'ucd-theme/context/single', array($this, 'getContext') );
    add_filter( 'ucd-theme/templates/single', array($this, 'getTemplate'), 10, 2 );
  }

  // alter context before calling the guide view
  public function getContext($context){
    if ( $context['post']->post_type !== $this->config['guideSlug'] ) return $context;

    $context['redirctUrl'] = "https://ucdavis.libguides.com/";
    $context['redirectTime'] = 30;
    $context['counterId'] = 'guideRedirectTime';

    return $context;
  }

  // register guide twig view
  public function getTemplate( $templates, $context ){
    if ( $context['post']->post_type !== $this->config['guideSlug'] ) return $templates;
    
    $templates = array_merge( array("@" . $this->config['slug'] . "/guide.twig"), $templates );

    return $templates;
  }

  public function register(){
	  $labels = array(
		  'name'                => __( 'Guide Stubs', 'text-domain' ),
		  'singular_name'       => __( 'Guide Stub', 'text-domain' ),
		  'add_new'             => _x( 'Add New Guide Stub', 'text-domain', 'text-domain' ),
		  'add_new_item'        => __( 'Add New Guide Stub', 'text-domain' ),
		  'edit_item'           => __( 'Edit Guide Stub', 'text-domain' ),
		  'new_item'            => __( 'New Guide Stub', 'text-domain' ),
		  'view_item'           => __( 'View Guide Stub', 'text-domain' ),
		  'search_items'        => __( 'Search Guide Stubs', 'text-domain' ),
		  'not_found'           => __( 'No guide stubs found', 'text-domain' ),
		  'not_found_in_trash'  => __( 'No guide stubs found in Trash', 'text-domain' ),
		  'menu_name'           => __( 'Guide Stubs', 'text-domain' ),
	  );

	  $args = array(
		  'labels' => $labels,
      'public' => true,
      'exclude_from_search' => true,
      'publicly_queryable' => true,
      'show_ui' => true,
      'show_in_menu' => true,
      'show_in_nav_menus' => false,
      'show_in_admin_bar' => true,
      'menu_icon' => 'dashicons-admin-links',
      'capabilities' => array(
        'edit_post'          => 'update_core',
        'read_post'          => 'update_core',
        'delete_post'        => 'update_core',
        'edit_posts'         => 'update_core',
        'edit_others_posts'  => 'update_core',
        'delete_posts'       => 'update_core',
        'publish_posts'      => 'update_core',
        'read_private_posts' => 'update_core'
      ),
		  'has_archive'         => false,
		  'rewrite'			  => array(
			  'slug'			  => 'guide',
			  'with_front' 	  => false,
		  ),
		  'supports'            => array(
        'title', 
        'editor', 
        'custom-fields', 
        'author'
      ),
			'show_in_rest'        => true
	  );

	  register_post_type( $this->config['guideSlug'], $args );
  }
}
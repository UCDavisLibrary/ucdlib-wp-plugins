<?php

require_once( get_template_directory() . "/includes/classes/post.php");

// Sets up the person post type
class UCDLibPluginDirectoryPeople {
  public function __construct($config){
    $this->config = $config;
    $this->slug = $this->config['postSlugs']['person'];

    add_action( 'init', array($this, 'register') );
    add_filter( 'timber/post/classmap', array($this, 'extend_timber_post') );
    add_action( 'init', array($this, 'register_post_meta') );
    add_action( 'admin_menu', array($this, 'add_shortcut_to_profile'));
    add_filter( 'manage_' . $this->slug . '_posts_columns', array($this, 'customize_admin_list_columns') );
    add_action( 'manage_' . $this->slug  . '_posts_custom_column', array($this, 'add_admin_list_column'), 10, 2);
    add_filter( 'post_row_actions', array($this, 'add_admin_list_user_link') , 10, 2);

    add_action( 'ucd-cas/login', array($this, 'transfer_ownership'), 10, 2 );
    add_action( 'ucd-theme/template/author', array($this, 'redirect_author'));
    add_filter( 'ucd-theme/context/single', array($this, 'set_context') );
    add_filter( 'ucd-theme/templates/single', array($this, 'set_template'), 10, 2 );

  }

  // register 'person' post type
  public function register(){

    $template = [
      [
        'ucdlib-directory/name', 
        ["lock" => ["move" => true, "remove" => true]]
      ],
      [
        'ucdlib-directory/title', 
        ["lock" => ["move" => true, "remove" => true]]
      ],
      [
        'ucdlib-directory/pronouns',
        ["lock" => ["move" => true, "remove" => true]]
      ],
      [
        'ucdlib-directory/library-locations',
        ["lock" => ["move" => true, "remove" => true]]
      ],
      [
        'ucdlib-directory/bio',
        ["lock" => ["move" => true, "remove" => true]]
      ],
      [
        'ucdlib-directory/expertise-areas',
        ["lock" => ["move" => true, "remove" => true]]
      ],
      [
        'ucdlib-directory/tags',
        ["lock" => ["move" => true, "remove" => true]]
      ]
    ];
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

    register_post_type( $this->config['postSlugs']['person'], $args );
  }

  // add data to view context
  public function set_context($context){
    $p = $context['post'];
    
    // custom breadcrumbs that include the directory page
    $crumbs = [
      ['title' => 'Home', 'link' => '/'],
      ['title' => $p->title(), 'link' => $p->link()]
    ];
    $directory_page = get_field('directory_page', $this->config['slug']);
    if ( $directory_page ) {
      $directory_page = Timber::get_post($directory_page);
      array_splice($crumbs, 1, 0, [['title' => $directory_page->title(), 'link' => $directory_page->link()]] );
    }
    $context['breadcrumbs'] = $crumbs;
    
    return $context;
  }

  public function set_template($templates, $context){
    if ( $context['post']->post_type !== 'person' ) return $templates;
    
    $templates = array_merge( array("@" . $this->config['slug'] . "/person.twig"), $templates );
    return $templates;
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
    register_post_meta( $slug, 'wp_user_id', array(
      'show_in_rest' => true,
      'single' => true,
      'default' => 0,
      'type' => 'number',
    ) );
    register_post_meta( $slug, 'position_dept', array(
      'show_in_rest' => true,
      'single' => true,
      'default' => 0,
      'type' => 'number',
    ) );
    register_post_meta( $slug, 'position_title', array(
      'show_in_rest' => true,
      'single' => true,
      'default' => '',
      'type' => 'string',
    ) );
    register_post_meta( $slug, 'username', array(
      'show_in_rest' => true,
      'single' => true,
      'default' => '',
      'type' => 'string',
    ) );
    register_post_meta( $slug, 'pronouns', array(
      'show_in_rest' => true,
      'single' => true,
      'default' => '',
      'type' => 'string',
    ) );
    register_post_meta( $slug, 'bio', array(
      'show_in_rest' => true,
      'single' => true,
      'default' => '',
      'type' => 'string',
    ) );
    register_post_meta( '', 'contact', array(
      'show_in_rest' => [
        'schema' => [
          'items' => [
            'type' => 'object',
            'properties' => [
              'type' => ['type' => 'string'],
              'value' => ['type' => 'string'],
              'label' => ['type' => 'string']
            ]
          ]
        ]
      ],
      'single' => true,
      'type' => 'array',
      'default' => []
    ) );
    register_post_meta( $slug, 'hide_pronouns', array(
      'show_in_rest' => true,
      'single' => true,
      'default' => false,
      'type' => 'boolean',
    ) );
    register_post_meta( $slug, 'hide_libraries', array(
      'show_in_rest' => true,
      'single' => true,
      'default' => false,
      'type' => 'boolean',
    ) );
    register_post_meta( $slug, 'hide_tags', array(
      'show_in_rest' => true,
      'single' => true,
      'default' => false,
      'type' => 'boolean',
    ) );
    register_post_meta( $slug, 'hide_expertise_areas', array(
      'show_in_rest' => true,
      'single' => true,
      'default' => false,
      'type' => 'boolean',
    ) );
    register_post_meta( $slug, 'hide_bio', array(
      'show_in_rest' => true,
      'single' => true,
      'default' => false,
      'type' => 'boolean',
    ) );
    register_post_meta( $slug, 'hide_contact', array(
      'show_in_rest' => true,
      'single' => true,
      'default' => false,
      'type' => 'boolean',
    ) );

  }

  // add an admin menu item that takes user to their person page
  public function add_shortcut_to_profile(){
    $slug = $this->config['postSlugs']['person'];
    $profile_page = "post-new.php?post_type=$slug&is_own_profile";
    
    $user = Timber::get_posts([
      'post_type' => $slug,
      'meta_key' => 'wp_user_id',
      'meta_value' => get_current_user_id(),
      'posts_per_page' => 1
    ]);
    if ( count($user) ){
      $user = $user[0];
      $profile_page = "post.php?post=$user->id&action=edit&is_own_profile";
    }

    add_menu_page( 
      __( 'Your Profile', 'textdomain' ),
      'Your Profile',
      'edit_posts',
      $profile_page,
      '',
      'dashicons-admin-users',
      20
      ); 
  }

  // redirects native wp author page to person post type
  public function redirect_author(){
    $slug = $this->config['postSlugs']['person'];
    global $wp_query;
    if ( !isset( $wp_query->query_vars['author'] ) ) return;
    
    $author = Timber::get_user( $wp_query->query_vars['author'] );
    if ( !$author ) return;

    $user = Timber::get_posts([
      'post_type' => $slug,
      'meta_key' => 'wp_user_id',
      'meta_value' => $author->id,
      'posts_per_page' => 1
    ]);
    if ( count($user) ) {
      $user = $user[0];
      wp_redirect($user->link());
      exit;
    } else {
      status_header(404);
      $views = $GLOBALS['UcdSite']->views;
      $templates = array( $views->getTemplate('404'));
      Timber::render( $templates, [] );
    }

  }

  // Tell Timber to always load our custom person class when returned by a query
  public function extend_timber_post( $classmap ){
    $custom_classmap = array(
      $this->config['postSlugs']['person'] => UCDLibPluginDirectoryPerson::class,
    );

    return array_merge( $classmap, $custom_classmap );
  }

  // customize what is displayed on the admin table that lists all people
  public function customize_admin_list_columns( $columns ){
    unset($columns['date']);
    unset($columns['author']);
    return array_merge($columns, ['department' => __('Department', 'textdomain')]);
  }

  // add new columns to the admin table
  public function add_admin_list_column( $column_key, $post_id ) {
    if ( $column_key ==  'department')
    $department = get_post_meta($post_id, 'position_dept', true);
    if ( $department ) {
      $department_name = get_the_title($department);
    }
    echo (!empty($department_name)) ? __($department_name, 'textdomain') : __('-', 'textdomain');
  }

  // Add link to wp user account for each user in the admin table that lists all people
  public function add_admin_list_user_link( $actions, $post ){
    if ( $post->post_type == $this->slug ) {
      if ( array_key_exists('inline hide-if-no-js', $actions) ) unset($actions['inline hide-if-no-js']);
      $user_id = get_post_meta($post->ID, 'wp_user_id', true);
      if ( $user_id ) {
        $actions['account'] = "<a href='/wp-admin/user-edit.php?user_id=$user_id'>User Account</a>";
      }
      $title = get_post_meta($post->ID, 'position_title', true);
      if ( $title ) {
        echo $title;
      }
    }
    return $actions;
  }

  // if a person profile has been created, but respective wp user doesn't exist yet,
  // will transfer ownership to user when they log in
  public function transfer_ownership( $user, $kerberos ){
    // bail if already has profile or no profile has kerb
    $profile = Timber::get_posts([
      'post_type' => $this->slug,
      'meta_key' => 'wp_user_id',
      'meta_value' => $user->ID,
      'posts_per_page' => 1
    ]);
    if ( count($profile) ) return;
    $profile = Timber::get_posts([
      'post_type' => $this->slug,
      'meta_key' => 'username',
      'meta_value' => $kerberos,
      'posts_per_page' => 1
    ]);
    if ( !count($profile) ) return;
    $profile = $profile[0];

    // set author and link account
    update_post_meta($profile->ID, 'wp_user_id', $user->ID);
    wp_update_post( [
      'ID' => $profile->ID,
      'post_author' => $user->ID
    ] );
  }

}

// custom methods to be called in templates
// where we will fetch postmeta
class UCDLibPluginDirectoryPerson extends UcdThemePost {

}
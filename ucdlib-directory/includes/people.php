<?php

require_once( get_template_directory() . "/includes/classes/post.php");
require_once( __DIR__ . '/api-people.php' );
require_once( __DIR__ . '/utils.php' );

// Sets up the person post type
class UCDLibPluginDirectoryPeople {

  public $config;
  public $slug;
  public $slugPlural;
  public $api;

  public function __construct($config){
    $this->config = $config;
    $this->slug = $this->config['postSlugs']['person'];
    $this->slugPlural = $this->config['postSlugs']['personPlural'];

    $this->api = new UCDLibPluginDirectoryAPIPeople( $config );

    add_action( 'init', array($this, 'register') );
    add_filter( 'timber/post/classmap', array($this, 'extend_timber_post') );
    add_action( 'init', array($this, 'register_post_meta') );
    add_action( 'admin_menu', array($this, 'add_shortcut_to_profile'));
    add_filter( 'manage_' . $this->slug . '_posts_columns', array($this, 'customize_admin_list_columns') );
    add_action( 'manage_' . $this->slug  . '_posts_custom_column', array($this, 'add_admin_list_column'), 10, 2);
    add_filter( 'post_row_actions', array($this, 'add_admin_list_user_link') , 10, 2);
    add_filter( 'query_vars', [$this, 'register_query_vars'] );
    add_action( 'admin_notices', [$this, 'addNoticeToUserSettings']);
    add_action( 'admin_bar_menu', [$this, 'modfifyAdminBar'] );

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
        'ucdlib-directory/contact',
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
      'capability_type' => [$this->slug, $this->slugPlural],
      'map_meta_cap' => true,
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
    if ( $context['post']->post_type !== $this->slug ) return $context;
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
    $context['sidebar'] = trim(Timber::get_widgets( 'single-author' ));

    return $context;
  }

  public function set_template($templates, $context){
    if ( $context['post']->post_type !== $this->slug ) return $templates;

    $templates = array_merge( array("@" . $this->config['slug'] . "/person.twig"), $templates );
    return $templates;
  }

  public function register_query_vars( $qvars ) {
    $qvars[] =  'q';
    return $qvars;
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
      'single' => false,
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
    register_post_meta( $slug, 'pastEmployee', array(
      'show_in_rest' => true,
      'single' => true,
      'default' => false,
      'type' => 'boolean',
    ) );
    register_post_meta( $slug, 'bio', array(
      'show_in_rest' => true,
      'single' => true,
      'default' => '',
      'type' => 'string',
    ) );
    UCDLibPluginDirectoryUtils::registerContactMeta($slug);
    register_post_meta( $slug, 'contactAppointmentUrl', array(
      'show_in_rest' => true,
      'single' => true,
      'default' => '',
      'type' => 'string',
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

  // get link to current user's editor profile
  protected $get_profile_editor_page;
  public function get_profile_editor_page(){
    if ( ! empty( $this->get_profile_editor_page ) ) {
      return $this->get_profile_editor_page;
    }

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

    $this->get_profile_editor_page = $profile_page;
    return $this->get_profile_editor_page;
  }

  // add an admin menu item that takes user to their person page
  public function add_shortcut_to_profile(){
    $profile_page = $this->get_profile_editor_page();

    add_menu_page(
      __( 'Your Profile', 'textdomain' ),
      'Your Profile',
      'edit_posts',
      $profile_page,
      '',
      'dashicons-admin-users',
      20
      );

      // change name of default profile menu
      global $menu;
      foreach ($menu as $i => $topMenu) {
        if ( $topMenu[0] == 'Profile') {
          $menu[$i][0] = 'Account Settings';
        }
      }
  }

  public function modfifyAdminBar($admin_bar){
    $accountLink = $admin_bar->get_node( 'edit-profile' );
    if ( $accountLink ) {
      $accountLink->title = 'Account Settings';
      $admin_bar->add_node($accountLink);
    }
    $profileLink = $admin_bar->get_node('user-info');
    if ( $profileLink ){
      $profileLink->href = $this->get_profile_editor_page();
      $admin_bar->add_node($profileLink);
    }
    $myAccountLink = $admin_bar->get_node('my-account');{
      if ( $myAccountLink ) {
        $myAccountLink->href = $this->get_profile_editor_page();
        $admin_bar->add_node($myAccountLink);
      }
    }
  }

  // prints notice on native user profile, telling users about their public profile
  public function addNoticeToUserSettings(){
    global $pagenow;
    $admin_pages = [ 'profile.php' ];
    if ( in_array( $pagenow, $admin_pages ) ) {
      $context = ['profile' => $this->get_profile_editor_page()];
      Timber::render('@' . $this->config['slug'] . '/admin/profile-notice.twig', $context);
    }
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
    }

    $user = Timber::get_posts([
      'post_type' => $slug,
      'meta_key' => 'username',
      'meta_value' => $author->user_login,
      'posts_per_page' => 1
    ]);
    if ( count($user) ) {
      $user = $user[0];
      wp_redirect($user->link());
      exit;
    }

    $context = Timber::context();
    $title = "Page Not Found";
    $context['title'] = $title;
    status_header(404);

    $widgetArea =  Timber::get_widgets( 'four-oh-four' );
    if ( trim($widgetArea) ) {
      $context['content'] = $widgetArea;
    } else {
      $context['content'] = "<p>Sorry, we couldn't find what you're looking for.</p>";
    }

    $context['breadcrumbs'] = [
      ['link' => '/', 'title' => 'Home'],
      ['link' => "", 'title' => $title]
    ];
    $views = $GLOBALS['UcdSite']->views;
    $templates = array( $views->getTemplate('404'));
    Timber::render( $templates, $context );
    exit;

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
    if ( $column_key ==  'department') {
      $departments = get_post_meta($post_id, 'position_dept', false);
      $department_names = [];
      if ( $departments ) {
        foreach ($departments as $department) {
          $department_name = get_the_title($department);
          if ( $department_name ) {
            $department_names[] = $department_name;
          }
        }

      }
      echo (count($department_names)) ? __(implode(', ', $department_names), 'textdomain') : __('-', 'textdomain');
    }

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
    update_post_meta($profile->ID, 'username', $kerberos);
    wp_update_post( [
      'ID' => $profile->ID,
      'post_author' => $user->ID
    ] );
  }

}

// custom methods to be called in templates
// where we will fetch postmeta
class UCDLibPluginDirectoryPerson extends UcdThemePost {

  protected $user;
  public function user(){
    if ( ! empty( $this->user ) ) {
      return $this->user;
    }
    $this->user = null;
    $ids = [
      ['user' => 'id', 'profile' => 'wp_user_id'],
      ['user' => 'login', 'profile' => 'username']
    ];

    foreach ($ids as $id) {
      $meta = $this->meta($id['profile']);
      if ( !$meta ) continue;
      $this->user = get_user_by( $id['user'], $meta );
      if ( $this->user ) break;
    }

    return $this->user;
  }

  protected $email;
  public function email(){
    if ( ! empty( $this->email ) ) {
      return $this->email;
    }
    $this->email = '';
    if ( $this->user() ) {
      $this->email = $this->user()->get('user_email');
    } else {
      $emails = $this->meta('contactEmail');
      if ( is_array($emails) && count($emails) ) {
        $this->email = $emails[0]['value'];
      }
    }

    return $this->email;
  }

  protected $pastEmployee;
  public function pastEmployee(){
    if ( ! empty( $this->pastEmployee ) ) {
      return $this->pastEmployee;
    }
    $this->pastEmployee = $this->meta('pastEmployee');
    return $this->pastEmployee;
  }

  protected $name_first;
  public function name_first(){
    if ( ! empty( $this->name_first ) ) {
      return $this->name_first;
    }
    $this->name_first = $this->meta('name_first');
    return $this->name_first;
  }

  protected $name_last;
  public function name_last(){
    if ( ! empty( $this->name_last ) ) {
      return $this->name_last;
    }
    $this->name_last = $this->meta('name_last');
    return $this->name_last;
  }

  protected $positionTitle;
  public function positionTitle(){
    if ( ! empty( $this->positionTitle ) ) {
      return $this->positionTitle;
    }
    $this->positionTitle = $this->meta('position_title');
    return $this->positionTitle;
  }

  protected $pronouns;
  public function pronouns(){
    if ( ! empty( $this->pronouns ) ) {
      return $this->pronouns;
    }
    if ( $this->meta('hide_pronouns')) {
      $this->pronouns = '';
    } else {
      $this->pronouns = $this->meta('pronouns');
    }
    return $this->pronouns;
  }

  protected $bio;
  public function bio(){
    if ( ! empty( $this->bio ) ) {
      return $this->bio;
    }
    if ( $this->meta('hide_bio')) {
      $this->bio = '';
    } else {
      $this->bio = $this->meta('bio');
    }
    return $this->bio;
  }

  protected $libraries;
  public function libraries(){
    if ( ! empty( $this->libraries ) ) {
      return $this->libraries;
    }
    if ( $this->meta('hide_libraries')) {
      $this->libraries = [];
    } else {
      $this->libraries = $this->terms(['taxonomy' => 'library', 'orderby' => 'name', 'order' => 'ASC']);
    }
    return $this->libraries;
  }

  protected $directoryTags;
  public function directoryTags(){
    if ( ! empty( $this->directoryTags ) ) {
      return $this->directoryTags;
    }
    if ( $this->meta('hide_tags')) {
      $this->directoryTags = [];
    } else {
      $this->directoryTags = $this->terms(['taxonomy' => 'directory-tag', 'orderby' => 'name', 'order' => 'ASC']);
    }
    return $this->directoryTags;
  }

  protected $expertiseAreas;
  public function expertiseAreas(){
    if ( ! empty( $this->expertiseAreas ) ) {
      return $this->expertiseAreas;
    }
    if ( $this->meta('hide_expertise_areas')) {
      $this->expertiseAreas = [];
    } else {
      $this->expertiseAreas = $this->terms(['taxonomy' => 'expertise-areas', 'orderby' => 'name', 'order' => 'ASC']);
    }
    return $this->expertiseAreas;
  }

  protected $departmentIds;
  public function departmentIds(){
    if ( ! empty( $this->departmentIds ) ) {
      return $this->departmentIds;
    }
    $ids = get_post_meta($this->ID, 'position_dept', false);
    $ids = $ids ? $ids : [];
    $this->departmentIds = $ids;
    return $this->departmentIds;
  }

  // returns first department only
  // for backwards compatibility
  protected $departmentId;
  public function departmentId(){
    if ( ! empty( $this->departmentId ) ) {
      return $this->departmentId;
    }
    $deptIds = $this->departmentIds();
    if ( count($deptIds) ){
      $this->departmentId = $deptIds[0];
    } else {
      $this->departmentId = NULL;
    }

    return $this->departmentId;
  }

  // returns first department only
  // for backwards compatibility
  protected $department;
  public function department(){
    if ( ! empty( $this->department ) ) {
      return $this->department;
    }

    $this->department = null;
    $departmentId = $this->departmentId();
    if ( $departmentId ) {
      $this->department = Timber::get_post($departmentId);
    }

    return $this->department;
  }

  protected $departments;
  public function departments(){
    if ( ! empty( $this->departments ) ) {
      return $this->departments;
    }
    $this->departments = [];
    $deptIds = $this->departmentIds();
    if ( count($deptIds) ) {
      $this->departments = Timber::get_posts([
        'post_type' => 'department',
        'ignore_sticky_posts' => true,
        'posts_per_page' => -1,
        'post__in' => $deptIds,
        'orderby' => 'post__in'
      ]);
    }
    return $this->departments;
  }

  protected $appointmentLink;
  public function appointmentLink(){
    if ( ! empty( $this->appointmentLink ) ) {
      return $this->appointmentLink;
    }
    $this->appointmentLink = $this->meta('contactAppointmentUrl');
    return $this->appointmentLink;
  }

  protected $contactInfo;
  public function contactInfo(){
    if ( ! empty( $this->contactInfo ) ) {
      return $this->contactInfo;
    }
    $this->contactInfo = [];


    $attrs['hide'] = $this->meta('hide_contact');
    $attrs['websites'] = $this->meta('contactWebsite');
    $attrs['emails'] = $this->meta('contactEmail');
    $attrs['phones'] = $this->meta('contactPhone');
    $attrs['appointmentUrl'] = $this->meta('contactAppointmentUrl');
    $attrs = UCDLibPluginDirectoryUtils::formatContactList($attrs);

    foreach ($attrs['icons'] as $icon) {
      $this->iconsUsed[] = $icon;
    }


    $this->contactInfo = $attrs;
    return $this->contactInfo;
  }

  protected $elasticSearchClient;
  public function elasticSearchClient(){
    if ( ! empty( $this->elasticSearchClient ) ) {
      return $this->elasticSearchClient;
    }
    $isActive = in_array( 'ucdlib-search/ucdlib-search.php', get_option( 'active_plugins', array() ), true );
    if ( !$isActive ){
      $this->elasticSearchClient = false;
      return $this->elasticSearchClient;
    }
    require_once( WP_PLUGIN_DIR . "/ucdlib-search/includes/elasticsearch.php");
    $this->elasticSearchClient = new UCDLibPluginSearchElasticsearch(false, false);
    return $this->elasticSearchClient;

  }

  protected $typeAggs;
  public function typeAggs(){
    if ( ! empty( $this->typeAggs ) ) {
      return $this->typeAggs;
    }
    $this->typeAggs = false;
    $es = $this->elasticSearchClient();
    if ( !$es ) {
      return $this->typeAggs;
    }
    try {
      $results = $es->getAuthorTypeAggs($this->email());
      $results = $results['aggregations']['types']['buckets'];
    } catch (\Throwable $th) {
      return $this->typeAggs;
    }

    $this->typeAggs = [];
    foreach ($results as $t) {
      $this->typeAggs[$t['key']] = $t['doc_count'];
    }
    return $this->typeAggs;
  }
}

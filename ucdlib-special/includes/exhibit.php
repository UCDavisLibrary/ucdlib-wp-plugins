<?php
require_once( __DIR__ . '/api-exhibit.php' );
require_once( __DIR__ . '/config.php' );
require_once( __DIR__ . '/tax-curator.php' );
require_once( __DIR__ . '/tax-exhibit-location.php' );
require_once( get_template_directory() . "/includes/classes/post.php");

// the "exhibit" post type
class UCDLibPluginSpecialExhibits {
  public function __construct( $config ){
    $this->config = $config;
    $this->slug = $config->postTypes['exhibit'];

    $this->api = new UCDLibPluginSpecialAPIExhibit( $config );

    // register taxonomies
    $this->curators = new UCDLibPluginSpecialCurators( $config );
    $this->locations = new UCDLibPluginSpecialExhibitLocations( $config );

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
      'parent_item_colon'     => __( 'Parent Exhibit Page:', 'textdomain' ),
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
      'show_in_menu' => true,
      'menu_position' => 20,
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

    register_post_meta( $slug, 'isOnline', array(
      'show_in_rest' => true,
      'single' => true,
      'default' => false,
      'type' => 'boolean',
    ) );
    register_post_meta( $slug, 'isPhysical', array(
      'show_in_rest' => true,
      'single' => true,
      'default' => false,
      'type' => 'boolean',
    ) );
    register_post_meta( $slug, 'isPermanent', array(
      'show_in_rest' => true,
      'single' => true,
      'default' => false,
      'type' => 'boolean',
    ) );
    register_post_meta( $slug, 'dateFrom', array(
      'show_in_rest' => true,
      'single' => true
    ) );
    register_post_meta( $slug, 'dateTo', array(
      'show_in_rest' => true,
      'single' => true
    ) );
    register_post_meta( $slug, 'curators', array(
      'show_in_rest' => [
        'schema' => ['items' => ['type' => 'number']]
      ],
      'single' => true,
      'default' => [],
      'type' => 'array'
    ) );
    register_post_meta( $slug, 'locationDirections', array(
      'show_in_rest' => true,
      'single' => true,
      'default' => '',
      'type' => 'string',
    ) );
    register_post_meta( $slug, 'locationMap', array(
      'show_in_rest' => true,
      'single' => true,
      'default' => 0,
      'type' => 'number',
    ) );
    register_post_meta( $slug, 'curationNotes', array(
      'show_in_rest' => true,
      'single' => true,
      'default' => '',
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

    // put exhibits lander in breadcrumbs
    $crumbs = $p->breadcrumbs();
    $exhibitsLander = get_field('asc_exhibits_page', $this->config->slug);
    if ( $exhibitsLander ){
      $exhibitsLander = Timber::get_post($exhibitsLander);
      if ( $exhibitsLander ) {
        $exhibitsLanderCrumbs = $exhibitsLander->breadcrumbs();
        if ( $exhibitsLanderCrumbs && count($exhibitsLanderCrumbs) ){
          $crumbs = array_merge($exhibitsLanderCrumbs, array_slice($crumbs, 1));
        }
      }
    }
    $context['breadcrumbs'] = $crumbs;

    $context['config'] = $this->config;
    $context['sidebar'] = trim(Timber::get_widgets( $this->slug ));
    
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

  // override children method to only return exhibit pages
  // just makes things easier
  protected $children;
  public function children($post_type = 'any'){
    if ( ! empty( $this->children ) ) {
      return $this->children;
    }
    $slug = UCDLibPluginSpecialConfig::$config['postTypes']['exhibit'];
    $this->children = parent::children($slug);
    return $this->children;
  }

  protected $exhibitIsHierarchical;
  public function exhibitIsHierarchical(){
    if ( ! empty( $this->exhibitIsHierarchical ) ) {
      return $this->exhibitIsHierarchical;
    }
    $exhibit = $this->exhibit();
    $this->exhibitIsHierarchical = count($exhibit->children()) ? true : false;
    return $this->exhibitIsHierarchical;
  }

  protected $isTopPage;
  public function isTopPage() {
    if ( ! empty( $this->isTopPage ) ) {
      return $this->isTopPage;
    }
    $exhibit = $this->exhibit();
    $this->isTopPage = $exhibit->id == $this->id ? true : false;
    return $this->isTopPage;
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
      $this->exhibit = $this;
    }
    return $this->exhibit;
  }

  protected $exhibitTitle;
  public function exhibitTitle(){
    if ( ! empty( $this->exhibitTitle ) ) {
      return $this->exhibitTitle;
    }
    $ancestor = $this->exhibit();
    $this->exhibitTitle = $this->exhibit()->title();
    return $this->exhibitTitle;
  }

  protected $exhibitId;
  public function exhibitId(){
    if ( ! empty( $this->exhibitId ) ) {
      return $this->exhibitId;
    }
    $this->exhibitId = $this->exhibit()->id;
    return $this->exhibitId;
  }

  protected $exhibitIsOnline;
  public function exhibitIsOnline(){
    if ( ! empty( $this->exhibitIsOnline ) ) {
      return $this->exhibitIsOnline;
    }
    $this->exhibitIsOnline = $this->exhibit()->meta('isOnline');
    return $this->exhibitIsOnline;
  }

  protected $exhibitIsPhysical;
  public function exhibitIsPhysical(){
    if ( ! empty( $this->exhibitIsPhysical ) ) {
      return $this->exhibitIsPhysical;
    }
    $this->exhibitIsPhysical = $this->exhibit()->meta('isPhysical');
    return $this->exhibitIsPhysical;
  }

  protected $exhibitIsPermanent;
  public function exhibitIsPermanent(){
    if ( ! empty( $this->exhibitIsPermanent ) ) {
      return $this->exhibitIsPermanent;
    }
    $this->exhibitIsPermanent = $this->exhibit()->meta('isPermanent');
    return $this->exhibitIsPermanent;
  }

  protected $exhibitIsPast;
  public function exhibitIsPast(){
    if ( ! empty( $this->exhibitIsPast ) ) {
      return $this->exhibitIsPast;
    }
    if ( 
      $this->exhibitIsPermanent() || 
      !$this->exhibitIsPhysical() ||
      !$this->exhibitDateTo() ){
      $this->exhibitIsPast = false;
    } else {
      $tz = new DateTimeZone("America/Los_Angeles");
      $end = $this->exhibitDateTo();
      $end = substr($end, 0, 4) . '-' .  substr($end, 4, 2) . '-' . substr($end, 6, 2) . 'T00:00:00';
      $end = new DateTime($end, $tz);
      $now = new DateTime('today', $tz);
      $this->exhibitIsPast = $now > $end;
    } 

    return $this->exhibitIsPast;
  }

  protected $exhibitDateFrom;
  public function exhibitDateFrom(){
    if ( ! empty( $this->exhibitDateFrom ) ) {
      return $this->exhibitDateFrom;
    }
    $this->exhibitDateFrom = $this->exhibit()->meta('dateFrom');
    return $this->exhibitDateFrom;
  }

  protected $exhibitDateTo;
  public function exhibitDateTo(){
    if ( ! empty( $this->exhibitDateTo ) ) {
      return $this->exhibitDateTo;
    }
    $this->exhibitDateTo = $this->exhibit()->meta('dateTo');
    return $this->exhibitDateTo;
  }

  protected $exhibitDateRange;
  public function exhibitDateRange(){
    if ( ! empty( $this->exhibitDateRange ) ) {
      return $this->exhibitDateRange;
    }
    if ( $this->exhibitDateFrom() && $this->exhibitDateTo() ){
      $from = wp_date( get_option( 'date_format' ), strtotime($this->exhibitDateFrom()), new DateTimeZone( "UTC" ));
      $to = wp_date( get_option( 'date_format' ), strtotime($this->exhibitDateTo()), new DateTimeZone( "UTC" ));
      $this->exhibitDateRange = $from . ' - ' . $to;
    } else {
      $this->exhibitDateRange = '';
    }
    return $this->exhibitDateRange;
  }

  protected $exhibitCurators;
  public function exhibitCurators(){
    if ( ! empty( $this->exhibitCurators ) ) {
      return $this->exhibitCurators;
    }
    $curators = $this->exhibit()->meta('curators');
    if ( count($curators) ) {
      $q = [
        'post__in' => $curators, 
        'ignore_sticky_posts' => true, 
        'post_type' => 'any',
        'orderby' => 'post__in'
      ];
      $this->exhibitCurators = Timber::get_posts($q);
    } else {
      $this->exhibitCurators = $curators;
    }

    return $this->exhibitCurators;
  }

  protected $exhibitLocationDirections;
  public function exhibitLocationDirections(){
    if ( ! empty( $this->exhibitLocationDirections ) ) {
      return $this->exhibitLocationDirections;
    }
    $this->exhibitLocationDirections = $this->exhibit()->meta('locationDirections');
    return $this->exhibitLocationDirections;
  }

  protected $exhibitCuratorOrgs;
  public function exhibitCuratorOrgs(){
    if ( ! empty( $this->exhibitCuratorOrgs ) ) {
      return $this->exhibitCuratorOrgs;
    }
    $this->exhibitCuratorOrgs = $this->exhibit()->curatorOrgs();
    return $this->exhibitCuratorOrgs;
  }

  protected $curatorOrgs;
  public function curatorOrgs(){
    if ( ! empty( $this->curatorOrgs ) ) {
      return $this->curatorOrgs;
    }
    $terms = get_the_terms( $this->id, UCDLibPluginSpecialConfig::$config['taxonomies']['curator']);
    $this->curatorOrgs = $terms ? $terms : [];
    return $this->curatorOrgs;
  }

  protected $exhibitLocations;
  public function exhibitLocations(){
    if ( ! empty( $this->exhibitLocations ) ) {
      return $this->exhibitLocations;
    }
    $this->exhibitLocations = $this->exhibit()->locations();
    return $this->exhibitLocations;
  }

  protected $locations;
  public function locations(){
    if ( ! empty( $this->locations ) ) {
      return $this->locations;
    }
    $terms = get_the_terms( $this->id, UCDLibPluginSpecialConfig::$config['taxonomies']['location']);
    $this->locations = $terms ? $terms : [];
    return $this->locations;
  }

  protected $exhibitLocationMap;
  public function exhibitLocationMap(){
    if ( ! empty( $this->exhibitLocationMap ) ) {
      return $this->exhibitLocationMap;
    }
    $this->exhibitLocationMap = $this->exhibit()->locationMap();
    return $this->exhibitLocationMap;
  }

  protected $locationMap;
  public function locationMap(){
    if ( ! empty( $this->locationMap ) ) {
      return $this->locationMap;
    }
    $mapId = $this->meta('locationMap');
    $this->locationMap = [ 'id' => $mapId ];
    if ( $mapId ) {
      $map = Timber::get_image($mapId);
      if ( $map ) {
        $this->locationMap['url'] = $map->src();
      }
    }
    return $this->locationMap;
  }

  protected $siblings;
  public function siblings(){
    if ( ! empty( $this->siblings ) ) {
      return $this->siblings;
    }
    $this->siblings = [];
    if ( $this->parent() ){
      $siblings = [];
      foreach ($this->parent()->children() as $s) {
        $siblings[] = $s;
      }
      $this->siblings = $siblings;
    }
    return $this->siblings;
  }

  protected $nextPage;
  public function nextPage(){
    if ( ! empty( $this->nextPage ) ) {
      return $this->nextPage;
    }

    $this->nextPage = null;
    $children = $this->children();

    if ( count($children) ){
      foreach ($children as $child) {
        $this->nextPage = $child;
        break;
      }
    } elseif ( count($this->siblings()) ) {
      $found_self = false;
      foreach ($this->siblings() as $sibling) {
        if ( $found_self ) {
          $this->nextPage = $sibling;
          break;
        }
        if ( $sibling->id == $this->id ) $found_self = true;

      }
    }
    return $this->nextPage;
  }

  protected $prevPage;
  public function prevPage(){
    if ( ! empty( $this->prevPage ) ) {
      return $this->prevPage;
    }
    $this->prevPage = null;
    $found_self = false;
    foreach (array_reverse($this->siblings()) as $sibling) {
      if ( $found_self ) {
        $this->prevPage = $sibling;
        break;
      }
      if ( $sibling->id == $this->id ) $found_self = true;
    }
    if ( !$this->prevPage && $this->parent() ) {
      $this->prevPage = $this->parent();
    }

    return $this->prevPage;
  }
}
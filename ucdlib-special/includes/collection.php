<?php
require_once( __DIR__ . '/block-transformations.php' );
require_once( __DIR__ . '/config.php' );
require_once( __DIR__ . '/tax-az.php' );
require_once( __DIR__ . '/tax-subject.php' );
require_once( __DIR__ . '/api.php' );

require_once( get_template_directory() . "/includes/classes/post.php");

// the "collection" post type
class UCDLibPluginSpecialCollections {
  public function __construct( $config ){
    $this->config = $config;
    $this->slug = $config->postTypes['collection'];
    $this->manuscriptSlug = 'manuscript';
    $this->UASlug = 'university-archive';
    $this->api = new UCDLibPluginSpecialAPI( $config );


    // register taxonomies
    $this->taxAZ = new UCDLibPluginSpecialTaxAZ( $config );
    $this->subjects = new UCDLibPluginSpecialTaxSubject ( $config );

    add_action('init', [$this, 'register']);
    add_action( 'init', [$this, 'register_post_meta'] );
    add_action( 'widgets_init', [$this, 'register_sidebar'] );

    add_filter( 'ucd-theme/context/single', array($this, 'set_context') );
    add_filter( 'ucd-theme/templates/single', array($this, 'set_template'), 10, 2 );
  }

  // registers the post type
  public function register(){
    // new posts will start with this template
    $template = [
      ['ucd-theme/special-description'],
      ['ucd-theme/special-finding-aid'],
      ['ucd-theme/special-inclusive-dates'],
      ['ucd-theme/special-extent'],
      ['ucd-theme/special-subject'],
      ['ucd-theme/special-additional-info'],
    ];
    
    $labels = array(
      'name'                  => _x( 'Collections', 'Post type general name', 'textdomain' ),
      'singular_name'         => _x( 'Collection', 'Post type singular name', 'textdomain' ),
      'menu_name'             => _x( 'Collections', 'Admin Menu text', 'textdomain' ),
      'name_admin_bar'        => _x( 'Collection', 'Add New on Toolbar', 'textdomain' ),
      'add_new'               => __( 'Add New', 'textdomain' ),
      'add_new_item'          => __( 'Add New Collection', 'textdomain' ),
      'new_item'              => __( 'New Collection', 'textdomain' ),
      'edit_item'             => __( 'Edit Collection', 'textdomain' ),
      'view_item'             => __( 'View Collection', 'textdomain' ),
      'all_items'             => __( 'All Collections', 'textdomain' ),
      'search_items'          => __( 'Search Collections', 'textdomain' ),
      'parent_item_colon'     => __( 'Parent Collections:', 'textdomain' ),
      'not_found'             => __( 'No collection found.', 'textdomain' ),
      'not_found_in_trash'    => __( 'No collection found in Trash.', 'textdomain' ),
      'featured_image'        => _x( 'Featured Image', 'textdomain' ),
      'set_featured_image'    => _x( 'Set featured image', 'textdomain' ),
      'remove_featured_image' => _x( 'Remove featured image', 'textdomain' ),
      'use_featured_image'    => _x( 'Use as featured image', 'textdomain' ),
      'archives'              => _x( 'Collection archives', 'textdomain' ),
      'insert_into_item'      => _x( 'Insert into collection', 'textdomain' ),
      'uploaded_to_this_item' => _x( 'Uploaded to this collection', 'textdomain' ),
      'filter_items_list'     => _x( 'Filter collections', 'textdomain' ),
      'items_list_navigation' => _x( 'Collections list navigation', 'textdomain' ),
      'items_list'            => _x( 'Collections list', 'textdomain' ),
  );

  // permalink nested under asc department page
  $rewrite = ['with_front' => false];
  $deptHomePage = UCDLibPluginSpecialBlockTransformations::deptLanderLink()['dept_page_link'];
  if ( $deptHomePage ) {
    $rewrite['slug'] = trailingslashit(parse_url($deptHomePage)['path']) . $this->slug;
  }

    $args = array(
      'labels' => $labels,
      'description' => 'A manuscript or university archive',
      'public' => true,
      'exclude_from_search' => false,
      'publicly_queryable' => true,
      'show_ui' => true,
      'show_in_rest' => true,
      'show_in_nav_menus' => false,
      'show_in_menu' => $this->config->slug,
      'menu_position' => 15,
      'menu_icon' => 'dashicons-media-document',
      'rewrite'			  => $rewrite,
      'template' => $template,
      'template_lock' => 'all',
      'capability_type' => 'collection',
      'map_meta_cap' => true,
      'supports' => array(
        'title', 
        'editor', 
        // 'author', 
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

    // 'manuscript' or 'university-archive'
    register_post_meta( $slug, 'collectionType', array(
      'show_in_rest' => true,
      'single' => true,
      'default' => $this->manuscriptSlug,
      'type' => 'string',
    ) );

  }

  // Tell Timber to always load our custom person class when returned by a query
  public function extend_timber_post( $classmap ){
    $custom_classmap = array(
      $this->slug => UCDLibPluginSpecialCollection::class,
    );

    return array_merge( $classmap, $custom_classmap );
  }

  // add data to view context
  public function set_context($context){
    if ( $context['post']->post_type !== $this->slug ) return $context;
    $p = $context['post'];
    $context['config'] = $this->config;
    $context['sidebar'] = Timber::get_widgets( $p->collectionType() );
    return $context;
  }

  // set the twig to call
  public function set_template($templates, $context){
    if ( $context['post']->post_type !== $this->slug ) return $templates;
    
    $templates = array_merge( array("@" . $this->config->slug . "/collection.twig"), $templates );
    return $templates;
  }

  // edit with Appearance>>Widgets
  public function register_sidebar(){
    register_sidebar(
      array(
        'id'            => $this->manuscriptSlug,
        'name'          => "Single Manuscript",
        'description'   => "Sidebar widgets for a single manuscript item.",
        'before_widget' => '',
        'after_widget' => ''
      )
    );
    register_sidebar(
      array(
        'id'            => $this->UASlug,
        'name'          => "Single University Collection",
        'description'   => "Widgets for a single university archive item.",
        'before_widget' => '',
        'after_widget' => ''
      )
    );
  }
}

// custom post class when using timber::get_post()
// is available in context as 'post'
class UCDLibPluginSpecialCollection extends UcdThemePost {
  
  protected $core_data;
  public function core_data(){
    if ( ! empty( $this->core_data ) ) {
      return $this->core_data;
    }
    $out = array(
      'id' => $this->ID,
      'title' => $this->title(),
      'collectionType' => $this->collectionType(),
      'callNumber' => $this->callNumber(),
      'biography' => $this->biography(),
      'almaRecordId' => $this->almaRecordId(),
      'creator' => $this->creator(),
      'author' => $this->author(),
      'language' => $this->language(),
      'description' => $this->description(),
      'material' => $this->material(),
      'original' => $this->original(),
      'photographer' => $this->photographer(),
      'location' => $this->location(),
      'repository' => $this->repository(),
      'shelf' => $this->shelf(),
      'source' => $this->source(),
      'dates' => $this->dates(),
      'extent' => $this->extent(),
      'finding_aid' => $this->finding_aid(),
      'subject' => $this->subject(),
      'links' => $this->links(),
    );

    $this->core_data = $out;
    return $this->core_data;
  }

  protected $collectionType;
  public function collectionType(){
    if ( ! empty( $this->collectionType ) ) {
      return $this->collectionType;
    }
    $collectionType = $this->meta('collectionType');
    $this->collectionType = $collectionType;

    return $this->collectionType;
  }

  protected $callNumber;
  public function callNumber(){
    if ( ! empty( $this->callNumber ) ) {
      return $this->callNumber;
    }
    $callNumber = $this->meta('callNumber');
    $this->callNumber = $callNumber;

    return $this->callNumber;
  }

  protected $biography;
  public function biography(){
    if ( ! empty( $this->biography ) ) {
      return $this->biography;
    }
    $biography = $this->meta('biography');
    $this->biography = $biography;

    return $this->biography;
  }

  protected $almaRecordId;
  public function almaRecordId(){
    if ( ! empty( $this->almaRecordId ) ) {
      return $this->almaRecordId;
    }
    $almaRecordId = $this->meta('almaRecordId');
    $this->almaRecordId = $almaRecordId;

    return $this->almaRecordId;
  }

  protected $creator;
  public function creator(){
    if ( ! empty( $this->creator ) ) {
      return $this->creator;
    }
    $creator = $this->meta('creator');
    $this->creator = $creator;

    return $this->creator;
  }

  protected $author;
  public function author(){
    if ( ! empty( $this->author ) ) {
      return $this->author;
    }
    $author = $this->meta('author');
    $this->author = $author;

    return $this->author;
  }

  protected $language;
  public function language(){
    if ( ! empty( $this->language ) ) {
      return $this->language;
    }
    $language = $this->meta('language');
    $this->language = $language;

    return $this->language;
  }

  protected $description;
  public function description(){
    if ( ! empty( $this->description ) ) {
      return $this->description;
    }
    $description = $this->meta('description');
    $this->description = $description;

    return $this->description;
  }

  protected $material;
  public function material(){
    if ( ! empty( $this->material ) ) {
      return $this->material;
    }
    $material = $this->meta('material');
    $this->material = $material;

    return $this->material;
  }

  protected $original;
  public function original(){
    if ( ! empty( $this->original ) ) {
      return $this->original;
    }
    $original = $this->meta('original');
    $this->original = $original;

    return $this->original;
  }

  protected $photographer;
  public function photographer(){
    if ( ! empty( $this->photographer ) ) {
      return $this->photographer;
    }
    $photographer = $this->meta('photographer');
    $this->photographer = $photographer;

    return $this->photographer;
  }

  protected $location;
  public function location(){
    if ( ! empty( $this->location ) ) {
      return $this->location;
    }
    $location = $this->meta('location');
    $this->location = $location;

    return $this->location;
  }

  protected $repository;
  public function repository(){
    if ( ! empty( $this->repository ) ) {
      return $this->repository;
    }
    $repository = $this->meta('repository');
    $this->repository = $repository;

    return $this->repository;
  }

  protected $shelf;
  public function shelf(){
    if ( ! empty( $this->shelf ) ) {
      return $this->shelf;
    }
    $shelf = $this->meta('shelf');
    $this->shelf = $shelf;

    return $this->shelf;
  }

  protected $source;
  public function source(){
    if ( ! empty( $this->source ) ) {
      return $this->source;
    }
    $source = $this->meta('source');
    $this->source = $source;

    return $this->source;
  }

  protected $title;
  public function title(){
    if ( ! empty( $this->title ) ) {
      return $this->title;
    }
    $title = $this->meta('title');
    $this->title = $title;

    return $this->title;
  }

  protected $dates;
  public function dates(){
    if ( ! empty( $this->dates ) ) {
      return $this->dates;
    }
    $dates = $this->meta('inclusiveDates');
    $this->dates = $dates;

    return $this->dates;
  }

  protected $extent;
  public function extent(){
    if ( ! empty( $this->extent ) ) {
      return $this->extent;
    }
    $extent = $this->meta('extent');
    $this->extent = $extent;

    return $this->extent;
  }

  protected $finding_aid;
  public function finding_aid(){
    if ( ! empty( $this->finding_aid ) ) {
      return $this->finding_aid;
    }
    $finding_aid = $this->meta('finding_aid');
    $this->finding_aid = $finding_aid;

    return $this->finding_aid;
  }

  protected $subject;
  public function subject(){
    if ( ! empty( $this->subject ) ) {
      return $this->subject;
    }
    $subject = $this->meta('subject');
    $this->subject = $subject;

    return $this->subject;
  }

  protected $links;
  public function links(){
    if ( ! empty( $this->links ) ) {
      return $this->links;
    }
    $links = $this->meta('links');
    $this->links = $links;

    return $this->links;
  }

}
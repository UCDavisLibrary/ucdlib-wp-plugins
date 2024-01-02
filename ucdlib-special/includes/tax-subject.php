<?php
require_once( __DIR__ . '/block-transformations.php' );

class UCDLibPluginSpecialTaxSubject {

  public $config;
  public $slug;
  public $postType;

  public function __construct( $config ){
    $this->config = $config;
    $this->slug = $config->taxonomies['subject'];
    $this->postType = $this->config->postTypes['collection'];

    add_action( 'init', array($this, 'register') );
    add_action( 'admin_menu', array($this, 'add_to_menu'));
    add_action( 'parent_file',  array($this, 'expand_parent_menu') );
    add_action( 'init', [$this, 'register_term_meta'] );
    add_action( 'widgets_init', [$this, 'register_sidebar'] );
    add_action($this->slug . '_add_form_fields', array($this, 'render_term_meta'), 4, 1);
    add_action($this->slug . '_edit_form_fields', array($this, 'render_term_meta'), 4, 1);
    add_action('edited_' . $this->slug, array($this, 'save_term_meta'), 10, 1);
    add_action('create_' . $this->slug, array($this, 'save_term_meta'), 10, 2);
    add_action('pre_get_posts', array($this, 'sort_by_ascending'));

    add_filter( 'timber/term/classmap', array($this, 'extend_timber_class') );

    add_filter( 'ucd-theme/context/taxonomy', array($this, 'set_context') );
    add_filter( 'ucd-theme/templates/taxonomy', array($this, 'set_template'), 10, 2 );
  }

  // register taxonomy
  public function register(){
    $slug = $this->slug;
    $labels = [
      'name'              => _x( 'Subjects', 'taxonomy general name' ),
      'singular_name'     => _x( 'Subject', 'taxonomy singular name' ),
      'search_items'      => __( 'Search Subjects' ),
      'all_items'         => __( 'All Subjects' ),
      'edit_item'         => __( 'Edit Subject' ),
      'update_item'       => __( 'Update Subject' ),
      'add_new_item'      => __( 'Add New Subject' ),
      'new_item_name'     => __( 'New Subject' ),
      'menu_name'         => __( 'Manuscript Subjects' ),
    ];

    // permalink nested under asc department page
    $rewrite = ['with_front' => false];
    $deptHomePage = UCDLibPluginSpecialBlockTransformations::deptLanderLink()['dept_page_link'];
    if ( $deptHomePage ) {
      $rewrite['slug'] = trailingslashit(parse_url($deptHomePage)['path']) . $this->slug;
    }

    $args = [
      'labels' => $labels,
      'description' => 'Manuscript subject areas',
      'public' => true,
      'rewrite' => $rewrite,
      'publicly_queryable' => true,
      'hierarchical' => true,
      'show_ui' => true,
      'show_in_nav_menus' => false,
      'show_in_rest' => true,
      'show_admin_column' => false,
      'show_in_menu' => true,
      'capabilities' => [
        'manage_terms'  => $this->config->capabilities['manage_collections'],
        'edit_terms'    => $this->config->capabilities['manage_collections'],
        'delete_terms'  => $this->config->capabilities['manage_collections'],
        'assign_terms'  => "edit_posts"
      ],
    ];

    register_taxonomy(
      $slug,
      [$this->postType],
      $args
    );
  }

  // add to plugin admin menu
  public function add_to_menu(){
    $label = 'Manuscript Subjects';
    add_submenu_page($this->config->slug, $label, $label, 'edit_posts', "edit-tags.php?taxonomy=$this->slug&post_type=$this->postType",false );
  }

  // expand plugin menu when on taxonomy admin page
  public function expand_parent_menu($parent_file){
    if ( get_current_screen()->taxonomy == $this->slug ) {
      $parent_file = $this->config->slug;
    }
    return $parent_file;
  }

  // register metadata associated with each taxonomy term
  public function register_term_meta(){
    register_term_meta($this->slug, 'subjectHeading', ['type' => 'string', 'single' => true, 'show_in_rest' => true]);
    register_term_meta($this->slug, 'teaserText', ['type' => 'string', 'single' => true, 'show_in_rest' => true]);
  }

  // renders custom meta fields on add/edit subject forms
  public function render_term_meta( $term ){
    $context = array(
      'current_filter' => current_filter(),
      'term' => $term
    );
    if ( is_object($term) ) {
      $context['subjectHeading'] = get_term_meta($term->term_id, 'subjectHeading', true);
      $context['teaserText'] = get_term_meta($term->term_id, 'teaserText', true);
    }
    Timber::render('@' . $this->config->slug . '/admin/tax-subject-meta.twig' , $context);
  }

  // saves custom meta fields on add/edit subject forms
  public function save_term_meta( $term_id ){
    if (isset($_POST['subjectHeading'])) {
      update_term_meta($term_id, 'subjectHeading', sanitize_text_field($_POST['subjectHeading']));
    } else {
      update_term_meta($term_id, 'subjectHeading', '');
    }

    if (isset($_POST['teaserText'])) {
      update_term_meta($term_id, 'teaserText', sanitize_text_field($_POST['teaserText']));
    } else {
      update_term_meta($term_id, 'teaserText', '');
    }

  }

  // add data to view context
  public function set_context($context){
    if ( $context['term']->taxonomy !== $this->slug ) return $context;

    // put collections lander in breadcrumbs
    $crumbs = [['title' => 'Home', 'link' => '/'],  ['title' => $context['term']->name]];
    $collectionsLander = get_field('asc_manuscripts_page', $this->config->slug);
    if ( $collectionsLander ){
      $collectionsLander = Timber::get_post($collectionsLander);
      if ( $collectionsLander ) {
        $collectionsLanderCrumbs = $collectionsLander->breadcrumbs();
        if ( $collectionsLanderCrumbs && count($collectionsLanderCrumbs) ){
          $crumbs = array_merge($collectionsLanderCrumbs, array_slice($crumbs, 1));
        }
      }
    }
    $context['breadcrumbs'] = $crumbs;

    $context['sidebar'] = trim(Timber::get_widgets( $this->slug ));
    return $context;
  }

  // set the twig to call
  public function set_template($templates, $context){
    if ( $context['term']->taxonomy !== $this->slug ) return $templates;

    $templates = array_merge( array("@" . $this->config->slug . "/subject.twig"), $templates );
    return $templates;
  }

  function sort_by_ascending($query){
    if ( $query->is_main_query() && is_tax($this->slug) && !is_admin() ) {
      $query->set('orderby', 'title' );
      $query->set('order', 'ASC' );
    }
  }

  // edit with Appearance>>Widgets
  public function register_sidebar(){
    register_sidebar(
      array(
        'id'            => $this->slug,
        'name'          => "Manuscripts by Subject",
        'description'   => "Sidebar widgets for manuscripts by subject.",
        'before_widget' => '',
        'after_widget' => ''
      )
    );
  }

  public function extend_timber_class($classmap){
    $custom_classmap = [
      $this->slug => UCDLibPluginSpecialTaxSubjectTerm::class,
    ];

    return array_merge($classmap, $custom_classmap);
  }

}

class UCDLibPluginSpecialTaxSubjectTerm extends \Timber\Term {

  protected $teaserText;
  public function teaserText(){
    if ( ! empty( $this->teaserText ) ) {
      return $this->teaserText;
    }
    $this->teaserText = $this->meta('teaserText');
    return $this->teaserText;
  }

  protected $subjectHeading;
  public function subjectHeading(){
    if ( ! empty( $this->subjectHeading ) ) {
      return $this->subjectHeading;
    }
    $this->subjectHeading = $this->meta('subjectHeading');
    return $this->subjectHeading;
  }

  protected $heroImage;
  public function heroImage(){
    if ( ! empty( $this->heroImage ) ) {
      return $this->heroImage;
    }
    $imgId = $this->meta('hero_image');
    if ( !$imgId ) {
      $this->heroImage = false;
      return $this->heroImage;
    }
    $this->heroImage = Timber::get_image($imgId);
    return $this->heroImage;
  }

  protected $teaserImage;
  public function teaserImage(){
    if ( ! empty( $this->teaserImage ) ) {
      return $this->teaserImage;
    }
    $imgId = $this->meta('teaser_image');
    if ( !$imgId ) {
      $this->teaserImage = false;
      return $this->teaserImage;
    }
    $this->teaserImage = Timber::get_image($imgId);
    return $this->teaserImage;
  }
}

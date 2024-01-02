<?php

// Service Type taxonomy
class UCDLibPluginDirectoryServiceTypes {

  public $config;
  public $slug;
  public $postType;

  public function __construct($config){
    $this->config = $config;
    $this->slug = $this->config['taxSlugs']['service-type'];
    $this->postType = $this->config['postSlugs']['service'];

    add_action( 'init', array($this, 'register') );
    add_action( 'admin_menu', array($this, 'add_to_menu'));
    add_action( 'parent_file',  array($this, 'expand_parent_menu') );
    add_filter( 'query_vars', [$this, 'register_query_vars'] );

    // custom meta for taxonomy term
    add_action($this->slug . '_add_form_fields', array($this, 'render_term_meta'), 4, 1);
    add_action($this->slug . '_edit_form_fields', array($this, 'render_term_meta'), 4, 1);
    add_action('edited_' . $this->slug, array($this, 'save_term_meta'), 10, 1);
    add_action('create_' . $this->slug, array($this, 'save_term_meta'), 10, 2);
  }

  // register taxonomy
  public function register(){
    $slug = $this->config['taxSlugs']['service-type'];
    $people = $this->config['postSlugs']['personPlural'];
    $labels = [
      'name'              => _x( 'Service Types', 'taxonomy general name' ),
      'singular_name'     => _x( 'Service Type', 'taxonomy singular name' ),
      'search_items'      => __( 'Search Service Types' ),
      'all_items'         => __( 'All Service Types' ),
      'parent_item'       => __( 'Parent Service Type' ),
      'parent_item_colon' => __( 'Parent Service Type:' ),
      'edit_item'         => __( 'Edit Service Type' ),
      'update_item'       => __( 'Update Service Type' ),
      'add_new_item'      => __( 'Add New Service Type' ),
      'new_item_name'     => __( 'New Service Type' ),
      'menu_name'         => __( 'Service Types' ),
    ];
    $args = [
      'labels' => $labels,
      'description' => 'Controlled list of categories for Library services',
      'public' => false,
      'publicly_queryable' => false,
      'hierarchical' => true,
      'show_ui' => true,
      'show_in_nav_menus' => false,
      'show_in_rest' => true,
      'capabilities' => [
        'manage_terms'  => $this->config['capabilities']['manage_directory'],
        'edit_terms'    => "edit_$people",
        'delete_terms'  => $this->config['capabilities']['manage_directory'],
        'assign_terms'  => "edit_$people"
      ],
      'show_admin_column' => true,
      'meta_box_cb' => 'post_categories_meta_box'
    ];

    register_taxonomy(
      $slug,
      [$this->postType],
      $args
    );

  }

  // register metadata associated with each taxonomy term
  public function register_term_meta(){
    register_term_meta($this->slug, 'menu_order', ['type' => 'number', 'default' => 0, 'single' => true, 'show_in_rest' => true]);
  }

  // renders custom meta fields on add/edit taxonomy term forms
  public function render_term_meta( $term ){
    $fieldSlug = 'menu_order';
    $context = [
      'current_filter' => current_filter(),
      'term' => $term,
      'fieldSlug' => $fieldSlug
    ];
    if ( is_object($term) ) {
      $context['menu_order'] = get_term_meta($term->term_id, $fieldSlug, true);
    } else {
      $context['menu_order'] = 0;
    }
    Timber::render('@' . $this->config['slug'] . '/admin/service-type-meta.twig' , $context);
  }

  // saves custom meta fields on add/edit taxonomy term forms
  public function save_term_meta( $term_id ){
    $fieldSlug = 'menu_order';
    $menu_order = 0;
    if ( isset($_POST) && isset($_POST[$fieldSlug]) ){
      $menu_order = intval($_POST[$fieldSlug]);
    }
    update_term_meta($term_id, $fieldSlug, $menu_order);
  }

  // add to plugin admin menu
  public function add_to_menu(){
    $label = 'Service Types';
    add_submenu_page(
      $this->config['slug'],
      $label,
      $label,
      $this->config['capabilities']['manage_directory'],
      "edit-tags.php?taxonomy=$this->slug&post_type=$this->postType",
      false );
  }

  public function register_query_vars( $qvars ) {
    $qvars[] =  $this->slug;
    return $qvars;
}

  // expand plugin menu when on taxonomy admin page
  public function expand_parent_menu($parent_file){
    if ( get_current_screen()->taxonomy == $this->slug ) {
      $parent_file = $this->config['slug'];
    }
    return $parent_file;
  }

}

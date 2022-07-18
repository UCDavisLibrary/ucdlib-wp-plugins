<?php

// Directory Tag taxonomy
// includes 'subject areas'
class UCDLibPluginDirectoryDirectoryTags {
  public function __construct($config){
    $this->config = $config;
    $this->slug = $this->config['taxSlugs']['directory'];

    add_action( 'init', array($this, 'register') );
    add_action( 'init', [$this, 'register_term_meta'] );
    add_action( 'admin_menu', array($this, 'add_to_menu'));
    add_action( 'parent_file',  array($this, 'expand_parent_menu') );
    add_action($this->slug . '_add_form_fields', array($this, 'render_term_meta'), 4, 1);
    add_action($this->slug . '_edit_form_fields', array($this, 'render_term_meta'), 4, 1);
    add_action('edited_' . $this->slug, array($this, 'save_term_meta'), 10, 1);
    add_action('create_' . $this->slug, array($this, 'save_term_meta'), 10, 2);
    add_filter( 'query_vars', [$this, 'register_query_vars'] );

  }

  // register taxonomy
  public function register(){
    $labels = [
      'name'              => _x( 'Directory Tags', 'taxonomy general name' ),
      'singular_name'     => _x( 'Directory Tag', 'taxonomy singular name' ),
      'search_items'      => __( 'Search Directory Tags' ),
      'all_items'         => __( 'All Directory Tags' ),
      'parent_item'       => __( 'Parent Directory Tag' ),
      'parent_item_colon' => __( 'Parent Directory Tag:' ),
      'edit_item'         => __( 'Edit Directory Tag' ),
      'update_item'       => __( 'Update Directory Tag' ),
      'add_new_item'      => __( 'Add New Directory Tag' ),
      'new_item_name'     => __( 'New Directory Tag' ),
      'menu_name'         => __( 'Directory Tags' ),
    ];
    $args = [
      'labels' => $labels,
      'description' => 'Controlled list of tags and subject areas used in people directory',
      'public' => false,
      'publicly_queryable' => false,
      'hierarchical' => true,
      'show_ui' => true,
      'show_in_nav_menus' => false,
      'show_in_rest' => true,
      'show_admin_column' => true,
      'meta_box_cb' => 'post_categories_meta_box'
    ];

    register_taxonomy(
      $this->slug, 
      [$this->config['postSlugs']['person']],
      $args
    );
    
  }

  // register metadata associated with each taxonomy term
  public function register_term_meta(){
    register_term_meta($this->slug, 'isSubjectArea', ['type' => 'boolean', 'single' => true, 'show_in_rest' => true]);
  }

  // renders custom meta fields on add/edit taxonomy term forms
  public function render_term_meta( $term ){
    $fieldSlug = 'isSubjectArea';
    $context = [
      'current_filter' => current_filter(),
      'term' => $term,
      'fieldSlug' => $fieldSlug
    ];
    if ( is_object($term) ) {
      $context['fieldValue'] = get_term_meta($term->term_id, $fieldSlug, true);
    }
    Timber::render('@' . $this->config['slug'] . '/admin/directory-tags-meta.twig' , $context);
  }

  // saves custom meta fields on add/edit taxonomy term forms
  public function save_term_meta( $term_id ){
    $fieldSlug = 'isSubjectArea';
    $isSubjectArea = isset($_POST[$fieldSlug]);
    update_term_meta($term_id, $fieldSlug, $isSubjectArea);
  }

  // add to plugin admin menu
  public function add_to_menu(){
    $label = 'Subjects and Directory Tags';
    add_submenu_page($this->config['slug'], $label, $label, 'edit_posts', "edit-tags.php?taxonomy=$this->slug",false );
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

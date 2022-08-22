<?php

// Organization Curator Taxonomy
class UCDLibPluginSpecialCurators {
  public function __construct($config){
    $this->config = $config;
    $this->slug = $config->taxonomies['curator'];

    add_action( 'init', array($this, 'register') );
    add_filter( 'rest_prepare_taxonomy', [ $this, 'hide_metabox'], 10, 3);

    add_filter( 'ucd-theme/context/taxonomy', array($this, 'set_context') );
    add_filter( 'ucd-theme/templates/taxonomy', array($this, 'set_template'), 10, 2 );

    add_filter( 'timber/term/classmap', array($this, 'extend_timber_class') );
  }

  // register taxonomy
  public function register(){
    $labels = [
      'name'              => _x( 'Exhibit Curator Orgs', 'taxonomy general name' ),
      'singular_name'     => _x( 'Exhibit Curator Org', 'taxonomy singular name' ),
      'search_items'      => __( 'Search Organizations' ),
      'all_items'         => __( 'All Curator Organizations' ),
      'parent_item'       => __( 'Parent Curator Organization' ),
      'parent_item_colon' => __( 'Parent Curator Organization:' ),
      'edit_item'         => __( 'Edit Curator Organization' ),
      'update_item'       => __( 'Update Curator Organization' ),
      'add_new_item'      => __( 'Add New Curator Organization' ),
      'new_item_name'     => __( 'New Curator Organization' ),
      'menu_name'         => __( 'Curator Orgs' ),
    ];
    $args = [
      'labels' => $labels,
      'description' => 'Controlled list of curator organizations for exhibits',
      'public' => true,
      'publicly_queryable' => true,
      'rewrite' => ['with_front' => false],
      'hierarchical' => true,
      'show_in_menu' => true,
      'show_ui' => true,
      'show_in_nav_menus' => false,
      'show_in_rest' => true,
      'show_admin_column' => true,
      'meta_box_cb' => false,
      'capabilities' => [
        'manage_terms'  => $this->config->capabilities['manage_exhibits'],
        'edit_terms'    => $this->config->capabilities['manage_exhibits'],
        'delete_terms'  => $this->config->capabilities['manage_exhibits'],
        'assign_terms'  => "edit_posts"
      ],
    ];

    register_taxonomy(
      $this->slug, 
      [$this->config->postTypes['exhibit']],
      $args
    );
    
  }

  // hides taxonomy box on exhibit pages
  // we will build our own
  public function hide_metabox( $response, $taxonomy, $request ){
    $context = ! empty( $request['context'] ) ? $request['context'] : 'view';

    if( $context === 'edit'  && $taxonomy->name === $this->slug){
      $data_response = $response->get_data();
      $data_response['visibility']['show_ui'] = false;
      $response->set_data( $data_response );
    }

    return $response;

  }

  // add data to view context
  public function set_context($context){
    if ( $context['term']->taxonomy !== $this->slug ) return $context;
    // put exhibits lander in breadcrumbs
    $exhibitsLander = get_field('asc_exhibits_page', $this->config->slug);
    if ( $exhibitsLander ){
      $exhibitsLander = Timber::get_post($exhibitsLander);
      if ( $exhibitsLander ) {
        $exhibitsLanderCrumbs = $exhibitsLander->breadcrumbs();
        if ( $exhibitsLanderCrumbs && count($exhibitsLanderCrumbs) ){
          $context['breadcrumbs'] = array_merge($exhibitsLanderCrumbs, [['title' => $context['term']->name]]);
        }
      }
    }
    
    return $context;
  }
  
  // set the twig to call
  public function set_template($templates, $context){
    if ( $context['term']->taxonomy !== $this->slug ) return $templates;
    
    $templates = array_merge( array("@" . $this->config->slug . "/curator.twig"), $templates );
    return $templates;
  }

  public function extend_timber_class($classmap){
    $custom_classmap = [
      $this->slug => UCDLibPluginSpecialTaxCuratorTerm::class,
    ];

    return array_merge($classmap, $custom_classmap);
  }

}

class UCDLibPluginSpecialTaxCuratorTerm extends \Timber\Term {

  protected $homePage;
  public function homePage(){
    if ( ! empty( $this->homePage ) ) {
      return $this->homePage;
    }
    $postId = $this->meta('home_page');
    if ( !$postId ) {
      $this->homePage = false;
      return $this->homePage;
    }
    $this->homePage = Timber::get_post($postId);
    return $this->homePage;
  }
}

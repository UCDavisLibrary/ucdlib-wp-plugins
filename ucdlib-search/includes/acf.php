<?php

class UCDLibPluginSearchACF {

  public function __construct( $config, $doHooks=true ){
    $config['menuTitle'] = 'UCD Library Search';
    $config['menuTitleSlug'] = str_replace(" ", "-", strtolower($config['menuTitle']));
    $this->config = $config;

    if ( $doHooks ){
      add_action( 'acf/init', array($this, 'register_options_page') );
      add_filter( 'acf/settings/load_json', array($this, 'add_json_load_point') );
      add_filter( 'acf/load_field/name=post_types', array($this, 'loadPostTypes') );
      add_action( 'acf/save_post', array($this, 'on_options_page_save'), 20 );
      add_action( 'wp_after_admin_bar_render', function(){
      });
    }

  }

  public function on_options_page_save(){
    $screen = get_current_screen();
    $menuSlug = "acf-options" . "-" . $this->config['menuTitleSlug'];
    if ( !strpos($screen->id, $menuSlug) ){
      return;
    }
    require_once( __DIR__ . '/activation.php' );
    $activationTasks = new UCDLibPluginSearchActivation( $this->config, false );
    $activationTasks->createPostUpdatesTriggers();

  }

  public function register_options_page(){
    acf_add_options_sub_page(array(
      'page_title'  => __('UC Davis Library Search Settings'),
      'menu_title'  => $this->config['menuTitle'],
      'parent_slug' => 'options-general.php',
      'post_id' => $this->config['slug'],
      'updated_message' => 'Search settings updated',
      'capability' => 'activate_plugins'
    ));
  }

  public function add_json_load_point( $paths ) {
    $paths[] = WP_PLUGIN_DIR . "/" . $this->config['slug'] . '/acf-json';
    return $paths;
  }

  public function loadPostTypes( $field ){
    $field['choices'] = array();
    $post_types = get_post_types( [], 'objects' );
    
    foreach ( $post_types  as $post_type ) {
      $field['choices'][ $post_type->name ] = $post_type->label;
    }

    return $field;
  }

  
}
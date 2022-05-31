<?php

class UCDLibPluginSearchACF {

  public function __construct( $config, $doHooks=true ){
    $this->config = $config;
    if ( $doHooks ){
      add_action( 'acf/init', array($this, 'register_options_page') );
      add_filter( 'acf/settings/load_json', array($this, 'add_json_load_point') );
    }

  }

  public function register_options_page(){
    acf_add_options_sub_page(array(
      'page_title'  => __('UC Davis Library Search Settings'),
      'menu_title'  => $this->config->menuTitle,
      'parent_slug' => 'options-general.php',
      'post_id' => $this->config->slug,
      'updated_message' => 'Search settings updated',
      'capability' => 'activate_plugins'
    ));
  }

  public function add_json_load_point( $paths ) {
    $paths[] = WP_PLUGIN_DIR . "/" . $this->config->slug . '/acf-json';
    return $paths;
  }

}
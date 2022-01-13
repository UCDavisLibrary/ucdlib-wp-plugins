<?php

class UCDLibPluginLocationsACF {

  public function __construct( $config ){
    $this->config = $config;

    add_action( 'acf/init', array($this, 'register_options_page') );
    add_filter( 'acf/settings/load_json', array($this, 'add_json_load_point') );
  }

  public function register_options_page(){
    acf_add_options_sub_page(array(
      'page_title'  => __('Location Settings'),
      'menu_title'  => __('Settings'),
      'parent_slug' => 'edit.php?post_type=' . $this->config['postTypeSlug'],
      'post_id' => $this->config['postTypeSlug'],
      'updated_message' => 'Location settings updated',
      'capability' => 'activate_plugins'
    ));
  }

  public function add_json_load_point( $paths ) {
    $paths[] = WP_PLUGIN_DIR . "/" . $this->config['slug'] . '/acf-json';
    return $paths;
  }
  
}
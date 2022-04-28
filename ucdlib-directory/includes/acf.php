<?php

// Customizations to Advanced Custom Fields
class UCDLibPluginDirectoryACF {

  public function __construct( $config ){
    $this->config = $config;

    add_filter( 'acf/settings/load_json', array($this, 'add_json_load_point') );
    add_action( 'acf/init', array($this, 'register_options_page') );

  }

  // load (but not save) acf json files from plugin directory
  public function add_json_load_point( $paths ) {
    $paths[] = WP_PLUGIN_DIR . "/" . $this->config['slug'] . '/acf-json';
    return $paths;
  }

  // register directory options page.
  // will also use to nest custom post types and taxononomies
  public function register_options_page(){
    acf_add_options_sub_page(array(
      'page_title'  => __('Directory Settings'),
      'menu_title'  => __('Directory Settings'),
      'parent_slug' => $this->config['slug'],
      'post_id' => $this->config['slug'],
      'updated_message' => 'Directory settings updated',
      'capability' => 'activate_plugins'
    ));
  }
  
}
<?php

// Customizations to Advanced Custom Fields
class UCDLibPluginSpecialACF {

  public function __construct( $config ){
    $this->config = $config;
    $this->menuSlug = $this->config->slug . "-settings";

    add_filter( 'acf/settings/load_json', array($this, 'add_json_load_point') );
    add_action( 'acf/init', array($this, 'register_options_page') );
    add_action( 'acf/save_post', array($this, 'clear_all_transients'), 20 );
  }

  // load (but not save) acf json files from plugin directory
  public function add_json_load_point( $paths ) {
    $paths[] = WP_PLUGIN_DIR . "/" . $this->config->slug . '/acf-json';
    return $paths;
  }

  // register directory options page.
  // will also use to nest custom post types and taxononomies
  public function register_options_page(){
    acf_add_options_sub_page(array(
      'page_title'  => __('Archives and Special Collections Settings'),
      'menu_title'  => __('Settings'),
      'parent_slug' => $this->config->slug,
      'menu_slug' => $this->menuSlug,
      'post_id' => $this->config->slug,
      'updated_message' => 'Settings updated',
      'capability' => $this->config->capabilities['manage_collections']
    ));
  }

  // clear all transients on menu save
  public function clear_all_transients(  ){
    $screen = get_current_screen();
    if (
      strpos($screen->id, $this->menuSlug) == true
      ) {
      delete_transient('asc_dept_page_link');
      delete_transient('ucdlib-special-az-manuscript');
      delete_transient('ucdlib-special-az-university-archive');
    }
  }
  
}
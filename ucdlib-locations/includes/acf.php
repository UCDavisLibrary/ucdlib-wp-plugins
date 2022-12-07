<?php

require_once( __DIR__ . '/utils.php' );

class UCDLibPluginLocationsACF {

  public function __construct( $config ){
    $this->config = $config;

    add_action( 'acf/init', array($this, 'register_options_page') );
    add_filter( 'acf/settings/load_json', array($this, 'add_json_load_point') );
    add_action( 'acf/save_post', array($this, 'clear_all_transients'), 20 );
  }

  public function register_options_page(){
    acf_add_options_sub_page(array(
      'page_title'  => __('Location Settings'),
      'menu_title'  => __('Settings'),
      'parent_slug' => $this->config['slug'],
      'post_id' => $this->config['postTypeSlug'],
      'updated_message' => 'Location settings updated',
      'capability' => 'activate_plugins'
    ));
  }

  public function add_json_load_point( $paths ) {
    $paths[] = WP_PLUGIN_DIR . "/" . $this->config['slug'] . '/acf-json';
    return $paths;
  }

  // clears transients used to cache location data
  public function clear_all_transients(  ){
    $screen = get_current_screen();
    if ( $screen->id && $screen->id == "locations_page_acf-options-settings") {
      UCDLibPluginLocationsUtils::deleteTransients();
    }
  }
  
}
<?php

require_once( __DIR__ . '/utils.php' );

class UCDLibPluginLocationsACF {

  public $config;

  public function __construct( $config ){
    $this->config = $config;

    add_action( 'acf/init', array($this, 'register_options_page') );
    add_filter( 'acf/settings/load_json', array($this, 'add_json_load_point') );
    add_action( 'acf/save_post', array($this, 'set_hours_cache_cron'), 20 );
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

  public function set_hours_cache_cron (){
    $screen = get_current_screen();
    if ( $screen->id && $screen->id == "locations_page_acf-options-settings") {
      $slug = $this->config['slug'] . "_cron";

      // delete current cron
      $timestamp = wp_next_scheduled( $slug );
      if ( $timestamp ) {
        wp_unschedule_event( $timestamp, $slug );
      }

      // register new time interval
      add_filter( 'cron_schedules', [$this, 'setHoursCronSchedule'] );

      // reschedule the cron
      $interval = get_field('hours_cache_duration', $this->config['postTypes']['location']);
      if ( $interval && !wp_next_scheduled( $slug ) ) {
        wp_schedule_event( time(), $this->config['slug'] . '_hours', $slug );
      }
    }
  }

  public function setHoursCronSchedule($schedules){
    $interval = get_field('hours_cache_duration', $this->config['postTypes']['location']);
    if ( $interval ) {
      $schedules[$this->config['slug'] . '_hours'] = [
        'interval' => intval($interval),
        'display' => $interval . ' seconds'
      ];
    }

    return $schedules;
  }

  // clears transients used to cache location data
  public function clear_all_transients(  ){
    $screen = get_current_screen();
    if ( $screen->id && $screen->id == "locations_page_acf-options-settings") {
      UCDLibPluginLocationsUtils::deleteTransients();
    }
  }

}

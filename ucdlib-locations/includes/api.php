<?php
require_once( __DIR__ . '/utils.php' );

class UCDLibPluginLocationsAPI {

  public function __construct( $config ){
    $this->config = $config;

    add_action( 'rest_api_init', array($this, 'register_endpoints') );
  }

  public function register_endpoints(){
    register_rest_route($this->config['slug'], 'locations', array(
      'methods' => 'GET',
      'callback' => array($this, 'epcb_locations'),
      'permission_callback' => function (){return true;},
      'args' => [
        'fields' => self::$location_fields
      ]
    ) );

    register_rest_route($this->config['slug'], 'locations/(?P<id>\d+)', array(
      'methods' => 'GET',
      'callback' => array($this, 'epcb_location'),
      'permission_callback' => function (){return true;},
      'args' => [
        'fields' => self::$location_fields
      ]
    ) );
  }

  public function epcb_locations($request){
    $fields = $request['fields'];

    $locations = Timber::get_posts( [
      'post_type' => $this->config['postTypeSlug'],
      'orderby' => 'menu_order',
      'order' => 'ASC',
      'nopaging' => true,
    ] );


    $out = array();
    foreach ($locations as $location) {
      $loc = $location->core_data();
      $loc = array_merge($loc, $this->add_additional_fields($location, $fields) );
      
      $out[] = $loc;
    }
    return rest_ensure_response($out);
  }

  public function epcb_location($request){
    $fields = $request['fields'];
    $locationId = $request['id'];

    $location = Timber::get_posts( [
      'post_type' => $this->config['postTypeSlug'],
      'p' => $locationId
    ] );
    if ( $location->found_posts ) {
      $location = $location[0];
      $out = $location->core_data();
      $out = array_merge($out, $this->add_additional_fields($location, $fields) );
      return rest_ensure_response($out);
    } 

    return new WP_Error( 'rest_not_found', 'This location does not exist.', array( 'status' => 404 ) );

  }

  private function add_additional_fields($location, $fields){
    $out = array();
    if ( in_array('hours', $fields) ) {
      $out['hours'] = $location->get_hours();
    } elseif ( in_array('hours-today', $fields) ) {
      $hours = $location->get_hours();
      $out['hoursToday'] = UCDLibPluginLocationsUtils::getTodaysHours($hours);
    }

    if ( in_array('occupancy-now', $fields) ) {
      $out['occupancyNow'] = $location->get_current_occupancy();
    }

    return $out;
  }

  public static $location_fields = array(
    'description' => 'Additional fields that can be returned with core location data.',
    "type" => "array",
    "default" => []
  );
  
}
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
  }

  public function epcb_locations($request){
    $fields = $request['fields'];
    //return rest_ensure_response("hi there");

    $locations = Timber::get_posts( [
      'post_type' => $this->config['postTypeSlug'],
      'nopaging' => true,
    ] );


    $out = array();
    foreach ($locations as $location) {
      $loc = $location->core_data();


      if ( in_array('hours', $fields) ) {
        $loc['hours'] = $location->get_hours();
      } elseif ( in_array('hours-today', $fields) ) {
        $hours = $location->get_hours();
        $loc['hoursToday'] = UCDLibPluginLocationsUtils::getTodaysHours($hours);
      }

      if ( in_array('occupancy-now', $fields) ) {
        $loc['occupancyNow'] = $location->get_current_occupancy();
      }

      
      $out[] = $loc;
    }
    return rest_ensure_response($out);
  }

  public static $location_fields = array(
    'description' => 'Additional fields that can be returned with core location data.',
    "type" => "array",
    "default" => []
  );
  
}
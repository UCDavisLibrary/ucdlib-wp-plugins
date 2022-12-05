<?php
require_once( __DIR__ . '/utils.php' );

class UCDLibPluginLocationsAPI {

  public function __construct( $config ){
    $this->config = $config;
    $this->dateFmt = 'Y-m-d';
    $this->tz = 'America/Los_Angeles';

    add_action( 'rest_api_init', array($this, 'register_endpoints') );
  }

  public function register_endpoints(){
    register_rest_route($this->config['slug'], 'locations', array(
      'methods' => 'GET',
      'callback' => array($this, 'epcb_locations'),
      'permission_callback' => function (){return true;},
      'args' => [
        'fields' => self::$location_fields,
        'format' => [
          'description' => 'Structure of returned array. Should location children be nested?',
          "type" => "string",
          "default" => "flat",
          'enum' => ["flat", "nested"]
        ]
      ]
    ) );

    register_rest_route($this->config['slug'], 'locations/(?P<id>\d+)', array(
      'methods' => 'GET',
      'callback' => array($this, 'epcb_location'),
      'permission_callback' => function (){return true;},
      'args' => [
        'fields' => self::$location_fields,
        'children' => [
          'description' => 'Include any children of this location',
          'type' => 'boolean',
          'default' => false
        ]
      ]
    ) );

    register_rest_route($this->config['slug'], 'hours', array(
      'methods' => 'GET',
      'callback' => array($this, 'epcb_additional_hours'),
      'permission_callback' => function (){return true;},
      'args' => [
        'from' => [
          'description' => 'Date from formatted as Y-m-d',
          "type" => "date",
          "required" => true,
          "validate_callback" => function($param, $request, $key) {return $this->isValidDate($param);}
        ],
        'to' => [
          'description' => 'Date to formatted as Y-m-d',
          "type" => "string",
          "required" => true,
          "validate_callback" => function($param, $request, $key) {return $this->isValidDate($param);}
        ]
      ]
    ) );
  }

  // Endpoint callback for multiple locations
  public function epcb_locations($request){
    $fields = $request['fields'];

    $locations = Timber::get_posts( [
      'post_type' => $this->config['postTypeSlug'],
      'orderby' => 'menu_order',
      'order' => 'ASC',
      'nopaging' => true,
    ] );


    $out = array();
    $children = array();
    foreach ($locations as $location) {
      $loc = $location->core_data();
      $loc = array_merge($loc, $this->add_additional_fields($location, $fields) );
      
      if ( $request['format'] === 'nested' ){
        $loc['children'] = array();
        if ( $loc['parent'] ){
          $children[] = $loc;
        } else {
          $out[$loc['id']] = $loc;
        }
      }
      else {
        $out[] = $loc;
      }
    }
    // Nest child locations under parent
    if ( count($children) ){
      foreach ( $children as $child ) {
        if ( array_key_exists($child['parent'], $out) ) {
          $out[$child['parent']]['children'][] = $child; 
        } else {
          $out[$child['id']] = $child;
        }
      }
    }
    $out = array_values($out);

    return rest_ensure_response($out);
  }

  // Endpoint callback for a single location
  public function epcb_location($request){
    $fields = $request['fields'];
    $locationId = $request['id'];

    $location = Timber::get_posts( [
      'post_type' => $this->config['postTypeSlug'],
      'p' => $locationId
    ] );

    if ( !$location->found_posts ) {
      return new WP_Error( 'rest_not_found', 'This location does not exist.', array( 'status' => 404 ) );
    }
    $location = $location[0];
    $out = $location->core_data();
    $out = array_merge($out, $this->add_additional_fields($location, $fields) );

    if ( $request['children'] ) {
      $out['children'] = [];
      $children = Timber::get_posts( [
        'nopaging' => true,
        'orderby' => 'menu_order',
        'order' => 'ASC',
        'meta_key' => 'location_parent',
        'meta_value' => $location->ID,
        'post_type' => $this->config['postTypeSlug']

      ] );
      if ( $children->found_posts ) {
        foreach ($children as $child) {
          $c = $child->core_data();
          $c = array_merge($c, $this->add_additional_fields($child, $fields) );
          $out['children'][] = $c;
        }
      }

    }

    return rest_ensure_response($out);
  }

  // endpoint to retrieve additional hours data for all locations
  // used by the primary hours widget
  public function epcb_additional_hours($request){
    $out = [];

    // since we cache all api calls, limit how much data can be retrieved at once
    $from = DateTime::createFromFormat($this->dateFmt, $request['from'], new DateTimeZone($this->tz) );
    $to = DateTime::createFromFormat($this->dateFmt, $request['to'], new DateTimeZone($this->tz) );
    $interval = $from->diff($to);
    if ( $interval->days > 93 ) {
      return new WP_Error( 'rest_invalid_param', 'Requested date range is too wide.', array( 'status' => 400 ) );
    }

    $locations = Timber::get_posts( [
      'post_type' => $this->config['postTypeSlug'],
      'orderby' => 'menu_order',
      'order' => 'ASC',
      'nopaging' => true,
    ] );
    foreach ($locations as $location) {
      $hours = $location->get_libcal_hours($from->format($this->dateFmt), $to->format($this->dateFmt));
      $hours['id'] = $location->ID;
      $out[] = $hours;
    }
    $out = array_values($out);
    
    return rest_ensure_response($out);
  }

  private function isValidDate( $date ){
    $d = DateTime::createFromFormat($this->dateFmt, $date );
    return $d && $d->format($this->dateFmt) == $date;
  }

  private function add_additional_fields($location, $fields){
    $out = array();
    if ( in_array('hours', $fields) ) {
      $out['hours'] = $location->get_hours();

      // location has libcal id, but hours have not been set up
      if ( is_array($out['hours']['data']) && !count($out['hours']['data']) ) {
        $out['hours']['data'] = false;
      }

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
<?php
require_once( __DIR__ . '/utils.php' );
require_once( get_template_directory() . "/includes/classes/post.php");

class UCDLibPluginLocationsLocation extends UcdThemePost {

  protected $link;
  public function link(){
    if ( !empty($this->link) ){
      return $this->link;
    }
    if ( $this->meta('has_redirect') && $this->redirectLink() ){
      $this->link = $this->redirectLink();

    } else {
      $this->link = get_permalink($this->id);
    }
    return $this->link;
  }

  protected $redirectLink;
  public function redirectLink(){
    if ( !empty($this->redirectLink) ){
      return $this->redirectLink;
    }
    $redirect = $this->meta('redirect');
    $this->redirectLink = '';
    if ( !is_array($redirect)) return $this->redirectLink;
    if ( $redirect['postId'] ){
      $p = Timber::get_post(intval($redirect['postId']));
      if ( $p && $p->id != $this->id) {
        $this->redirectLink = $p->link();
      }
    }
    elseif ($redirect['url']) {
      $this->redirectLink = $redirect['url'];
    }

    return $this->redirectLink;
  }
  
  protected $core_data;
  public function core_data(){
    if ( ! empty( $this->core_data ) ) {
      return $this->core_data;
    }
    $monthRange = get_field('hours_months', $this->post_type);
    $out = array(
      'id' => $this->ID,
      'labels' => [],
      'links' => [],
      'parent' => intVal($this->meta('location_parent')),
      'appointments' => [
        'required' => $this->meta('has_appointments') ? true : false
      ],
      'hoursNumberOfMonths' => $monthRange ? intval($monthRange) : 4,
      'hideHours' => [
        'required' => $this->meta('hideHours') ? true : false
      ],
      'openPrefix' => $this->meta('open_prefix'),
      'descriptionDisplay' => [
        'required' => $this->meta('hasDescriptonDisplay') ? true : false
      ],
      'hoursPlaceholder' => [
        'show' => $this->meta('has_hours_placeholder') ? true : false,
        'message' => $this->meta('hours_placeholder')
      ],
      'alerts' => ['global' => $this->meta('alert_text'), 'showGlobal' => $this->meta('has_alert') ? true : false],
      'order' => $this->menu_order
    );

    $out['labels']['title'] = $this->title();
    $out['labels']['short'] = $this->meta('label_short');
    $out['labels']['room_number'] = $this->meta('room_number');

    $out['links']['link'] = $this->link();
    $hoursPage = get_field('link_all_hours', $this->post_type);
    if ( $hoursPage ) {
      $out['links']['hoursPage'] = get_permalink( $hoursPage );
    } else {
      $out['links']['hoursPage'] = "";
    }

    if ( $out['appointments']['required'] ) {
      $appointments = $this->meta('appointments');
      $out['appointments']['link_text'] = $appointments['linkText'];
      $out['appointments']['link_url'] = $appointments['linkUrl'];
    }

    ## Added for hide hours toggle and adding appointment description ##
    if ( $out['descriptionDisplay']['required'] ) {
      $appointmentsDisplay = $this->meta('descriptionDisplay');
      $out['descriptionDisplay']['link_url'] = $appointmentsDisplay['linkUrl'];
    }
    ## Added for hide hours toggle and adding appointment description ##
    
    $occupancy = $this->meta('occupancy');
    $capacity = $occupancy['capacity'];
    $out['capacity'] = $capacity ? $capacity : 0;

    $this->core_data = $out;
    return $this->core_data;
  }

  protected $safespace_id;
  public function safespace_id(){
    if ( ! empty( $this->safespace_id ) ) {
      return $this->safespace_id;
    }
    $occupancy = $this->meta('occupancy');
    $this->safespace_id = $occupancy['safespaceId'];

    return $this->safespace_id;
  }

  protected $can_get_current_occupancy;
  public function can_get_current_occupancy(){
    if ( ! empty( $this->can_get_current_occupancy ) ) {
      return $this->can_get_current_occupancy;
    }
    $out = array(false);

    // check if API url exists in settings page
    $creds = get_field('api_sensource_safespace', $this->post_type);
    if ( !$creds || !$creds['url'] ){
      $out[] = "Missing Safespace credentials in settings page";
    }

    elseif ( $this->safespace_id() ) {
      return array(true);
    }

    else {
      $out[] = "Location does not have a safespace id";
    }

    $this->can_get_current_occupancy = $out;
    return $this->can_get_current_occupancy;

  }

  protected $get_current_occupancy;
  public function get_current_occupancy(){

    // Check class cache
    if ( ! empty( $this->get_current_occupancy ) ) {
      return $this->get_current_occupancy;
    }

    // if current occupancy is not enabled on location page, bail
    if ( !$this->meta('has_occupancy') ){
      $out['status'] = 'good';
      $out['message'] = "Location does not have public current capacity data";

    // get current occupancy
    } else {
      $out = $this->get_safespace_occupancy();
    }

    $this->get_current_occupancy = $out;
    return $this->get_current_occupancy;
  }

  private function get_safespace_occupancy(){
    $out = array(
      'status' => 'error',
      'data' => false,
      'source' => 'safespace'
    );
  
    // check cache
    $transient_id = 'safespace_occupancy_' . $this->ID;
    $t = get_transient( $transient_id );

    // libcal api call has been made before, and is cached
    if ( $t !== false ) {
      $out['status'] = $t['status'];
      $out['cached'] = $t['cached'];
      $out['data'] = $t['data'];
      if ( array_key_exists('message', $t) ){
        $out['message'] = $t['message'];
      }

    // api call not cached. need to perform.
    } else {

      // check if this location is set up to get occupancy
      $can_get_current_occupancy = $this->can_get_current_occupancy();
      if ( !$can_get_current_occupancy[0] ){
        if ( isset($can_get_current_occupancy[1]) ) {
          $out['message'] = $can_get_current_occupancy[1];
        }
        return $out;
      }

      # construct GET request for libcal location
      $creds = get_field('api_sensource_safespace', $this->post_type);
      $url = trailingslashit($creds['url']) . $this->safespace_id();
      $out['cached'] = time();

      // do GET request and cache data
      $r = wp_remote_get($url);
      if (wp_remote_retrieve_response_code($r) == 200) {
        $data = json_decode(wp_remote_retrieve_body($r), true);
        $out['status'] = 'good';
        $out['data'] = $data;
        set_transient( $transient_id, $out, 180 );
      }
      else {
        $out['message'] = 'Safespace API is unavailable.';
        set_transient( $transient_id, $out, 30 );
      }
    }

    return $out;
  }

  // Checks if location is properly set up to retrieve hours
  // returns array (can_get_hours(bool), msg(str))
  protected $can_get_hours;
  public function can_get_hours(){

    if ( ! empty( $this->can_get_hours ) ) {
      return $this->can_get_hours;
    }
    $out = array(false);

    $creds = get_field('api_libcal', $this->post_type);

    if ( !$this->meta('libcal_id') ) {
      $out[] = 'Missing Libcal Library ID';
    } else if ( 
      !is_array( $creds ) ||
      !$creds['client_id'] ||
      !$creds['client_secret'] ||
      !$creds['url_hours'] ||
      !$creds['url_auth']
      ) {
      $out[] = 'Missing libcal API credentials!';
    } else {
      $out[0] = true;
    }

    $this->can_get_hours = $out;
    return $this->can_get_hours;
  }

  protected $get_hours;
  public function get_hours(){

    // Check class cache
    if ( ! empty( $this->get_hours ) ) {
      return $this->get_hours;
    }

    $tz = new DateTimeZone('America/Los_Angeles');
    $tz_offset = (new DateTime('now', $tz))->format('P');

    $out = array(
      'status' => 'error',
      'data' => false,
      'tzOffset' => $tz_offset
    );


    if ( !$this->meta('has_operating_hours') ){
      $out['status'] = 'good';
      $out['message'] = "Location does not have public operating hours.";
    } else {
      $out = array_merge($out, $this->get_libcal_hours());
    }

    $this->get_hours = $out;
    return $this->get_hours;
  }

  // Retrieves operating hours from springshare libcal
  // Will pull from cache if it exists
  public function get_libcal_hours($from=false, $to=false){
    ['out' => $out, 
    'from' => $from, 
    'to' => $to, 
    'transient_id' => $transient_id] = $this->setup_libcal_call($from, $to);

    // check cache
    $t = get_transient( $transient_id );

    // libcal api call has been made before, and is cached
    if ( $t !== false ) {
      $out['status'] = $t['status'];
      $out['cached'] = $t['cached'];
      if ( !array_key_exists('data', $t) || !$t['data'] ) {
        $out['data'] = false;
      } else if (
        array_key_exists('data', $t) && 
        array_key_exists('dates', $t['data'])
      ){
        $out['data'] = $t['data']['dates'];
      } else {
        $out['data'] = false;
      }
      if ( array_key_exists('message', $t) ){
        $out['message'] = $t['message'];
      }

    // libcal api call not cached. need to perform.
    } else {
      $out = $this->do_libcal_fetch($from, $to);
      if ( array_key_exists('non200', $out)){
        set_transient( $transient_id, $out, 30 );
      }

    }
    return $out;
  }


  // Retrieves access token for libcal.
  // Returns false if unable to get token
  public function get_libcal_token(){
    $transient_id = 'libcal_token';
    $t = get_transient( $transient_id );
    if ( $t !== false ) {
      if ( is_array($t) ) return false;
      return $t;
    }
    if ( !$this->can_get_hours()[0] ) return false;

    $creds = get_field('api_libcal', $this->post_type);
    $args = array(
      'body'        => array(
          "grant_type" => "client_credentials",
          "client_id" => $creds['client_id'],
          "client_secret" => $creds['client_secret']
      ),
      'timeout'     => '10',
      'redirection' => '5',
      'blocking'    => true,
      'headers'     => array(),
      'cookies'     => array(),
  );
  $r = wp_remote_post($creds['url_auth'], $args);
  if (wp_remote_retrieve_response_code($r) == 200) {
    $token = json_decode(wp_remote_retrieve_body($r), true)['access_token'];
    set_transient( $transient_id, $token, 3000 );
    return $token;
  } else {
    set_transient( $transient_id, array(false), 30 );
  }
  return false;
  }

  // do fresh hours call
  public function do_libcal_fetch($from=false, $to=false){
    ['out' => $out, 
    'from' => $from, 
    'to' => $to, 
    'transient_id' => $transient_id] = $this->setup_libcal_call($from, $to);

    // check if this location can get hours
    $can_get_hours = $this->can_get_hours();
    if ( !$can_get_hours[0] ){
      if ( isset($can_get_hours[1]) ) {
        $out['message'] = $can_get_hours[1];
      }
      return $out;
    }
    $creds = get_field('api_libcal', $this->post_type);
  
    // get access token
    $token = $this->get_libcal_token();
    if ( !$token ) {
      $out['message'] = 'Unable to get libcal API token';
      return $out;
    }

    # construct GET request for libcal location
    $url = trailingslashit($creds['url_hours']) . $this->meta('libcal_id');
    $url_params = array(
      'from' => $from,
      'to' => $to
    );
    $url .= '?' . http_build_query($url_params);
    $headers = array(
      "Content-type" => 'application/json',
      "Authorization" => "BEARER " . $token
    );
    $args = array(
      'body'        => null,
      'timeout'     => '10',
      'redirection' => '5',
      'blocking'    => true,
      'headers'     => $headers,
      'cookies'     => array()
    );
    // do GET request and cache data
    $r = wp_remote_get($url, $args);
    if (wp_remote_retrieve_response_code($r) == 200) {
      $data = json_decode(wp_remote_retrieve_body($r), true);
      $cached_data = array(
        'status' => 'good',
        'cached' => time(),
        'data' => $data[0]
      );
      // wp autoloads transients that dont expire, so lets set a long duration
      set_transient( $transient_id, $cached_data, YEAR_IN_SECONDS );
      $out = array_merge($out, $cached_data);
      $out['data'] = $out['data']['dates'];
    }
    else {
      $out['message'] = 'Libcal API is unavailable. Status code: ' . wp_remote_retrieve_response_code($r);
      $out['non200'] = true;
      $out['cached'] = time();
    }
    return $out;
  }

  private function setup_libcal_call($from, $to){
    $config = [
      'out' => [
        'status' => 'error',
        'data' => false,
        'source' => 'libcal'
      ]
    ];
    if (!$from && !$to){
      $dateRange = UCDLibPluginLocationsUtils::getHoursDateRange();
      $config['from'] = $dateRange[0];
      $config['to'] = $dateRange[1];
    } else {
      $config['from'] = $from;
      $config['to'] = $to;
    }
    $config['transient_id'] = 'libcal_hours_' . $this->ID . '?f=' . $from . '&t=' . $to;

    return $config;

  }

}
<?php
require_once( __DIR__ . '/utils.php' );

class UCDLibPluginLocationsLocation extends Timber\Post {
  
  protected $core_data;
  public function core_data(){
    if ( ! empty( $this->core_data ) ) {
      return $this->core_data;
    }
    $out = array(
      'id' => $this->ID,
      'labels' => $this->meta('labels'),
      'links' => array(),
      'parent' => $this->meta('parent'),
      'appointments' => $this->meta('appointments')
    );

    $out['labels']['title'] = $this->title();
    if ( array_key_exists("", $out['labels']) ) unset($out['labels']['']);

    $out['links']['native'] = $this->link();
    $out['links']['custom'] = $this->meta('custom_url');
    $out['links']['redirect_to_custom_url'] = $this->meta('redirect_to_custom_url');
    $out['links']['link'] = $out['links']['custom'] ? $out['links']['custom'] : $out['links']['native'];

    if ( !$out['appointments'] ) {
      $out['appointments'] = array(
        'required' => false
      );
    }

    $this->core_data = $out;
    return $this->core_data;
  }

  // Checks if location is properly set up to retrieve hours
  // returns array (bool, msg)
  protected $can_get_hours;
  public function can_get_hours(){

    if ( ! empty( $this->can_get_hours ) ) {
      return $this->can_get_hours;
    }
    $out = array(false);

    // check if hours are enabled on location admin page
    if ( !$this->meta('has_operating_hours') ){
      $out[] = "Location does not have operating hours.";
    }

    // check if libcal credentials are entered
    elseif ($this->meta('hours_system') === 'libcal') {
      if ( !$this->meta('libcal_id') ) {
        $out[] = 'Missing Libcal Library ID';
      }
      $creds = get_field('api_libcal', $this->post_type);
      if ( 
        !is_array( $creds ) ||
        !$creds['client_id'] ||
        !$creds['client_secret'] ||
        !$creds['url_hours'] ||
        !$creds['url_auth']
        ) {
        $out[] = 'Missing libcal API credentials!';
      }
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

    // Check short transient cache

    $out = array(
      'status' => 'error',
      'data' => false
    );

    // check if this location can get hours
    $can_get_hours = $this->can_get_hours();
    if ( !$can_get_hours[0] ){
      if ( isset($can_get_hours[1]) ) {
        $out['message'] = $can_get_hours[1];
      }
      $this->get_hours = $out;
      return $this->get_hours;
    }

    if ( $this->meta('hours_system') === 'libcal' ){
      $creds = get_field('api_libcal', $this->post_type);
      
      // get access token
      $token = $this->get_libcal_token();
      if ( !$token ) {
        $out['message'] = 'Unable to get libcal API token';
        $this->get_hours = $out;
        return $this->get_hours;
      }

      # construct GET request for libcal location
      $url = trailingslashit($creds['url_hours']) . $this->meta('libcal_id');
      $dateRange = UCDLibPluginLocationsUtils::getHoursDateRange();
      $url_params = array(
        'from' => $dateRange[0],
        'to' => $dateRange[1]
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
    }

    // do GET request and cache data
    $r = wp_remote_get($url, $args);
    if (wp_remote_retrieve_response_code($r) == 200) {
        $data = json_decode(wp_remote_retrieve_body($r), true);
        $out['data'] = $data;
    }
    else {
    }

    $this->get_hours = $out;
    return $this->get_hours;
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

}
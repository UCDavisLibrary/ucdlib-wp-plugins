<?php

class UCDLibPluginLocationsUtils {
  public static $dateFmt = 'Y-m-d';
  public static $tz = 'America/Los_Angeles';

  // Returns a range of dates given the number of weeks
  // Start date is always the sunday before today
  public static function getHoursDateRange($weeks=false) {
    if ( !$weeks ) {
      $weeks = get_field('hours_weeks', 'location');
      $weeks = $weeks ? $weeks : 4;
    }

    $start = new DateTime('now', new DateTimeZone('America/Los_Angeles'));
    $dayOfWeek = $start->format('N');
    if ($dayOfWeek != 7) {
      $start->modify('-' . $dayOfWeek . 'day');
    }
    $days = $weeks * 7 - 1;
    $end = clone $start;
    $end->modify('+' . $days . 'day');

    return array($start->format('Y-m-d'), $end->format('Y-m-d'));
  }

  public static function getTodaysHours($hours){
    $today = new DateTime('now', new DateTimeZone('America/Los_Angeles'));
    $today = $today->format('Y-m-d');

    if ( !array_key_exists('data', $hours) || !is_array($hours['data']) ){
      $todaysHours = false;
    } elseif ( !array_key_exists($today, $hours['data']) ) {
      $todaysHours = false;
    } else {
      $todaysHours = $hours['data'][$today];
    }
    $out = array_merge($hours, ['data' => $todaysHours]);
    return $out;
  }

  // deletes all transients used by this plugin
  public static function deleteTransients(){
    global $wpdb;
    $transients = $wpdb->get_results(
      "SELECT option_name AS name FROM $wpdb->options 
      WHERE option_name LIKE '_transient_libcal%' OR option_name LIKE '_transient_safespace%'"
    );
    foreach ($transients as $transient) {
      delete_transient(str_replace('_transient_', '', $transient->name));
    }
  }

  // fetches fresh hours data for all locations from libcal
  // deletes past transients
  public static function refreshAllHours(){
    global $wpdb;
    $out = [];
    $locations = [];
    $validRange = self::getHoursDateRange();

    $transients = $wpdb->get_results(
      "SELECT option_name AS name, option_value AS value FROM $wpdb->options 
      WHERE option_name LIKE '_transient_libcal_hours%'"
    );
    if ( !count($transients) ){
      $out['error'] = 'No hours transients in system!';
      return $out;
    }
    foreach ($transients as $transient) {
      $t = explode('?', $transient->name);
      if ( !count($t) == 2 ) continue;
      
      $dates = [];
      parse_str($t[1], $dates);
      if ( !array_key_exists('f', $dates) || !array_key_exists('t', $dates) ){
        continue;
      }
      
      $locationId = str_replace('_transient_libcal_hours_', '', $t[0]);
      if ( !array_key_exists($locationId, $locations) ){
        $out[$locationId] = [];
      }
      
      $from = DateTime::createFromFormat(self::$dateFmt, $dates['f'], new DateTimeZone(self::$tz) );
      $to = DateTime::createFromFormat(self::$dateFmt, $dates['t'], new DateTimeZone(self::$tz) );
      $log = ['dates' => $dates];

      if ( $validRange[0] < $from ){
        $log['action'] = 'refresh';
        if ( !array_key_exists($locationId, $locations) ){
          $locations[$locationId] = Timber::get_post( $locationId );
        } 
        $location = $locations[$locationId];
        if ( !$location ) {
          $log['action'] = 'expire';
          $log['message'] = 'location does not exist';
          $out[$locationId][] = $log;
          self::deleteTransient($transient);
          $log['status'] = 'good';
          continue;
        }
        if ( !$location->can_get_hours()[0] ) {
          $log['action'] = 'expire';
          $log['message'] = 'location not configured for hours retrieval.';
          $out[$locationId][] = $log;
          self::deleteTransient($transient);
          $log['status'] = 'good';
          continue;
        }
        $hours = $location->do_libcal_fetch($from->format(self::$dateFmt), $to->format(self::$dateFmt));
        if ( $hours['status'] == 'error' ){
          $log['status'] = 'error';
          if ( array_key_exists('message', $hours)) {
            $log['message'] = $hours['message'];
          }
          try {
            $d = unserialize($transient->value);
            $log['cacheAge'] = $d['cached'];
          } catch (\Throwable $th) {
          }
        } else {
          $log['status'] = 'success';
        }

      } else {
        $log['action'] = 'expire';
      }

      $out[$locationId][] = $log; 
      
    }
    return $out;
  }

  public static function deleteTransient( $transient ){
    delete_transient(str_replace('_transient_', '', $transient->name));
  }
}
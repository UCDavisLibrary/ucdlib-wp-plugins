<?php

class UCDLibPluginLocationsUtils {
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
}
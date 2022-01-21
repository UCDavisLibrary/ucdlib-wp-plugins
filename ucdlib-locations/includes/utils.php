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
    $end = clone $start;
    $end->modify('+' . $weeks . 'week')->modify('-1day');

    return array($start->format('Y-m-d'), $end->format('Y-m-d'));
  }
}
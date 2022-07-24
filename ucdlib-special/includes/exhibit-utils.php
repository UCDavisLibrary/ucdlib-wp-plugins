<?php

class UCDLibPluginSpecialExhibitUtils {
  public static function getExhibits($query){
    $wp_query = [
      'post_type' => 'exhibit'
    ];
    $meta_query = [];

    if ( array_key_exists('status', $query) ){
      $tz = new DateTimeZone("America/Los_Angeles");
      $today = (new DateTime('today', $tz))->format('Y-m-d');
      if ( $query['status'] == 'current'){
        $meta_query[] = [
          'key' => 'dateFrom',
          'value' => $today,
          'compare' => '<=',
          'type' => 'DATE'
        ];
        $meta_query[] = [
          'key' => 'dateTo',
          'value' => $today,
          'compare' => '>=',
          'type' => 'DATE'
        ];
      } else if ( $query['status'] == 'past' ) {
        $meta_query[] = [
          'key' => 'dateFrom',
          'value' => $today,
          'compare' => '<',
          'type' => 'DATE'
        ];
        $meta_query[] = [
          'key' => 'dateTo',
          'value' => $today,
          'compare' => '<',
          'type' => 'DATE'
        ];
      } else if ( $query['status'] == 'permanent' ){
        $meta_query[] = [
          'key' => 'isPermanent',
          'value' => true,
          'compare' => '=',
          'type' => 'BINARY'
        ];
      } else if ( $query['status'] == 'current_permanent' ) {
        $meta_query[] = [
          'relation' => 'OR',
          [
            'key' => 'isPermanent',
            'value' => true,
            'compare' => '=',
            'type' => 'BINARY'
          ],
          [
            'relation' => 'AND',
            [
              'key' => 'dateFrom',
              'value' => $today,
              'compare' => '<=',
              'type' => 'DATE'
            ],
            [
              'key' => 'dateTo',
              'value' => $today,
              'compare' => '>=',
              'type' => 'DATE'
            ]
          ]
        ];
      }

      if ( count($meta_query) ) {
        $meta_query['relation'] = 'AND';
        $wp_query['meta_query'] = $meta_query;
      }
    }
    $exhibits = Timber::get_posts($wp_query);
    return $exhibits;
  }
}
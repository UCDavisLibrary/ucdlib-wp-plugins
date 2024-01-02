<?php

class UCDLibPluginSpecialExhibitUtils {
  public static function getExhibits($query){
    $wp_query = [
      'post_type' => 'exhibit',
      'post_parent' => 0
    ];
    $meta_query = [];
    $tax_query = [];

    if ( array_key_exists('paged', $query) ){
      $wp_query['paged'] = $query['paged'];
    }

    if ( array_key_exists('exhibitStart', $query) && $query['exhibitStart']){
      $s = $query['exhibitStart'];
      $meta_query[] = [
        'relation' => 'AND',
        [
          'key' => 'dateFrom',
          'value' => $s . '-01-01',
          'compare' => '>=',
          'type' => 'DATE'
        ],
        [
          'key' => 'dateFrom',
          'value' => $s . '-12-31',
          'compare' => '<=',
          'type' => 'DATE'
        ],
      ];
    }

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
    }

    if ( array_key_exists('isOnline', $query) && $query['isOnline']) {
      $meta_query[] = [
        'key' => 'isOnline',
        'value' => true,
        'compare' => '=',
        'type' => 'BINARY'
      ];
    }

    if ( array_key_exists('curatorOrg', $query) && count($query['curatorOrg'])){
      $tax_query[] = [
        'taxonomy' => 'curator',
        'field' => 'id',
        'terms' => $query['curatorOrg'],
        'operator' => 'IN'
      ];
    }

    if ( array_key_exists('curator', $query)){
      $q = ['relation' => 'OR'];
      foreach ($query['curator'] as $curator) {
        $q[] = [
          'key' => 'curators',
          'value' => $curator,
          'compare' => 'LIKE',
          //'type' => 'NUMERIC'
        ];
      }
      $meta_query[] = $q;
    }

    if ( array_key_exists('orderby', $query) ){
      if ( $query['orderby'] == 'title' ){
        $wp_query['orderby'] = 'title';
        $wp_query['order'] = 'ASC';
      } elseif ( $query['orderby'] == 'start_date' ){
        $wp_query['orderby'] = 'meta_value';
        $wp_query['order'] = 'DESC';
        $wp_query['meta_type'] = 'DATE';
        $wp_query['meta_key'] = 'dateFrom';
      } elseif ( $query['orderby'] == 'date' ) {
        $wp_query['orderby'] = 'date';
        $wp_query['order'] = 'DESC';
      } elseif ( $query['orderby'] == 'menu_order' ) {
        $wp_query['orderby'] = 'menu_order';
        $wp_query['order'] = 'ASC';
      }
    }

    if ( array_key_exists('postsPerPage', $query) ){
      $wp_query['posts_per_page'] = $query['postsPerPage'];
    } else {
      $wp_query['posts_per_page'] = 10;
    }

    if ( count($meta_query) ) {
      $meta_query['relation'] = 'AND';
      $wp_query['meta_query'] = $meta_query;
    }

    if ( count($tax_query) ) {
      $tax_query['relation'] = 'AND';
      $wp_query['tax_query'] = $tax_query;
    }
    $exhibits = Timber::get_posts($wp_query);
    return $exhibits;
  }

  public static function explodeQueryVar($queryVar, $asInt=true, $delim=','){
    $q = get_query_var($queryVar, '');
    $q = explode($delim, $q);
    if ( $asInt ) {
      $q = array_map(function($id){return intval($id);}, $q);
    } else {
      $q = array_map('strtolower', $q);
    }
    $q = array_filter($q, function($v){return $v;});
    return $q;
  }

  public static function getExhibitYears(){
    $years = [];
    $wp_query = [
      'post_type' => 'exhibit',
      'post_parent' => 0,
      'posts_per_page' => 1,
      'orderby' => 'meta_value',
      'order' => 'ASC',
      'meta_type' => 'DATE',
      'meta_key' => 'dateFrom',
      'meta_query' => [
        [
          'key' => 'dateFrom',
          'compare' => 'EXISTS'
        ],
        [
          'key' => 'dateFrom',
          'compare' => '!=',
          'value' => ''
        ]
      ]
    ];
    $oldestExhibit = Timber::get_posts($wp_query);
    if ( !$oldestExhibit->found_posts ) return $years;
    $oldestExhibit = $oldestExhibit[0];
    $oldestYear = intval(substr($oldestExhibit->exhibitDateFrom(), 0, 4));

    $wp_query['order'] = 'DESC';
    $newestExhibit = Timber::get_posts($wp_query);
    if ( !$newestExhibit->found_posts ) return $years;
    $newestExhibit = $newestExhibit[0];
    $newestYear = intval(substr($newestExhibit->exhibitDateFrom(), 0, 4));

    $year = $newestYear;
    while ($year >= $oldestYear) {
      $years[] = $year;
      $year -= 1;
    }

    return $years;
  }
}

<?php

class UCDLibPluginSpecialExhibitUtils {
  public static function getExhibits($query){
    $wp_query = [
      'post_type' => 'exhibit'
    ];
    $meta_query = [];
    $tax_query = [];

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
    //var_dump( $wp_query );
    $exhibits = Timber::get_posts($wp_query);
    return $exhibits;
  }
}
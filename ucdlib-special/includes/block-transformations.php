<?php

require_once( __DIR__ . '/config.php' );
require_once( __DIR__ . '/exhibit-utils.php' );

// Contains methods that transform the attributes of a block (mostly fetching additional data)
// See 'transform' property in $registry array in blocks class.
class UCDLibPluginSpecialBlockTransformations {


  // get link to archives and special collections homepage
  public static function deptLanderLink( $attrs=[] ){
    $transient = 'asc_dept_page_link';
    if ( false === ( $link = get_transient( $transient ) ) ) {
      $slug = UCDLibPluginSpecialConfig::$config['slug'];
      $p = get_field('asc_dept_page', $slug);
      if ( $p ) {
        $p = Timber::get_post($p);
        if ( $p ) {
          $link = $p->link();
        }
      }
      set_transient( $transient, $link, 24 * HOUR_IN_SECONDS );
    }
    $attrs['dept_page_link'] = $link;
    return $attrs;
  }

  public static function getExhibit($attrs){
    if ( array_key_exists('exhibitId', $attrs) && $attrs['exhibitId']){
      $attrs['exhibit'] = Timber::get_post($attrs['exhibitId']);
    }
    return $attrs;
  }

  public static function getExhibits( $attrs ){
    $attrs['exhibits'] = UCDLibPluginSpecialExhibitUtils::getExhibits($attrs);
    return $attrs;
  }

  public static function hideExhibitExcerpt( $attrs ) {
    if ( !array_key_exists('templateTeaserOptions', $attrs) ){
      $attrs['templateTeaserOptions'] = [];
    } 
    $attrs['templateTeaserOptions']['hideExcerpt'] = true;
    return $attrs;
  }

  public static function getPastExhibits( $attrs ){
    $attrs['orderby'] = 'start_date';
    $attrs['postsPerPage'] = 20;
    $attrs['status'] = 'past';
    $attrs['curatorOrg'] = UCDLibPluginSpecialExhibitUtils::explodeQueryVar('curator');
    $attrs['paged'] = ( get_query_var('paged') ) ? get_query_var('paged') : 1;
    $attrs['exhibitStart'] = get_query_var('exhibit_start', '');
    
    $attrs['exhibits'] = UCDLibPluginSpecialExhibitUtils::getExhibits($attrs);
    
    // group by year
    $years = [];
    foreach ($attrs['exhibits'] as $exhibit) {
      $start = substr($exhibit->exhibitDateFrom(), 0, 4);
      if ( !array_key_exists($start, $years)){
        $years[$start] = [];
      }
      $years[$start][] = $exhibit;
    }
    $attrs['years'] = $years;

    $attrs['teaserOptions'] = [
      'hideExcerpt' => true,
      'hideLocation' => true
    ];

    return $attrs;
  }

  public static function getOnlineExhibits( $attrs ){
    $attrs['orderby'] = get_query_var('orderby', 'title');
    $attrs['curatorOrg'] = UCDLibPluginSpecialExhibitUtils::explodeQueryVar('curator');
    $attrs['isOnline'] = true;
    $attrs['postsPerPage'] = -1;
    $attrs['exhibits'] = UCDLibPluginSpecialExhibitUtils::getExhibits($attrs);
    return $attrs;
  }

    // converts directory url query args to attributes
    public static function queryArgsToAttributesSubject($attrs){
      $attrs['orderby'] = get_query_var('orderby', '');
      $attrs['q'] =  get_query_var('q', '');
      $attrs['subject'] =  get_query_var('collection-subject', '');
      return $attrs;
    }
        // converts directory url query args to attributes
    public static function queryArgsToAttributesAZ($attrs){
      $attrs['orderby'] = get_query_var('orderby', '');
      $attrs['q'] =  get_query_var('q', '');
      $attrs['az'] =  get_query_var('collection-az', '');
      return $attrs;
    }
    /**
   * Gets people/departments based on url query parameters
   */
  public static function getCollectionFiltResults( $attrs=[] ){

    $collectionQuery = [
      'post_type' => 'collection',
      'order' => 'ASC',
      'posts_per_page' => -1
    ];
    $tax_query = [];


    // set order of results
    $orderby = $attrs['orderby'];

    // keyword search
    $kwQueryVar = $attrs['q'];
    if ( count( $kwQueryVar ) ) $collectionQuery['s'] = implode(' ', $kwQueryVar);
    

    // filter by subject
    $subQueryVar = $attrs['subject'];
    if ( count($subQueryVar) ){
      $tax_query[] = [
        'taxonomy' => 'collection-subject',
        'field' => 'term_id',
        'terms' => $subQueryVar,
        'operator' => 'IN'
      ];
    }

    // filter by az
    $azQueryVar = $attrs['az'];
    if ( count($azQueryVar) ){
      $tax_query[] = [
        'taxonomy' => 'collection-az',
        'field' => 'term_id',
        'terms' => $azQueryVar,
        'operator' => 'IN'
      ];
    }

    // add any taxonomies to collection query
    if ( count($tax_query) ){
      if ( count($tax_query) > 1){
        $tax_query['relation'] = 'AND';
      }
      $collectionQuery['tax_query'] = $tax_query;
    }

    $collectionWithFilters = [];
    $attr['collectionResults'] = Timber::get_posts($collectionQuery);

    return $attrs;
  }
}
}
?>
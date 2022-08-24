<?php

require_once( __DIR__ . '/config.php' );
require_once( __DIR__ . '/exhibit-utils.php' );
require_once( __DIR__ . '/collection-utils.php' );

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

  
  // converts collection url query args to attributes
  public static function collectionQueryArgsToAttributes($attrs){
    $attrs['tax'] =  get_query_var('collection-tax', '');
    $attrs['az'] = get_query_var('collection-az', 'a');
    return $attrs;
  }
  /**
   * Gets list of collections faceted by subject or az
   */
  public static function getCollectionFiltResults( $attrs=[] ){
    
    // set default view based on collection type
    $collectionType = array_key_exists('collectionType', $attrs) ? $attrs['collectionType'] : '';
    if ( !$attrs['tax'] && $collectionType == 'manuscript' ){
      $attrs['tax'] = 'subject';
    } elseif ( !$attrs['tax'] ){
      $attrs['tax'] = 'az';
    }

    if ($attrs['tax'] != 'az') {
      $subjects = Timber::get_terms([
        'taxonomy' => 'collection-subject',
        'orderby' => 'name',
        'hide_empty' => true
      ]);
      $attrs['subjects'] = $subjects;

    } else {

      // get az counts
      $noAZ = array();
      if ( $collectionType ) {
        $azTermCt = UCDLibPluginSpecialCollectionUtils::getAzByCollectionType($collectionType);
        foreach ($azTermCt as $letter => $ct) {
          if ( !$ct ) $noAZ[] = $letter;
        }
      } else {
        $az = Timber::get_terms([
          'taxonomy' => 'collection-az',
          'orderby' => 'name',
          'count' => true,
          'hide_empty' => false
        ]);
        foreach ($az as $letter) {
          if($letter->count == 0){
            array_push($noAZ, $letter->slug);
          }
        }
      }
      $attrs['noAZ'] = implode(",",$noAZ);

      // get collections in az term
      $azQueryVar = $attrs['az'];
      $collectionQuery = [
        'post_type' => 'collection',
        'orderby' => 'title',
        'order' => 'ASC',
        'posts_per_page' => -1,
        'tax_query' =>  [[
            'taxonomy' => 'collection-az',
            'field' => 'slug',
            'terms' => $azQueryVar,
        ]]
      ];
      if ( $collectionType ) {
        $collectionQuery['meta_query'] = [[
          'key' => 'collectionType',
          'value' => $collectionType
        ]];

      }
      $attrs['collectionResults'] = Timber::get_posts($collectionQuery);

    }
 
    
    return $attrs;
  }

}
?>
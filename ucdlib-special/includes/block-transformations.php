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
      $attrs['templateTeaserOptions']['hideExcerpt'] = true;
    }
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
}
?>
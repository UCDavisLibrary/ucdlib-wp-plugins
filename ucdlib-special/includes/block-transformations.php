<?php

require_once( __DIR__ . '/config.php' );

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
}
?>
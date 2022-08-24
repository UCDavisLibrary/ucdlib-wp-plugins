<?php

// Contains methods that transform the attributes of a block (mostly fetching additional data)
// See 'transform' property in $registry array in blocks class.
class UCDLibPluginLocationsBlockTransformations {

  static function getCurrentLocationId($attrs){
    if ( !array_key_exists('locationId', $attrs) || !$attrs['locationId'] ) {
      $attrs['locationId'] = get_the_ID();
    }
    return $attrs;
  }

  static function getSiteUrl($attrs){
    $attrs['site_url'] = get_site_url();
    return $attrs;
  }

  static function getLocationMeta($attrs){
    $attrs['meta'] = get_post_meta(get_the_ID());
    return $attrs;
  }

  static function getAddress($attrs){
    $attrs['icon'] = 'ucd-public:fa-location-dot';
    if ( array_key_exists('text', $attrs) && $attrs['text'] ) {
      return $attrs;
    }
    $attrs['text'] = get_post_meta(get_the_ID(), 'display_address', true);
    return $attrs;
  }

  static function getLocation($attrs){
    if ( array_key_exists('locationId', $attrs) ){
      $attrs['location'] = Timber::get_post($attrs['locationId']);
    }
    return $attrs;
  }

  static function addIcons($attrs) {
    $attrs['icons'] = ['ucd-public:fa-circle-exclamation'];
    return $attrs;
  }

  static function signSectionStyle($attrs){
    $style = '';
    if ( array_key_exists('backgroundColor', $attrs) ) {
      $v = $attrs['backgroundColor'];
      $style .= "background-color:$v;";
    }
    if ( array_key_exists('textColor', $attrs) ) {
      $v = $attrs['textColor'];
      $style .= "color:$v;";
    }
    if ( array_key_exists('justifyContent', $attrs) ) {
      $v = $attrs['justifyContent'];
      $style .= "justify-content:$v;";
    }
    if ( array_key_exists('alignItems', $attrs) ) {
      $v = $attrs['alignItems'];
      $style .= "align-items:$v;";
    }
    if ( array_key_exists('flexGrow', $attrs) ){
      $style .= "flex-grow:1;";
    }
    if ( array_key_exists('padding', $attrs) ) {
      $v = $attrs['padding'];
      $style .= "padding:$v;";
    }
    if ( array_key_exists('margin', $attrs) ) {
      $v = $attrs['margin'];
      $style .= "margin:$v;";
    }
    if ( array_key_exists('lineHeight', $attrs) ) {
      $v = $attrs['lineHeight'];
      $style .= "line-height:$v;";
    }
    if ( array_key_exists('fontWeight', $attrs) ) {
      $v = $attrs['fontWeight'];
      $style .= "font-weight:$v;";
    }

    $attrs['style'] = $style;
    return $attrs;
  }
}
?>
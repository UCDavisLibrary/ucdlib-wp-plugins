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
}
?>
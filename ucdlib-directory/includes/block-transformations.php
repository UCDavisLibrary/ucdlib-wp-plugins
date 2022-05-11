<?php

// Contains methods that transform the attributes of a block (mostly fetching additional data)
// See 'transform' property in $registry array in blocks class.
class UCDLibPluginDirectoryBlockTransformations {
  public static function getPosition($attrs=array()){
    $post_id = get_the_ID();
    $attrs['title'] = get_post_meta($post_id, 'position_title', true);
    $dept_id = get_post_meta($post_id, 'position_dept', true);
    if ( $dept_id ) {
      $dept = Timber::get_post( $dept_id );
      if ( $dept ) {
        $attrs['department'] = $dept->title();

      }
    }
    
    return $attrs;
  }

  public static function getPronouns($attrs=[]){
    $post_id = get_the_ID();
    $attrs['pronouns'] = get_post_meta($post_id, 'pronouns', true);
    $attrs['hide'] = get_post_meta($post_id, 'hidePronouns', true);
    return $attrs;
  }
}
?>
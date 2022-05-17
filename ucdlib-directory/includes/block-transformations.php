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
    $attrs['hide'] = get_post_meta($post_id, 'hide_pronouns', true);
    return $attrs;
  }

  public static function getBio($attrs=[]){
    $post_id = get_the_ID();
    $attrs['bio'] = get_post_meta($post_id, 'bio', true);
    $attrs['hide'] = get_post_meta($post_id, 'hide_bio', true);
    return $attrs;
  }

  public static function getLibraries($attrs=[]){
    $post_id = get_the_ID();
    $attrs['libraries'] = get_the_terms($post_id, 'library');
    $attrs['hide'] = get_post_meta($post_id, 'hide_libraries', true);
    return $attrs;
  }

  public static function getDirectoryTags($attrs=[]){
    $post_id = get_the_ID();
    $attrs['tags'] = get_the_terms($post_id, 'directory-tag');
    $attrs['hide'] = get_post_meta($post_id, 'hide_tags', true);
    return $attrs;
  }

  public static function getExpertiseAreas($attrs=[]){
    $post_id = get_the_ID();
    $attrs['tags'] = get_the_terms($post_id, 'expertise-areas');
    $attrs['hide'] = get_post_meta($post_id, 'hide_tags', true);
    return $attrs;
  }
}
?>
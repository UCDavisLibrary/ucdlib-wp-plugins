<?php

class UCDLibPluginSpecialCollectionUtils {
  public static function getAzByCollectionType($collectionType, $clearTransient=false){
    $transientSlug = "ucdlib-special-az-$collectionType";

    if ( $clearTransient ) {
      delete_transient( $transientSlug );
    }
    
    $out = get_transient( $transientSlug );
    if ( false === ( $out ) ) {
      $out = [];
      $letters = get_terms([
        'taxonomy' => 'collection-az',
        'hide_empty' => false,
        'fields' => 'slugs'
      ]);
      foreach ($letters as $letter) {
        $q = new WP_Query( [
          'post_type' => 'collection',
          'meta_value' => $collectionType,
          'meta_key' => 'collectionType',
          'fields' => 'ids',
          'posts_per_page' => 1,
          'tax_query' =>  [[
            'taxonomy' => 'collection-az',
            'field' => 'slug',
            'terms' => $letter,
          ]],
        ] );
        $out[$letter] = $q->found_posts;
      }
      set_transient( $transientSlug, $out, DAY_IN_SECONDS );
    }
    
    return $out;
  }
}
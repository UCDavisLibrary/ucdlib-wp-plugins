<?php

class UCDLibPluginSpecialExhibitUtils {
  public static function getExhibits($query){
    $wp_query = [
      'post_type' => 'exhibit'
    ];
    $exhibits = Timber::get_posts($wp_query);
    return $exhibits;
  }
}
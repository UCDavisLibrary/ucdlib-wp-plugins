<?php

/**
 * Adds ability to associate and display multliple "person" post types with a post
 */
class UCDLibPluginDirectoryAdditionalAuthors {
  public function __construct( $config ){
    $this->config = $config;

    add_filter( 'timber/context', array( $this, 'registerViews' ));
    add_filter( 'ucd-theme/post/additional_authors', array( $this, 'getAdditionalAuthors' ), 10, 2);
  }

  /**
   * Displays views in this plugin by registering with theme hooks
   */
  public function registerViews($context){
    $partialDir = '@ucdlib-directory/partials/';
    $context['twigHooks']['post']['additionalAuthors'][] = $partialDir . 'additional-authors-post.twig';
    $context['twigHooks']['teaser']['additionalAuthors'][] = $partialDir . 'additional-authors-teaser.twig';
    return $context;
  }


  public function getAdditionalAuthors($posts, $postIds){
    if ( !count($postIds) ) return $posts;
    $posts = Timber::get_posts([
      'post_type' => 'person',
      'ignore_sticky_posts' => true,
      'posts_per_page' => -1,
      'post__in' => $postIds,
      'orderby' => 'post__in'
    ]);
    return $posts;
  }
}
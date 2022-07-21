<?php

// Sets up block patterns for this plugin
class UCDLibPluginSpecialPatterns {
  public function __construct($config){
    $this->config = $config;
    $this->slug = $config['slug'];

    add_action( 'init', [$this, 'register']);
  }

  public function register(){
    register_block_pattern_category(
      $this->slug,
      ['label' => 'Special Collections']
    );

    register_block_pattern(
      "$this->slug/collection",
      [
        'title' => 'Special Collections',
        'content' => $this->markupCollection(),
        'description' => 'Special Collection record',
        'categories' => [$this->slug],
        'keywords' => ['special', 'collection', 'manuscript'],
      ]
    );
  }

  public function markupCollection(){
    return "
      <!-- wp:ucd-theme/layout-basic -->
      <!-- wp:ucd-theme/column {\"layoutClass\":\"l-content\",\"forbidWidthEdit\":true} -->
      <!-- wp:ucd-theme/special-description /-->
      <!-- wp:ucd-theme/special-finding-aid /-->
      <!-- wp:ucd-theme/special-biography /-->
      <!-- wp:ucd-theme/special-inclusive-dates /-->
      <!-- wp:ucd-theme/special-extent /-->
      <!-- wp:ucd-theme/special-subject /-->
      <!-- /wp:ucd-theme/column -->
      <!-- /wp:ucd-theme/layout-basic -->
    ";
  }

}
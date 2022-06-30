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
      <!-- wp:ucd-theme/column {\"layoutClass\":\"l-sidebar-first\",\"forbidWidthEdit\":true} -->
      <!-- wp:ucd-theme/background-color -->
      <!-- wp:paragraph -->
      <p><strong>Many collections are stored offsite and should be requested at least 7 business days in advance of your visit.</strong></p>
      <!-- /wp:paragraph -->
      <!-- /wp:ucd-theme/background-color -->
      <!-- wp:heading {\"level\":4} -->
      <h4 id=\"how-to-access-materials\">How to Access Materials</h4>
      <!-- /wp:heading -->
      <!-- wp:paragraph -->
      <p>To request an item, go to the <strong>Finding Aid</strong> linked on the item's information page and select the \"Request Items\" button. This will initiate a request form for that item within the Aeon request system.</p>
      <!-- /wp:paragraph -->
      <!-- wp:paragraph -->
      <p>Please check your Aeon account to confirm that the item is listed as \"Available in Reading Room\" before visiting. </p>
      <!-- /wp:paragraph -->
      <!-- wp:ucd-theme/button-link {\"content\":\"Login to Aeon\"} /-->
      <!-- wp:paragraph -->
      <p><strong><em>New to Aeon?</em></strong> <a href=\"http://library.ucdavis.edu\">Create an account</a></p>
      <!-- /wp:paragraph -->
      <!-- /wp:ucd-theme/column -->
      <!-- /wp:ucd-theme/layout-basic -->
    ";
  }

}
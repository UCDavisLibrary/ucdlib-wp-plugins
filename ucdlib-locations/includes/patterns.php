<?php

// Sets up block patterns for this plugin
class UCDLibPluginLocationsPatterns {

  public $config;
  public $slug;

  public function __construct($config){
    $this->config = $config;
    $this->slug = $config['slug'];

    add_action( 'init', [$this, 'register'], 20);
  }

  public function register(){
    register_block_pattern_category(
      $this->slug,
      ['label' => 'Library Locations']
    );

    register_block_pattern(
      "$this->slug/amenities",
      [
        'title' => 'Location Amenities',
        'content' => $this->markupAmenities(),
        'description' => 'List of location Amenities',
        'categories' => [$this->slug],
        'keywords' => ['service', 'at', 'this', 'library', 'infastructure'],
      ]
    );

    register_block_pattern(
      "$this->slug/actions",
      [
        'title' => 'Location Actions',
        'content' => $this->markupActions(),
        'description' => 'List of location services and pages',
        'categories' => [$this->slug],
        'keywords' => ['service', 'use', 'the', 'library'],
      ]
    );

    register_block_pattern(
      "$this->slug/about",
      [
        'title' => 'About a Location',
        'content' => $this->markupAbout(),
        'description' => 'Blurb and facts about a location',
        'categories' => [$this->slug],
        'keywords' => ['fact', 'library', 'know', 'learn'],
      ]
    );
  }

  public function markupAmenities(){
    return "
    <!-- wp:ucd-theme/object-box -->
    <!-- wp:ucd-theme/heading {\"content\":\"At This Library\"} /-->

    <!-- wp:list {\"className\":\"list\u002d\u002darrow\"} -->
    <ul class=\"list--arrow\"><li></li></ul>
    <!-- /wp:list -->
    <!-- /wp:ucd-theme/object-box -->
    ";
  }

  public function markupActions(){
    return "
    <!-- wp:ucd-theme/object-box {\"padding\":\"flush\"} -->
    <!-- wp:ucd-theme/heading {\"content\":\"Use the Library\"} /-->

    <!-- wp:ucd-theme/layout-columns {\"columnCt\":3} -->
    <!-- wp:ucd-theme/column {\"layoutClass\":\"l-first\",\"forbidWidthEdit\":true} -->
    <!-- wp:ucd-theme/marketing-highlight-horizontal /-->
    <!-- /wp:ucd-theme/column -->

    <!-- wp:ucd-theme/column {\"layoutClass\":\"l-second\",\"forbidWidthEdit\":true} -->
    <!-- wp:ucd-theme/marketing-highlight-horizontal /-->
    <!-- /wp:ucd-theme/column -->

    <!-- wp:ucd-theme/column {\"layoutClass\":\"l-third\",\"forbidWidthEdit\":true} -->
    <!-- wp:ucd-theme/marketing-highlight-horizontal /-->
    <!-- /wp:ucd-theme/column -->
    <!-- /wp:ucd-theme/layout-columns -->
    <!-- /wp:ucd-theme/object-box -->
    ";
  }

  public function markupAbout(){
    return "
      <!-- wp:ucd-theme/object-box {\"padding\":\"flush\"} -->
      <!-- wp:ucd-theme/heading {\"content\":\"About\"} /-->

      <!-- wp:image {\"align\":\"right\",\"sizeSlug\":\"large\",\"linkDestination\":\"none\",\"className\":\"is-style-rounded pct-width\u002d\u002d30\"} -->
      <div class=\"wp-block-image is-style-rounded pct-width--30\"><figure class=\"alignright size-large\"><img src=\"/wp-content/themes/ucdlib-theme-wp/assets/img/block-defaults/135x135.png\" alt=\"\"/></figure></div>
      <!-- /wp:image -->

      <!-- wp:paragraph {\"placeholder\":\"an intro paragraph...\"} -->
      <!-- /wp:paragraph -->

      <!-- wp:heading {\"level\":5} -->
      <h5 id=\"did-you-know\">Did you know?</h5>
      <!-- /wp:heading -->

      <!-- wp:list {\"className\":\"list\u002d\u002darrow\",\"placeholder\":\"fact one...\"} -->
      <ul class=\"list--arrow\"><li></li></ul>
      <!-- /wp:list -->

      <!-- wp:heading {\"level\":5} -->
      <h5 id=\"learn-more\">Learn More:</h5>
      <!-- /wp:heading -->

      <!-- wp:ucd-theme/layout-columns {\"columnCt\":3} -->
      <!-- wp:ucd-theme/column {\"layoutClass\":\"l-first\",\"forbidWidthEdit\":true} -->
      <!-- wp:ucd-theme/marketing-highlight-horizontal /-->
      <!-- /wp:ucd-theme/column -->

      <!-- wp:ucd-theme/column {\"layoutClass\":\"l-second\",\"forbidWidthEdit\":true} -->
      <!-- wp:ucd-theme/marketing-highlight-horizontal /-->
      <!-- /wp:ucd-theme/column -->

      <!-- wp:ucd-theme/column {\"layoutClass\":\"l-third\",\"forbidWidthEdit\":true} -->
      <!-- wp:ucd-theme/marketing-highlight-horizontal /-->
      <!-- /wp:ucd-theme/column -->
      <!-- /wp:ucd-theme/layout-columns -->
      <!-- /wp:ucd-theme/object-box -->
    ";
  }
}

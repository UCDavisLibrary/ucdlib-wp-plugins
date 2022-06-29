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
  }

//     register_block_pattern(
//       "$this->slug/amenities",
//       [
//         'title' => 'Location Amenities',
//         'content' => $this->markupAmenities(),
//         'description' => 'List of location Amenities',
//         'categories' => [$this->slug],
//         'keywords' => ['service', 'at', 'this', 'library', 'infastructure'],
//       ]
//     );


//   }

//   public function markupAmenities(){
//     return "
//     <!-- wp:ucd-theme/object-box -->
//     <!-- wp:ucd-theme/heading {\"content\":\"At This Library\"} /-->
    
//     <!-- wp:list {\"className\":\"list\u002d\u002darrow\"} -->
//     <ul class=\"list--arrow\"><li></li></ul>
//     <!-- /wp:list -->
//     <!-- /wp:ucd-theme/object-box -->
//     ";
//   }

}
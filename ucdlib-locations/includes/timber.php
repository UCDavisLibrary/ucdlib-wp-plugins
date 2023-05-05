<?php

require_once( __DIR__ . '/location.php' );
require_once( __DIR__ . '/block-transformations.php' );

// Sets up all Timber-related functionality
class UCDLibPluginLocationsTimber {

  public function __construct( $config ){
    $this->config = $config;
    add_filter( 'timber/locations', array($this, 'add_timber_locations') );
    add_filter( 'timber/post/classmap', array($this, 'extend_post') );
    add_filter( 'timber/twig', array( $this, 'add_to_twig' ), 10 );
  }

  /**
   * Adds twig files under the @ucdlib-locations namespace
   */
  public function add_timber_locations($paths){
    $paths[$this->config['slug']] = array(WP_PLUGIN_DIR . "/" . $this->config['slug'] . '/views');
    return $paths;
  }

  public function extend_post($classmap) {
    $custom_classmap = array(
      'location' => UCDLibPluginLocationsLocation::class,
    );

    return array_merge( $classmap, $custom_classmap );
  }

  public function add_to_twig( $twig ) {
    $twig->addFunction( new Twig\TwigFunction( 'get_space_legend_props', array( $this, 'get_space_legend_props' ) ) );
    $twig->addFunction( new Twig\TwigFunction( 'get_legend_props', array( $this, 'get_legend_props' ) ) );
    $twig->addFunction( new Twig\TwigFunction( 'get_floor_props', array( $this, 'get_floor_props' ) ) );
    return $twig;
  }

  public function get_space_legend_props( $block ){
    $props = [
      'spaces' => []
    ];
    $props['title'] = array_key_exists('title', $block->attributes) ? $block->attributes['title'] : 'Study Spaces';
    foreach ( $block->inner_blocks as $space ) {
      if ( !array_key_exists('label', $space->attributes) || !array_key_exists('slug', $space->attributes) ) continue;
      $props['spaces'][] = [
        'label' => $space->attributes['label'],
        'slug' => $space->attributes['slug'],
        'color' => array_key_exists('brandColor', $space->attributes) ? $space->attributes['brandColor'] : 'admin-blue',
        'icon' => array_key_exists('icon', $space->attributes) ? $space->attributes['icon'] : 'ucd-public:fa-star'
      ];
    }
    return $props;
  }

  public function get_legend_props( $block ){
    $props = [
      'items' => []
    ];
    $props['title'] = array_key_exists('title', $block->attributes) ? $block->attributes['title'] : 'Map Legend';
    foreach ( $block->inner_blocks as $item ) {
      if ( !array_key_exists('label', $item->attributes) ) continue;
      $props['items'][] = [
        'label' => $item->attributes['label'],
        'icon' => array_key_exists('icon', $item->attributes) ? $item->attributes['icon'] : 'ucd-public:fa-star'
      ];
    }
    return $props;
  }

  public function get_floor_props( $block ){
    $props = [
      'layers' => []
    ];
    $propKeys = ['title', 'subTitle', 'navText'];
    foreach ( $propKeys as $key ) {
      $props[$key] = array_key_exists($key, $block->attributes) ? $block->attributes[$key] : '';
    }
    $props['showOnLoad'] = array_key_exists('showOnLoad', $block->attributes) ? $block->attributes['showOnLoad'] : false;
    if ( array_key_exists('map-floors/bottomLayerId', $block->context) && $block->context['map-floors/bottomLayerId'] ) {
      $block->attributes['bottomLayerId'] = $block->context['map-floors/bottomLayerId'];
    }
    $block->attributes = UCDLibPluginLocationsBlockTransformations::getImage($block->attributes);
    if ( array_key_exists('topLayer', $block->attributes) && $block->attributes['topLayer'] ) {
      $props['topLayer'] = $block->attributes['topLayer']->src();
    }

    // Disable bottom layer feature for now, might need to revisit
    //if ( array_key_exists('bottomLayer', $block->attributes) && $block->attributes['bottomLayer'] ) {
    //  $props['bottomLayer'] = $block->attributes['bottomLayer']->src();
    // }

    foreach ( $block->inner_blocks as $layer ) {
      if ( !array_key_exists('spaceSlug', $layer->attributes) ) continue;
      $layer->attributes = UCDLibPluginLocationsBlockTransformations::getImage($layer->attributes);
      if ( !array_key_exists('image', $layer->attributes) || !$layer->attributes['image']) continue;
      $props['layers'][] = [
        'slug' => $layer->attributes['spaceSlug'],
        'src' => $layer->attributes['image']->src(),
      ];
    }
    return $props;
  }


}

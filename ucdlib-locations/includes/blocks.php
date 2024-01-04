<?php
require_once( __DIR__ . '/block-transformations.php' );
require_once( get_template_directory() . '/includes/classes/block-renderer.php' );

// Set up server-side rendering for gutenberg location blocks
class UCDLibPluginLocationsBlocks extends UCDThemeBlockRenderer {

  public $config;
  public $slug;

  public static $registry = [
    "ucdlib-locations/hours-today" => [
      'twig' => "@ucdlib-locations/blocks/hours-today.twig",
      'transform' => ['getCurrentLocationId', 'getSiteUrl']
    ],
    "ucdlib-locations/hours" => [
      'twig' => "@ucdlib-locations/blocks/hours.twig",
      'transform' => ['getSiteUrl']
    ],
    "ucdlib-locations/map-building" => [
      'twig' => "@ucdlib-locations/blocks/map-building.twig"
    ],
    "ucdlib-locations/map-floors" => [
      'twig' => "@ucdlib-locations/blocks/map-floors.twig",
      "provides_context" => ["map-floors/bottomLayerId" => 'bottomLayerId']
    ],
    "ucdlib-locations/map-floor" => [
      'twig' => "@ucdlib-locations/blocks/map-floor.twig",
      "uses_context" => ["map-floors/bottomLayerId"],
    ],
    "ucdlib-locations/map-floor-layer" => [],
    "ucdlib-locations/map-legend" => [],
    "ucdlib-locations/map-legend-item" => [],
    "ucdlib-locations/map-space-legend" => [],
    "ucdlib-locations/map-space-legend-item" => [],
    "ucdlib-locations/sign-hours" => [
      'twig' => "@ucdlib-locations/blocks/sign-hours.twig",
      'transform' => ['getSiteUrl']
    ],
    "ucdlib-locations/sign-section" => [
      'twig' => "@ucdlib-locations/blocks/sign-section.twig",
      'transform' => ['signSectionStyle']
    ],
    "ucdlib-locations/sign-sections" => [
      'twig' => "@ucdlib-locations/blocks/sign-sections.twig",
    ],
    "ucdlib-locations/sign-text" => [
      'twig' => "@ucdlib-locations/blocks/sign-text.twig",
      'transform' => ['signSectionStyle']
    ],
    "ucdlib-locations/address" => [
      'twig' => "@ucdlib-locations/blocks/address.twig",
      'transform' => ['getAddress']
    ],
    "ucdlib-locations/teasers" => [
      'twig' => "@ucdlib-locations/blocks/teasers.twig",
      'transform' => ['addIcons']
    ],
    "ucdlib-locations/teaser" => [
      'twig' => "@ucdlib-locations/blocks/teaser.twig",
      'transform' => ['getLocation', 'getSiteUrl']
    ]
  ];

  public function __construct($config){
    parent::__construct();
    $this->config = $config;
    $this->slug = $config['slug'];

    add_action('block_categories_all', array($this, 'addCategories'), 10,2);
    add_filter('ucd-theme/customizer/block-colors', array($this, 'addBlockColorsToCustomizer'));
    add_filter('ucd-theme/site/block-settings', array($this, 'filterBlockSettings'));

  }

  public static $transformationClass = 'UCDLibPluginLocationsBlockTransformations';

  public function twigPath($block){
    return '@' . $this->config['slug'] . "/blocks/$block.twig";
  }

  public function addBlockColorsToCustomizer($blocks){
    $blocks[] = [
      'slug' => "$this->slug/map-space-legend-item",
      'label' => 'Floor Map Space Legend Item'
    ];
    return $blocks;
  }

  public function filterBlockSettings($settings){
    $blocksWithColors = ["$this->slug/map-space-legend-item"];
    foreach($blocksWithColors as $block){
      $selectedColors = get_theme_mod('colors_blocks_' . $block, false);
      if (!$selectedColors || !is_array($selectedColors) || !count($selectedColors) ) continue;
      $settings['color--' . $block] = $selectedColors;
    }
    return $settings;
  }

  /**
   * Custom block categories
   */
  public function addCategories($block_categories, $editor_context){
    $customCategories = array(
      array(
        'slug'  => $this->config['slug'],
        'title' => 'Location',
        'icon'  => null,
      ),
      array(
        'slug'  => $this->config['slug'] . '-signs',
        'title' => 'Digital Signs',
        'icon'  => null,
      ),
    );


    return array_merge($block_categories, $customCategories);
  }

}

<?php
require_once( __DIR__ . '/block-transformations.php' );
require_once( get_template_directory() . '/includes/classes/block-renderer.php' );

// Set up server-side rendering for gutenberg location blocks
class UCDLibPluginLocationsBlocks extends UCDThemeBlockRenderer {
  public function __construct($config){
    parent::__construct();
    $this->config = $config;
    $this->slug = $config['slug'];

    $this->registry = [
      "$this->slug/hours-today" => [
        'twig' => $this->twigPath('hours-today'),
        'transform' => ['getCurrentLocationId', 'getSiteUrl']
      ],
      "$this->slug/hours" => [
        'twig' => $this->twigPath('hours'),
        'transform' => ['getSiteUrl']
      ],
      "$this->slug/map-building" => [
        'twig' => $this->twigPath('map-building')
      ],
      "$this->slug/map-floors" => [
        'twig' => $this->twigPath('map-floors'),
        "provides_context" => ["map-floors/bottomLayerId" => 'bottomLayerId']
      ],
      "$this->slug/map-floor" => [
        'twig' => $this->twigPath('map-floor'),
        "uses_context" => ["map-floors/bottomLayerId"],
      ],
      "$this->slug/map-floor-layer" => [],
      "$this->slug/map-legend" => [],
      "$this->slug/map-legend-item" => [],
      "$this->slug/map-space-legend" => [],
      "$this->slug/map-space-legend-item" => [],
      "$this->slug/sign-hours" => [
        'twig' => $this->twigPath('sign-hours'),
        'transform' => ['getSiteUrl']
      ],
      "$this->slug/sign-section" => [
        'twig' => $this->twigPath('sign-section'),
        'transform' => ['signSectionStyle']
      ],
      "$this->slug/sign-sections" => [
        'twig' => $this->twigPath('sign-sections')
      ],
      "$this->slug/sign-text" => [
        'twig' => $this->twigPath('sign-text'),
        'transform' => ['signSectionStyle']
      ],
      "$this->slug/address" => [
        'twig' => $this->twigPath('address'),
        'transform' => ['getAddress']
      ],
      "$this->slug/teasers" => [
        'twig' => $this->twigPath('teasers'),
        'transform' => ['addIcons']
      ],
      "$this->slug/teaser" => [
        'twig' => $this->twigPath('teaser'),
        'transform' => ['getLocation', 'getSiteUrl']
      ]
    ];

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

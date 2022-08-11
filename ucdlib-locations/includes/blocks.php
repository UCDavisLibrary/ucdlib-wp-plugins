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
    
  }

  public static $transformationClass = 'UCDLibPluginLocationsBlockTransformations';

  public function twigPath($block){
    return '@' . $this->config['slug'] . "/blocks/$block.twig";
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
    );
      

    return array_merge($block_categories, $customCategories);
  }

}
<?php
require_once( __DIR__ . '/block-transformations.php' );
require_once( get_template_directory() . '/includes/classes/block-renderer.php' );

// Set up server-side rendering for gutenberg collection blocks
class UCDLibPluginSpecialBlocks extends UCDThemeBlockRenderer {
  public function __construct($config){
    parent::__construct();
    $this->config = $config;
    $this->slug = $config->slug;

    /**
     * list custom blocks here for server-side rendering. e.g.:
     * 
     *  "$this->slug/{{yourBlockSlug}}" => [
     *    'twig' => $this->twigPath({{nameOfTwigFile}}),
     *    'transform' => ['{{method1}}', '{{method2}}']
     *  ]
     */
    $this->registry = [
      "$this->slug/collection" => [
        'twig' => $this->twigPath('collection'),
        // 'transform' => ['getAddress']
      ]
    ];

    add_action('block_categories_all', array($this, 'addCategories'), 10,2);
    
  }

  public static $transformationClass = 'UCDLibPluginSpecialBlockTransformations';

  public function twigPath($block){
    return "@$this->slug/blocks/$block.twig";
  }

  /**
   * Custom block categories
   */
  public function addCategories($block_categories, $editor_context){
    $customCategories = array(
      array(
        'slug'  => $this->config->slug,
        'title' => 'Special Collections',
        'icon'  => null,
      ),
    );

    return array_merge($block_categories, $customCategories);
  }

}
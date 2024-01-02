<?php
require_once( __DIR__ . '/block-transformations.php' );
require_once( get_template_directory() . '/includes/classes/block-renderer.php' );

// Set up server-side rendering for gutenberg collection blocks
class UCDLibPluginSpecialBlocks extends UCDThemeBlockRenderer {

  public $config;
  public $slug;

  public static $registry = [
    "ucdlib-special/collection" => [
      'twig' => "@ucdlib-special/blocks/collection.twig",
    ],
    "ucdlib-special/collection-results" => [
      'twig' => "@ucdlib-special/blocks/collection-results.twig",
      'transform' => ['collectionQueryArgsToAttributes', 'getCollectionFiltResults']
    ],
    "ucdlib-special/exhibit-curators" => [
      'twig' => "@ucdlib-special/blocks/exhibit-curators.twig",
    ],
    "ucdlib-special/exhibit-highlight" => [
      'twig' => "@ucdlib-special/blocks/exhibit-highlight.twig",
      'transform' => ['getExhibit']
    ],
    "ucdlib-special/exhibit-location" => [
      'twig' => "@ucdlib-special/blocks/exhibit-location.twig"
    ],
    "ucdlib-special/exhibit-online" => [
      'twig' => "@ucdlib-special/blocks/exhibit-online.twig",
      'transform' => ['getOnlineExhibits']
    ],
    "ucdlib-special/exhibit-past" => [
      'twig' => "@ucdlib-special/blocks/exhibit-past.twig",
      'transform' => ['getPastExhibits']
    ],
    "ucdlib-special/exhibit-query" => [
      'twig' => "@ucdlib-special/blocks/exhibit-query.twig",
      'transform' => ['hideExhibitExcerpt', 'getExhibits']
    ],
    "ucdlib-special/exhibit-subnav" => [
      'twig' => "@ucdlib-special/blocks/exhibit-subnav.twig",
    ],
  ];

  public function __construct($config){
    parent::__construct();
    $this->config = $config;
    $this->slug = $config->slug;

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

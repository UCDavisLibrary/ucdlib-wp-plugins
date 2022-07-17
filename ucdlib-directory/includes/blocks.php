<?php
require_once( __DIR__ . '/block-transformations.php' );
require_once( get_template_directory() . '/includes/classes/block-renderer.php' );

// Set up server-side rendering for gutenberg directory blocks
class UCDLibPluginDirectoryBlocks extends UCDThemeBlockRenderer {
  public function __construct($config){
    parent::__construct();
    $this->config = $config;

    add_action('block_categories_all', array($this, 'addCategories'), 10,2);
    add_action( 'init', array( $this, 'register_blocks'));
    
  }
  public static $transformationClass = 'UCDLibPluginDirectoryBlockTransformations';
  
  public static $registry = [
    'ucdlib-directory/bio' => [
      'twig' => '@ucdlib-directory/blocks/person-bio.twig'
    ],
    'ucdlib-directory/contact' => [
      'twig' => '@ucdlib-directory/blocks/person-contact.twig'
    ],
    'ucdlib-directory/filters' => [
      'twig' => '@ucdlib-directory/blocks/directory-filters.twig'
    ],
    'ucdlib-directory/name' => [
      'twig' => '@ucdlib-directory/blocks/person-name.twig'
    ],
    'ucdlib-directory/title' => [
      'twig' => '@ucdlib-directory/blocks/person-title.twig'
    ],
    'ucdlib-directory/pronouns' => [
      'twig' => '@ucdlib-directory/blocks/person-pronouns.twig'
    ],
    'ucdlib-directory/results' => [
      'twig' => '@ucdlib-directory/blocks/directory-results.twig',
      'transform' => ['getDirectoryResults']
    ],
    'ucdlib-directory/library-locations' => [
      'twig' => '@ucdlib-directory/blocks/person-library-locations.twig'
    ],
    'ucdlib-directory/tags' => [
      'twig' => '@ucdlib-directory/blocks/person-tags.twig'
    ],
    'ucdlib-directory/expertise-areas' => [
      'twig' => '@ucdlib-directory/blocks/person-expertise-areas.twig'
    ]
  ];

  /**
   * Custom block categories
   */
  public function addCategories($block_categories, $editor_context){
    $customCategories = array(
      array(
        'slug'  => $this->config['slug'],
        'title' => 'Directory',
        'icon'  => null,
      ),
      array(
        'slug'  => $this->config['slug'] . '-person',
        'title' => 'Person Profile',
        'icon'  => null,
      )
    );
      

    return array_merge($block_categories, $customCategories);
  }


}
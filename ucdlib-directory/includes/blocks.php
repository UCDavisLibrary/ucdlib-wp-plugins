<?php
require_once( __DIR__ . '/block-transformations.php' );
require_once( get_template_directory() . '/includes/classes/block-renderer.php' );

// Set up server-side rendering for gutenberg directory blocks
class UCDLibPluginDirectoryBlocks extends UCDThemeBlockRenderer {
  public function __construct($config){
    $this->config = $config;

    add_action('block_categories_all', array($this, 'addCategories'), 10,2);
    add_action( 'init', array( $this, 'register_blocks'));
    
  }
  public static $transformationClass = 'UCDLibPluginDirectoryBlockTransformations';

  public static $registry = [
    'ucdlib-directory/bio' => [
      'twig' => '@ucdlib-directory/blocks/person-bio.twig', 
      'transform' => ['getBio']
    ],
    'ucdlib-directory/contact' => [
      'twig' => '@ucdlib-directory/blocks/person-contact.twig',
      'transform' => ['getContactInfo']
    ],
    'ucdlib-directory/name' => [
      'twig' => '@ucdlib-directory/blocks/person-name.twig'
    ],
    'ucdlib-directory/title' => [
      'twig' => '@ucdlib-directory/blocks/person-title.twig', 
      'transform' => ['getPosition']
    ],
    'ucdlib-directory/pronouns' => [
      'twig' => '@ucdlib-directory/blocks/person-pronouns.twig', 
      'transform' => ['getPronouns']
    ],
    'ucdlib-directory/library-locations' => [
      'twig' => '@ucdlib-directory/blocks/person-library-locations.twig',
      'transform' => ['getLibraries']
    ],
    'ucdlib-directory/tags' => [
      'twig' => '@ucdlib-directory/blocks/person-tags.twig',
      'transform' => ['getDirectoryTags']
    ],
    'ucdlib-directory/expertise-areas' => [
      'twig' => '@ucdlib-directory/blocks/person-expertise-areas.twig',
      'transform' => ['getExpertiseAreas']
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
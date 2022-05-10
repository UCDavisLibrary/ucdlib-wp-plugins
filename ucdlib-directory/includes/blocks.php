<?php
require_once( __DIR__ . '/block-transformations.php' );

// Set up server-side rendering for gutenberg directory blocks
class UCDLibPluginDirectoryBlocks {
  public function __construct($config){
    $this->config = $config;
    $this->iconsUsed = [];

    add_action('block_categories_all', array($this, 'addCategories'), 10,2);
    add_action( 'init', array( $this, 'register_blocks'));
    add_filter( 'ucd-theme/loaded-icons', array($this, 'loadIcons'), 10, 1);
    
  }

  public static $registry = [
    'ucdlib-directory/name' => ['twig' => '@ucdlib-directory/blocks/person-name.twig'],
    'ucdlib-directory/title' => ['twig' => '@ucdlib-directory/blocks/person-title.twig', 'transform' => ['getPosition']]
  ];

  public function loadIcons($icons){
    foreach ($this->iconsUsed as $icon) {
      if ( !array_key_exists($icon, $icons) ) $icons[] = $icon;
    }
    return $icons;
  }

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

  /**
   * Registers serverside rendering callback of all plugin blocks
   */
  public function register_blocks( ) {
    foreach (self::$registry as $name => $block) {
      $settings = array(
        'api_version' => 2, 
        'render_callback' => array($this, 'render_callback')
      );
      if ( array_key_exists('uses_context', $block) ) {
        $settings['uses_context'] = $block['uses_context'];
      }
      if ( array_key_exists('provides_context', $block) ) {
        $settings['provides_context'] = $block['provides_context'];
      };
      register_block_type(
        $name, 
        $settings
      );
    }
  }

  /**
   * Renders designated Twig and applies attribute transformations for a registered block
   *  
   */
  public function render_callback($block_attributes, $content, $block) {

    // Retrieve metadata from registry
    $blockName = $block->name;
    if ( !$blockName ) return;
    $meta = self::$registry[$blockName];

    // Apply any transformations to block attributes specified in registry
    if ( array_key_exists("transform", $meta) ){
      if ( is_array($meta['transform']) ) {
        $transformations = $meta['transform'];
      }
      else {
        $transformations = array($meta['transform']);
      }
      foreach ($transformations as $transformation) {
        $block_attributes = call_user_func("UCDLibPluginDirectoryBlockTransformations::" . $transformation, $block_attributes);
      }
    }

    // check for icons (so we can only load the svgs we actually use)
    if ( 
      array_key_exists('icon', $block_attributes) && 
      !in_array($block_attributes['icon'], $this->iconsUsed)) {
        $this->iconsUsed[] = $block_attributes['icon'];
      }

    // Render twig
    ob_start();
    Timber::render( $meta['twig'], array("attributes" => $block_attributes, "content" => $content, "block" => $block) );
    return ob_get_clean();
  }


}
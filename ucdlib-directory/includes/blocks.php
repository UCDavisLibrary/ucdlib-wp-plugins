<?php

// Set up server-side rendering for gutenberg directory blocks
class UCDLibPluginDirectoryBlocks {
  public function __construct($config){
    $this->config = $config;

    add_action('block_categories_all', array($this, 'addCategories'), 10,2);

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


}
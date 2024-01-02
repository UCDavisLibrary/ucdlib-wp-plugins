<?php

// all config values go here
class UCDLibPluginSpecialConfig {

  public static $config = [
    'slug' => 'ucdlib-special',
    'postTypes' => [
      'exhibit' => 'exhibit',
      'collection' => 'collection'
    ],
    'taxonomies' => [
      'az' => 'collection-az',
      'subject' => 'collection-subject',
      'curator' => 'curator',
      'location' => 'exhibit-location'
    ],
    'capabilities' => [
      'manage_exhibits' => 'manage_exhibits',
      'manage_collections' => 'manage_collections',
      'delete_others_collections' => 'delete_others_collections',
      'delete_collections' => 'delete_collections',
      'delete_private_collections' => 'delete_private_collections',
      'delete_published_collections' => 'delete_published_collections',
      'edit_others_collections' => 'edit_others_collections',
      'edit_collections' => 'edit_collections',
      'edit_private_collections' => 'edit_private_collections',
      'edit_published_collections' => 'edit_published_collections',
      'publish_collections' => 'publish_collections',
      'read_private_collections' => 'read_private_collections'
    ]
  ];

  public $slug;
  public $postTypes;
  public $taxonomies;
  public $capabilities;
  public $entryPoint;
  public $version;

  public function __construct(){
    $this->slug = self::$config['slug'];
    $this->postTypes = self::$config['postTypes'];
    $this->taxonomies = self::$config['taxonomies'];
    $this->capabilities = self::$config['capabilities'];

    $this->entryPoint = plugin_dir_path( __DIR__ ) . $this->slug . '.php';
    // Get version number from entrypoint doc string
    $plugin_metadata = get_file_data( $this->entryPoint, array(
      'Version' => 'Version'
    ) );
    if ( ! empty( $plugin_metadata['Version'] ) ) {
      $this->version = $plugin_metadata['Version'];
    }

  }

}

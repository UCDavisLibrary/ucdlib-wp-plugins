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
    ]
    ];

  public function __construct(){
    $this->slug = self::$config['slug'];
    $this->postTypes = self::$config['postTypes'];
    $this->taxonomies = self::$config['taxonomies'];

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
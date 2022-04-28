<?php
require_once( __DIR__ . '/acf.php' );
require_once( __DIR__ . '/elasticsearch.php' );

class UCDLibPluginSearch {
  public function __construct(){
    $this->slug = "ucdlib-search";
    $config = $this->getConfig();

    add_filter( 'timber/locations', array($this, 'add_timber_locations') );

    // Options menu + other custom field stuff
    $this->acf = new UCDLibPluginSearchACF( $config );

    // Wire up elasticsearch
    $this->elasticsearch = new UCDLibPluginSearchElasticsearch( $config );

  }

  public function getConfig(){
    $config = $this->getBaseConfig();
    $config['elasticsearch'] = $this->getElasticsearchConfig();
    return $config;
  }

  public function getBaseConfig(){
    $config = array(
      'slug' => $this->slug,
      'entryPoint' => plugin_dir_path( __DIR__ ) . $this->slug . '.php',
      'version' => false
    );

    // Get version number from entrypoint doc string
    $plugin_metadata = get_file_data( $config['entryPoint'], array(
      'Version' => 'Version'
    ) );
    if ( ! empty( $plugin_metadata['Version'] ) ) {
      $config['version'] = $plugin_metadata['Version'];
    }

    return $config;
  }

  public function getElasticsearchConfig(){
    return [
      "host" => getenv('ELASTIC_SEARCH_HOST') ? getenv('ELASTIC_SEARCH_HOST') : 'elasticsearch',
      "port" => getenv('ELASTIC_SEARCH_PORT') ? getenv('ELASTIC_SEARCH_PORT') : '9200',
      "username" => getenv('ELASTIC_SEARCH_USERNAME') ? getenv('ELASTIC_SEARCH_USERNAME') : 'elastic',
      "password" => getenv('ELASTIC_SEARCH_PASSWORD') ? getenv('ELASTIC_SEARCH_PASSWORD') : 'changeme',
      "requestTimeout" => getenv('ELASTIC_SEARCH_REQUEST_TIME') ? getenv('ELASTIC_SEARCH_REQUEST_TIME') : 3*60*1000,
      "indexAlias" => 'main-website',
      "fields" => [
        "exclude" => ['_'],
      ]
    ];
  }

  /**
   * Adds twig files under the @ucdlib-search namespace
   */
  public function add_timber_locations($paths){
    $paths[$this->slug] = array(WP_PLUGIN_DIR . "/" . $this->slug . '/views');
    return $paths;
  }

}
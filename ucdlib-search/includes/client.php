<?php

require_once( __DIR__ . '/config.php' );

class UCDLibPluginSearchClient {
  public function __construct( $config=false ){
    if ( !$config ) {
      $config = new UCDLibPluginSearchConfig();
    } 
    $this->config = $config;

    $this->client = $this->createClient();
  }

  /**
   * Make the elasticsearch client, which is loaded with all other php dependencies via composer by the theme.
   */
  public function createClient(){
    $c = $this->config->elasticsearch;
    $host = 'http://' . $c['username'] . ':' . $c['password'] . '@' . $c['host'] . ':' . $c['port'];
    return Elasticsearch\ClientBuilder::create()->setHosts([$host])->build();
  }

  public function search( $body ){
    $params = [
      'index' => $this->config->elasticsearch['indexAlias'],
      'body' => $body
    ];
    $response = $this->client->search($params);
    return $response;
  }
}
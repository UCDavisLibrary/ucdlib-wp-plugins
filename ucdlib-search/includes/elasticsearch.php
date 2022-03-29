<?php

class UCDLibPluginSearchElasticsearch {
  public function __construct( $config, $doHooks=true ){
    $this->config = $config;
    $this->client = $this->createClient();

    if ( $doHooks ){
      add_action( 'pre_get_posts', array($this, 'interceptWpSearch') );
      add_filter( 'ucd-theme/context/search', array($this, 'setContext') );
      add_filter( 'ucd-theme/templates/search', array($this, 'setTemplate'), 10, 2 );
    }


  }

  public function createClient(){
    $c = $this->config['elasticsearch'];
    $host = 'http://' . $c['username'] . ':' . $c['password'] . '@' . $c['host'] . ':' . $c['port'];
    return Elasticsearch\ClientBuilder::create()->setHosts([$host])->build();
  }

  public function interceptWpSearch( $query ){
    if ( ! is_admin() && $query->is_main_query() && is_search() ) {
      
      // stop wp from throwing a 404 when page number is beyond what is in mysql
      $query->set( 'posts_per_page', 1 );
      $query->set( 'paged', 1);
    }
  }

  public function setContext($context){
    try {
      $results = $this->doMainSearch();
    } catch (\Throwable $th) {
      if ( WP_DEBUG === true ) {
        throw $th;
      } else {
        $context['error_in_search'] = true;
      }
      return $context;
    }
    
    $context['results'] = $results;
    $context['found_posts'] = $results['hits']['total']['value'];
    return $context;
  }

  public function setTemplate( $templates, $context ){
    $templates = array_merge( array("@" . $this->config['slug'] . "/search.twig"), $templates );

    return $templates;
  }

  public function doMainSearch(){
    $s = get_search_query();
    $params = [
      'index' => $this->config['elasticsearch']['indexAlias'],
      'body'  => [
          'query' => [
              'match' => [
                  'content' => $s
              ]
          ]
      ]
    ];
    $response = $this->client->search($params);
  
  return $response;
  }
}
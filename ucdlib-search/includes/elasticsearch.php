<?php

require_once( __DIR__ . '/document.php' );

/**
 * Class for hijacking the main wp search, and returning results from elasticsearch.
 */
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

      // save original search status for ES query
      $this->currentPage = get_query_var('paged') ? get_query_var('paged') : 1;
      $this->pageSize = get_option('posts_per_page');
      $this->searchQuery = get_search_query();
      
      // stop wp from throwing a 404 when no posts are returned
      $query->set( 'posts_per_page', 1 );
      $query->set( 'paged', 1);
      $query->set( 's', '' );
    }
  }

  public function setContext($context){
    $context['currentPage'] = $this->currentPage;
    $context['pageSize'] = $this->pageSize;
    $context['search_query'] = $this->searchQuery;
    $context['title'] = 'Search results for ' . $this->searchQuery;
    try {
      $results = $this->doMainSearch();
      $context['results'] = array_map(function($x){return new UCDLibPluginSearchDocument($x);}, $results['hits']['hits']);
      $context['found_posts'] = $results['hits']['total']['value'];
      $context['hasPages'] = $context['found_posts'] > $context['pageSize'];
      $context['lastPage'] = ceil($context['found_posts'] / $this->pageSize);
      $context['is404'] =  $context['hasPages'] && $this->currentPage > $context['lastPage'];
      if ( $context['hasPages'] ){
        global $wp;  
        $current_url = home_url(add_query_arg(array($_GET), $wp->request));
        $current_url = preg_replace( '/page\/\d+/', '', $current_url );
        $current_url = parse_url($current_url);
        $context['paginationUrl'] =  $current_url;
      }
      return $context;

    } catch (\Throwable $th) {
      if ( WP_DEBUG === true ) {
        throw $th;
      } else {
        $context['error_in_search'] = true;
      }
      return $context;
    }

  }

  public function setTemplate( $templates, $context ){
    if ( array_key_exists('is404', $context) && $context['is404']){
      status_header(404);
      $views = $GLOBALS['UcdSite']->views;
      $templates = array( $views->getTemplate('404') );
    } else {
      $templates = array_merge( array("@" . $this->config['slug'] . "/search.twig"), $templates );
    }

    return $templates;
  }

  public function doMainSearch(){
    $params = [
      'index' => $this->config['elasticsearch']['indexAlias'],
      'body'  => [
        'size' => $this->pageSize,
        'from' => ($this->currentPage - 1) * $this->pageSize,
        'query' => [
          'multi_match' => [
            'query' => $this->searchQuery,
            'fields' => ['content', 'title^3']
          ]
        ]
      ]
    ];
    $response = $this->client->search($params);
  
  return $response;
  }
}
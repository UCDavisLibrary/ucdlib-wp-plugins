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
      add_action( 'template_redirect', array($this, 'resetWpSearch') );
    }
  }

  /**
   * Make the elasticsearch client, which is loaded with all other php dependencies via composer by the theme.
   */
  public function createClient(){
    $c = $this->config->elasticsearch;
    $host = 'http://' . $c['username'] . ':' . $c['password'] . '@' . $c['host'] . ':' . $c['port'];
    return Elasticsearch\ClientBuilder::create()->setHosts([$host])->build();
  }

  /**
   * Runs right before main wp query is performed.
   * Very unwise to stop the query alltogether, so this method:
   *  1) simplifies it to reduce data transfer
   *  2) tricks wp to never throw a 404 based on the results of the query
   */
  public function interceptWpSearch( $query ){
    if ( ! is_admin() && $query->is_main_query() && is_search() ) {

      // save original search status for ES query
      $this->currentPage = get_query_var('paged') ? get_query_var('paged') : 1;
      $this->pageSize = get_option('posts_per_page');
      $this->searchQuery = get_search_query();
      $this->authorsQuery = get_query_var('authors');
      $this->authors = [];
      if ( $this->authorsQuery ) {
        $this->authors = array_map(function($a){
          $a = trim($a);
          if ( strpos($a, '@') === false ) {
            $a = $a . '@ucdavis.edu';
          }
          return $a;}, 
          explode(',', $this->authorsQuery ));
      }
      
      // stop wp from throwing a 404 when no posts are returned
      $query->set( 'posts_per_page', 1 );
      $query->set( 'paged', 1);
      $query->set( 's', '' );
      $query->set( 'author', '' );
    }
  }

  /**
   * Is run after the main wp query is done.
   * Cleans up any unintended side effects of hijacking the main query object
   */
  public function resetWpSearch(){
    global $wp_query;
    if ( ! is_admin() && $wp_query->is_main_query() && is_search() ) {
      
      // some things are derived from the search query, such as the title tag
      $wp_query->set('s', $this->searchQuery);
    }
  }

  /**
   * Get facets with 'isSelected' property
   */
  protected $typeFacets;
  public function typeFacets(){
    if ( ! empty( $this->typeFacets ) ) {
      return $this->typeFacets;
    }
    $v = explode(",", get_query_var('type', ''));
    $facets = [];
    foreach ($this->config->facets as $f) {
      $f['isSelected'] = array_key_exists('urlArg', $f) && in_array(strtolower($f['urlArg']), $v );
      $facets[] = $f;
    }
    
    $this->typeFacets = $facets;
    return $this->typeFacets;
  }

  protected $sortOptions;
  public function sortOptions(){
    if ( !empty( $this->sortOptions ) ){
      return $this->sortOptions;
    }
    $v = strtolower(get_query_var('sortby', ''));
    $hasSort = in_array( $v, array_map(function($o){return $o['urlArg'];}, $this->config->sortOptions) );
    $options = [];
    foreach ($this->config->sortOptions as $o) {
      if ( $hasSort ) {
        $o['isSelected'] = $o['urlArg'] === $v;
      } else {
        $o['isSelected'] = $o['default'];

      }
      $options[] = $o;
    }
    $this->sortOptions = $options;
    return $this->sortOptions;
  }

  /**
   * Runs right before the twig template is rendered.
   * Any data (search results) that needs to be rendered is added to the context here
   */
  public function setContext($context){
    $context['currentPage'] = $this->currentPage;
    $context['pageSize'] = $this->pageSize;
    $context['search_query'] = $this->searchQuery;
    $context['authors'] = $this->authors;
    $context['authorsQuery'] = $this->authorsQuery;
    $context['title'] = 'Search Our Website';
    $context['typeFacets'] = $this->typeFacets();
    $context['sortOptions'] = $this->sortOptions();
    try {
      $results = $this->doMainSearch();
      $context['results'] = array_map(function($x){return new UCDLibPluginSearchDocument($x, $this->config);}, $results['hits']['hits']);
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

      // filter suggest
      $suggest = ['score' => 0, 'highlighted' => '', 'text' => ''];
      if ( array_key_exists('suggest', $results )) {
        foreach ($results['suggest'] as $key => $value) {
          foreach($value as $item) {
            foreach($item['options'] as $option) {
              if( $option['score'] > $suggest['score'] ) {
                $suggest = $option;
              }
            }
          }
        }
      }
      $context['suggest'] = $suggest;
      // TODO: make threshhold a plugin setting
      if ( array_key_exists('score', $suggest) && $suggest['score'] > 0.001 ){
        $context['hasSuggestion'] = true;
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

  /**
   * Uses the custom search twig template in this plugin rather than the default theme template
   */
  public function setTemplate( $templates, $context ){
    if ( array_key_exists('is404', $context) && $context['is404']){
      status_header(404);
      $views = $GLOBALS['UcdSite']->views;
      $templates = array( $views->getTemplate('404') );
    } else {
      $templates = array_merge( array("@" . $this->config->slug . "/search.twig"), $templates );
    }

    return $templates;
  }

  /**
   * Using values from the main wp query, search elasticsearch for matching documents
   */
  public function doMainSearch(){
    $params = [
      'index' => $this->config->elasticsearch['indexAlias'],
      'body'  => [
        'size' => $this->pageSize,
        'from' => ($this->currentPage - 1) * $this->pageSize,
        'query' => [
          'bool' => [
            'must' => []
          ]
        ]
      ]
    ];

    // add keyword search
    if ( $this->searchQuery ){
      $params['body']['query']['bool']['must']['multi_match'] = [
        'query' => $this->searchQuery,
        'fields' => ['content', 'description', 'title^3', 'altTitles^3', 'tags.text^2']
      ];

      $params['body']['highlight'] = [
        'order' => 'score',
        'fields' => [
          '*' => new stdClass()
        ]
      ];

      $params['body']['suggest'] = [
        'text' => $this->searchQuery,
        'title_phrase' => [
          'phrase' => [
            'field' => 'title.trigram',
            'size' => 1,
            'gram_size' => 3,
            'direct_generator' => [ [
              'field' => 'title.trigram',
              'suggest_mode' => 'always'
            ], [
              "field" => "title.reverse",
              "suggest_mode" => "always",
              "pre_filter" => "reverse",
              "post_filter" => "reverse"
            ] ],
            'highlight' => [
              "pre_tag" => "<em>",
              "post_tag" => "</em>"
            ]
          ]
        ],
        'description_phrase' => [
          'phrase' => [
            'field' => 'description.trigram',
            'size' => 1,
            'gram_size' => 3,
            'direct_generator' => [ [
              'field' => 'description.trigram',
              'suggest_mode' => 'always'
            ], [
              "field" => "description.reverse",
              "suggest_mode" => "always",
              "pre_filter" => "reverse",
              "post_filter" => "reverse"
            ] ],
            'highlight' => [
              "pre_tag" => "<em>",
              "post_tag" => "</em>"
            ]
          ]
        ],
        'content_phrase' => [
          'phrase' => [
            'field' => 'content.trigram',
            'size' => 1,
            'gram_size' => 3,
            'direct_generator' => [ [
              'field' => 'content.trigram',
              'suggest_mode' => 'always'
            ], [
              "field" => "content.reverse",
              "suggest_mode" => "always",
              "pre_filter" => "reverse",
              "post_filter" => "reverse"
            ] ],
            'highlight' => [
              "pre_tag" => "<em>",
              "post_tag" => "</em>"
            ]
          ]
        ]
      ];
    }

    // add filter context
    $documentTypes = [];
    $documentSubTypes = [];
    $documentTypeFilter = [];
    $authorFilter = [];

    // type/subtype facets
    $facets = array_filter($this->typeFacets(), function($f){return $f['isSelected'];});
    if ( count($facets) ){
      foreach ($facets as $facet) {

        // use subtype instead of type
        if ( array_key_exists('documentSubType', $facet) ){
          foreach ($facet['documentSubType'] as $termField => $t) {
            if ( !array_key_exists($termField, $documentSubTypes) ) {
              $documentSubTypes[$termField] = [];
            }
            foreach ($t as $tt) {
              $documentSubTypes[$termField][] = $tt;
            }
          }
          continue;
        }

        foreach ($facet['documentType'] as $dt) {
          $documentTypes[] = $dt;
        }
      }
    }
    if ( count($documentTypes) || count($documentSubTypes) ){
      $documentTypeFilter = ['bool' => ['should' => []]];
      if ( count($documentTypes) ) {
        $documentTypeFilter['bool']['should'][] = ['terms' => ['type' => $documentTypes]];
      }
      
      if ( count($documentSubTypes) ){
        foreach ($documentSubTypes as $termField => $t) {
          $documentTypeFilter['bool']['should'][] = ['terms' => [$termField => $t] ];
        }
      }
    }

    // check for author filters
    if ( count($this->authors) ){
      $authorFilter = ['terms' => ['authors' => []]];
      foreach ($this->authors as $author) {
        $authorFilter['terms']['authors'][] = $author;
      }
    }

    // put together filter context
    if ( 
      count( $documentTypeFilter) || 
      count( $authorFilter )
      ){
      $filterContext = ['bool' => ['must' => []]];
      if ( count($documentTypeFilter) ) {
        $filterContext['bool']['must'][] = $documentTypeFilter;
      }
      if ( count( $authorFilter ) ){
        $filterContext['bool']['must'][] = $authorFilter;
        $filterContext['bool']['must'][] = ['term' => ['ucd_hide_author' => false]];
      }
      $params['body']['query']['bool']['filter'] = $filterContext;
      //echo '<pre>' . var_dump($filterContext) . '</pre>';
    }

    // add sort
    $sort = array_filter($this->sortOptions(), function($f){return $f['isSelected'];});
    $i = array_key_first($sort);
    if ( $i && $sort[$i]['es']){
      $params['body']['sort'] = [$sort[$i]['es']];
    }

    $response = $this->client->search($params);
  
  return $response;
  }
}
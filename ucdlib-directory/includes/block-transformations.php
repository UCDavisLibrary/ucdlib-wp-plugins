<?php
require_once( __DIR__ . '/utils.php' );

// Contains methods that transform the attributes of a block (mostly fetching additional data)
// See 'transform' property in $registry array in blocks class.
class UCDLibPluginDirectoryBlockTransformations {

  public static function getDirectoryUrl( $attrs ){
    $transient = 'directory_page_link';
    if ( false === ( $link = get_transient( $transient ) ) ) {
      $slug = 'ucdlib-directory';
      $p = get_field('directory_page', $slug);
      if ( $p ) {
        $p = Timber::get_post($p);
        if ( $p ) {
          $link = $p->link();
        }
      }
      set_transient( $transient, $link, 24 * HOUR_IN_SECONDS );
    }
    $attrs['directory_page_link'] = $link;
    return $attrs;
  }

  public static function getServiceResults( $attrs=[] ){
    $serviceQuery = [
      'post_type' => 'service',
      'orderby' => 'menu_order title',
      'order' => 'ASC',
      'posts_per_page' => -1
    ];
    $tax_query = [];

    // keyword search
    $kwQueryVar = UCDLibPluginDirectoryUtils::explodeQueryVar('q', false, ' ');
    if ( count( $kwQueryVar ) ) $serviceQuery['s'] = implode(' ', $kwQueryVar);

    // filter by library location
    $libQueryVar = UCDLibPluginDirectoryUtils::explodeQueryVar('library');
    if ( count($libQueryVar) ){
      $tax_query[] = [
        'taxonomy' => 'library',
        'field' => 'term_id',
        'terms' => $libQueryVar,
        'operator' => 'IN'
      ];
    }

    // filter by service type
    $serviceTypeQueryVar = UCDLibPluginDirectoryUtils::explodeQueryVar('service-type');
    if ( count($serviceTypeQueryVar) ){
      $tax_query[] = [
        'taxonomy' => 'service-type',
        'field' => 'term_id',
        'terms' => $serviceTypeQueryVar,
        'operator' => 'IN'
      ];
    }

    if ( count($tax_query) ){
      $serviceQuery['tax_query'] = $tax_query;
    }

    $serviceTypesWithServices = [];
    $services = Timber::get_posts($serviceQuery);
    foreach ($services as $service) {
      $terms = $service->terms('service-type');
      if ( !$terms || !count($terms) ) continue;
      foreach ($terms as $term) {
        if ( !array_key_exists($term->ID, $serviceTypesWithServices)) {
          $serviceTypesWithServices[$term->ID] = ['term' => $term, 'services' => []];
        }
        $serviceTypesWithServices[$term->ID]['services'][] = $service;
      }
    }
    usort($serviceTypesWithServices, function($a, $b){
      $a_mo = $a['term']->meta('menu_order') || 0;
      $b_mo = $b['term']->meta('menu_order') || 0;
      if ( $a_mo == $b_mo ) {
        return strcmp($a['term']->name, $b['term']->name);
      }
      return ($a_mo < $b_mo) ? -1 : 1;
    });
    $attrs['serviceTypes'] = $serviceTypesWithServices;
    return $attrs;

  }

  public static function setElasticSearch($attrs){
    if ( !get_field('directory_query_es', 'ucdlib-directory') ) return $attrs;
    $activePlugins = get_option( 'active_plugins', array() );
    if ( !in_array( 'ucdlib-search/ucdlib-search.php', $activePlugins, true ) ) return $attrs;

    $attrs['elasticSearch'] = true;
    return $attrs;
  }

  public static function getEsResults($attrs){
    if ( !array_key_exists('elasticSearch', $attrs) ||  !$attrs['elasticSearch'] ) return $attrs;

    // construct es query
    require_once( WP_PLUGIN_DIR. '/ucdlib-search/includes/client.php' );
    $client = new UCDLibPluginSearchClient();
    $query = [
      'size' => 1000,
      'fields' => ['id'],
      '_source' => false,
      'query' => [
        'bool' => [
          'must' => [],
        ]
      ]
    ];
    $filterContext = [
      'bool' => [
        'must' => [
          ['term' => ['type' => 'person']]
        ]
      ]
    ];

    if ( $attrs['qRaw'] ){
      $query['query']['bool']['must']['multi_match'] = [
        'query' =>  $attrs['qRaw'],
        'fields' => ['content', 'positionTitle', 'title^5', 'areasOfExperise.text']
      ];
    }

    if ( count($attrs['department']) ){
      $filterContext['bool']['must'][] = ['bool' => ['should' => [['terms' => ['departmentIds' => $attrs['department']]]]]];
    }

    if ( count($attrs['library']) ){
      $filterContext['bool']['must'][] = ['bool' => ['should' => [['terms' => ['libraryIds' => $attrs['library']]]]]];
    }

    if ( count($attrs['directoryTag']) ){
      $filterContext['bool']['must'][] = ['bool' => ['should' => [['terms' => ['directoryTagIds' => $attrs['directoryTag']]]]]];
    }

    $query['query']['bool']['filter'] = $filterContext;
    $results = $client->search( $query );

    // display params
    $hideDepartments = array_key_exists('hideDepartments', $attrs) && $attrs['hideDepartments'] != 'false';
    $orderby = $attrs['orderby'] == 'name' ? 'name' : 'department';
    if ( $results['hits']['total']['value'] == 0 ) return $attrs;

    // get timber people objects
    $personQuery = [
      'ignore_sticky_posts' => true,
      'posts_per_page' => -1,
      'post__in' => array_map(function($x){return $x['_id'];}, $results['hits']['hits']),
      'post_type' => 'person',
      'meta_key' => 'name_last',
      'orderby' => $orderby == 'department' ? 'menu_order meta_value' : 'meta_value',
      'order' => 'ASC'
    ];
    $people = Timber::get_posts($personQuery);

    if ( $hideDepartments ){
      $attrs['people'] = $people;
    } else if ( $orderby == 'name' ) {
      $attrs['people'] = $people;
    } else {
      $attrs['departments'] = self::assignPeopleToDepartments($people);
    }
    

    return $attrs;
  }

  // converts directory url query args to attributes
  public static function queryArgsToAttributes($attrs){
    $attrs['orderby'] = get_query_var('orderby', '');
    $attrs['qRaw'] = get_query_var('q', ''); 
    $attrs['q'] = UCDLibPluginDirectoryUtils::explodeQueryVar('q', false, ' ');
    $attrs['library'] = UCDLibPluginDirectoryUtils::explodeQueryVar('library');
    $attrs['department'] = UCDLibPluginDirectoryUtils::explodeQueryVar('department');
    $attrs['directoryTag'] = UCDLibPluginDirectoryUtils::explodeQueryVar('directory-tag');
    return $attrs;
  }

  public static function setDefaultQueryAttributes( $attrs ){
    if ( !array_key_exists('orderby', $attrs) ) $attrs['orderby'] = 'department';
    $vars = ['q', 'library', 'department', 'directoryTag'];
    foreach ($vars as $var) {
      if ( !array_key_exists($var, $attrs) ) $attrs[$var] = [];
    }
    
    return $attrs;
  }

  /**
   * Gets people/departments based on url query parameters
   * using normal mysql-powered query
   */
  public static function getDirectoryResults( $attrs=[] ){
    if ( array_key_exists('elasticSearch', $attrs) && $attrs['elasticSearch'] ) return $attrs;
    $personQuery = [
      'post_type' => 'person',
      'meta_key' => 'name_last',
      'order' => 'ASC',
      'posts_per_page' => -1
    ];
    $tax_query = [];
    $expertiseAreas = [];
    $hideDepartments = array_key_exists('hideDepartments', $attrs) && $attrs['hideDepartments'] != 'false';
    $meta_query = [
      [
        'relation' => 'OR',
        [
          'key' => 'pastEmployee',
          'compare' => 'NOT EXISTS'
        ],
        [
          'key' => 'pastEmployee',
          'value' => false,
          'compare' => '=',
          'type' => 'BINARY'
        ],
      ]
    ];

    // set order of results
    $orderby = $attrs['orderby'] == 'name' ? 'name' : 'department';
    if ( $orderby == 'department' ){
      $personQuery['orderby'] = 'menu_order meta_value';
    } else {
      $personQuery['orderby'] = 'meta_value';
    }

    // keyword search. needs to search both name and areas of expertise taxonomy
    $kwQueryVar =  array_filter($attrs['q'], function($x){return $x;});
    if ( count( $kwQueryVar ) ){
      $nameQuery = [
        'relation' => 'OR'
      ];
      foreach ($kwQueryVar as $name) {
        $nameQuery[] = [
          'key' => 'name_last',
          'value' => $name,
          'compare' => 'LIKE',
        ];
        $nameQuery[] = [
          'key' => 'name_first',
          'value' => $name,
          'compare' => 'LIKE',
        ];
      }
      $meta_query[] = $nameQuery;
      //$personQuery['s'] = implode(' ', $kwQueryVar);
    }

    // filter by library location
    $libQueryVar = $attrs['library'];
    if ( count($libQueryVar) ){
      $tax_query[] = [
        'taxonomy' => 'library',
        'field' => 'term_id',
        'terms' => $libQueryVar,
        'operator' => 'IN'
      ];
    }

    // filter by department
    $deptQueryVar = $attrs['department'];
    if ( count($deptQueryVar) ){
      $meta_query[] = [
        'key' => 'position_dept',
        'value' => $deptQueryVar,
        'compare' => 'IN',
        'type' => 'NUMERIC'
      ];
    }

    // filter by directory tag/subject area
    $tagQueryVar = $attrs['directoryTag'];
    if ( count($tagQueryVar) ){
      $tax_query[] = [
        'taxonomy' => 'directory-tag',
        'field' => 'term_id',
        'terms' => $tagQueryVar,
        'operator' => 'IN'
      ];
    }

    // add any taxonomies to person query
    if ( count($tax_query) ){
      if ( count($tax_query) > 1){
        $tax_query['relation'] = 'AND';
      }
      $personQuery['tax_query'] = $tax_query;
    }

    if ( count($meta_query) ){
      $meta_query['relation'] = 'AND';
      $personQuery['meta_query'] = $meta_query;
    }
    $people = Timber::get_posts($personQuery);

    if ( $hideDepartments ){
      $attrs['people'] = $people;
    } else if ( $orderby == 'name' ) {
      $attrs['people'] = $people;
    } else {
      $attrs['departments'] = self::assignPeopleToDepartments($people);
    }
    return $attrs;
  }

  public static function assignPeopleToDepartments($people){
    $deptQuery = [
      'post_type' => 'department',
      'order' => 'ASC',
      'orderby' => 'title',
      'posts_per_page' => -1
    ];
    $departments = Timber::get_posts($deptQuery);

    $deptWithPeople = [];
    foreach ($departments as $dept) {
      $deptWithPeople[$dept->ID] = ['post' => $dept, 'people' => []];
    }
    foreach ($people as $person) {
      $deptId = $person->departmentId();
      if ( $deptId && array_key_exists($deptId, $deptWithPeople)){
        $deptWithPeople[$deptId]['people'][] = $person;
      }
    }

    return $deptWithPeople;

  }

  public static function widgetIcons( $attrs ){
    $attrs['icons'] = [
      'ucd-public:fa-calendar-check',
      'ucd-public:fa-newspaper',
      'ucd-public:fa-image',
      'ucd-public:fa-book-atlas',
      'ucd-public:fa-info'
    ];
    return $attrs;
  }
}
?>
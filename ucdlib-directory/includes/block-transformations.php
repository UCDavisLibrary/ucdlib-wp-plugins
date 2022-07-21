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
      return strcmp($a['term']->name, $b['term']->name);
    });
    $attrs['serviceTypes'] = $serviceTypesWithServices;
    return $attrs;

  }

  // converts directory url query args to attributes
  public static function queryArgsToAttributes($attrs){
    $attrs['orderby'] = get_query_var('orderby', '');
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
   */
  public static function getDirectoryResults( $attrs=[] ){
    $personQuery = [
      'post_type' => 'person',
      'meta_key' => 'name_last',
      'order' => 'ASC',
      'posts_per_page' => -1
    ];
    $tax_query = [];
    $expertiseAreas = [];
    $hideDepartments = array_key_exists('hideDepartments', $attrs) && $attrs['hideDepartments'] != 'false';

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
      $personQuery['s'] = implode(' ', $kwQueryVar);

      foreach ($kwQueryVar as $kw) {
        $terms = get_terms([
          'taxonomy' => 'expertise-areas',
          'fields' => 'ids',
          'search' => $kw,
          'hide_empty' => true
        ]);
        foreach ($terms as $term) {
          if ( !in_array($term, $expertiseAreas) ) $expertiseAreas[] = $term;
        }
      }

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
      $personQuery['meta_query'] = [[
        'key' => 'position_dept',
        'value' => $deptQueryVar,
        'compare' => 'IN',
        'type' => 'NUMERIC'
      ]];
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
    $people = Timber::get_posts($personQuery);

    // keyword search returned expertise areas
    // perform new peopel search and merge results with those already performed
    if ( count($expertiseAreas) ){
      $tax_query[] = [
        'taxonomy' => 'expertise-areas',
        'field' => 'term_id',
        'terms' => $expertiseAreas,
        'operator' => 'IN'
      ];
      if ( count($tax_query) > 1){
        $tax_query['relation'] = 'AND';
      }
      $personQuery['tax_query'] = $tax_query;
      unset($personQuery['s']);
      $peopleWithExpertiseArea = Timber::get_posts($personQuery);
      
      if ( count($peopleWithExpertiseArea) ) {
        $combined = [];
        foreach ($people as $person) {
          $combined[] = $person;
        }
        foreach ($peopleWithExpertiseArea as $person) {
          $combined[] = $person;
        }
        $people = $combined;
        if ( $orderby == 'department' ) {
          usort($people, function($a, $b){
            if ( $a->menu_order == $b->menu_order ) {
              return strcmp($a->name_last(), $b->name_last());
            }
            return ($a->menu_order < $b->menu_order) ? -1 : 1;
          });
        } else {
          usort($people, function($a, $b){
            return strcmp($a->name_last(), $b->name_last());
          });
        }
      }
    }
    if ( $hideDepartments ){
      $attrs['people'] = $people;
    } else if ( $orderby == 'name' ) {
      $attrs['people'] = $people;
    } else {
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
      $attrs['departments'] = $deptWithPeople;

    }
    return $attrs;
  }
}
?>
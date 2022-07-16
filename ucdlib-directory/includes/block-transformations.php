<?php
require_once( __DIR__ . '/utils.php' );

// Contains methods that transform the attributes of a block (mostly fetching additional data)
// See 'transform' property in $registry array in blocks class.
class UCDLibPluginDirectoryBlockTransformations {

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

    // set order of results
    $orderby = get_query_var('orderby') == 'name' ? 'name' : 'department';
    if ( $orderby == 'department' ){
      $personQuery['orderby'] = 'menu_order meta_value';
    } else {
      $personQuery['orderby'] = 'meta_value';
    }

    // keyword search. needs to search both name and areas of expertise taxonomy
    $kwQueryVar = UCDLibPluginDirectoryUtils::explodeQueryVar('q', false, ' ');
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
    $libQueryVar = UCDLibPluginDirectoryUtils::explodeQueryVar('library');
    if ( count($libQueryVar) ){
      $tax_query[] = [
        'taxonomy' => 'library',
        'field' => 'term_id',
        'terms' => $libQueryVar,
        'operator' => 'IN'
      ];
    }

    // filter by department
    $deptQueryVar = UCDLibPluginDirectoryUtils::explodeQueryVar('department');
    if ( count($deptQueryVar) ){
      $personQuery['meta_query'] = [
        'key' => 'position_dept',
        'value' => $deptQueryVar,
        'compare' => 'IN',
        'type' => 'NUMERIC'
      ];
    }

    // filter by directory tag/subject area
    $tagQueryVar = UCDLibPluginDirectoryUtils::explodeQueryVar('directory-tag');
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
      
      if ( count($peopleWithExpertiseArea) )
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


    if ( $orderby == 'name' ) {
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
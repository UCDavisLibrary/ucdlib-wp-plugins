<?php

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
    $orderby = get_query_var('orderby') == 'name' ? 'name' : 'department';

    if ( $orderby == 'department' ){
      $personQuery['orderby'] = 'menu_order meta_value';
    } else {
      $personQuery['orderby'] = 'meta_value';
    }
    $people = Timber::get_posts($personQuery);


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
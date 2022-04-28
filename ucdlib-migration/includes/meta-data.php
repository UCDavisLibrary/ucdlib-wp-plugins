<?php

class UCDLibPluginMigrationMetaData {

  function __construct( $config ){

    $this->config = $config;
    $this->statusSlug = 'migration_status';
    $this->statuses= [
      '' => ['color' => 'grey', 'label' => 'Not Set', 'slug' => ''],
      'stub' => ['color' => '#c10230', 'label' => 'Page Stub', 'slug' => 'stub'],
      'content-build' => ['color' => '#ffbf00', 'label' => 'In Progress', 'slug' => 'content-build'],
      'go-live-ready' => ['color' => '#00524c', 'label' => 'Ready', 'slug' => 'go-live-ready']
    ];

    // Register metadata fields handled by gutenberg
    add_action('init', array($this, 'register_post_meta'));

    // Add migration status to admin posts table
    add_filter('manage_page_posts_columns', array($this, 'add_page_column'));
    add_filter('manage_edit-page_sortable_columns', array($this, 'make_page_column_sortable'));
    add_action('manage_page_posts_custom_column', array($this, 'add_page_column_content'), 10, 2);
    add_action('pre_get_posts', array($this, 'sort_by_status'));
  }

  function register_post_meta(){

    register_post_meta( '', $this->statusSlug, array(
      'show_in_rest' => true,
      'single' => true,
      'type' => 'string',
      'default' => ''
    ) );
  }

  function add_page_column($columns){
    return array_merge($columns, [$this->statusSlug => __('Migration Status', 'textdomain')]);
  }
  
  function make_page_column_sortable($columns){
    $columns[$this->statusSlug] = $this->statusSlug;
    return $columns;
  }

  function sort_by_status($query){
    if (!is_admin()) {
      return;
    }

    $orderby = $query->get('orderby');
    if ($orderby == $this->statusSlug) {
        $query->set('meta_key', $this->statusSlug);
        $query->set('orderby', 'meta_value');
    }
  }

  function add_page_column_content($column_key, $post_id){
    if ( $column_key == $this->statusSlug ) {
      $v = get_post_meta($post_id, $this->statusSlug, true);
      if ( array_key_exists($v, $this->statuses) ){
        $status = $this->statuses[$v];
        $color = $status['color'];
        $label = $status['label'];
        echo "<span style='color:$color;'>$label</span>";
      }
    }
  }

}

?>
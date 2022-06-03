<?php

class UCDLibPluginLocationsMetaData {
  function __construct( $config ) {
    $this->config = $config;
    add_action('init', [$this, 'register']);
  }

  public function register(){
    register_post_meta( $this->config['postTypeSlug'], 'has_operating_hours', array(
      'show_in_rest' => true,
      'single' => true,
      'default' => false,
      'type' => 'boolean',
    ) );
    register_post_meta( $this->config['postTypeSlug'], 'libcal_id', array(
      'show_in_rest' => true,
      'single' => true,
      'default' => '',
      'type' => 'string',
    ) );
  }
}
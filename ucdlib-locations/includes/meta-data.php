<?php

class UCDLibPluginLocationsMetaData {
  function __construct( $config ) {
    $this->config = $config;
    add_action('init', [$this, 'register_hours']);
    add_action('init', [$this, 'register_core']);
  }

  // core metadata
  public function register_core(){
    register_post_meta( $this->config['postTypeSlug'], 'label_short', array(
      'show_in_rest' => true,
      'single' => true,
      'default' => '',
      'type' => 'string',
    ) );
    register_post_meta( $this->config['postTypeSlug'], 'room_number', array(
      'show_in_rest' => true,
      'single' => true,
      'default' => 'Main Building',
      'type' => 'string',
    ) );
    register_post_meta( $this->config['postTypeSlug'], 'has_alert', array(
      'show_in_rest' => true,
      'single' => true,
      'default' => false,
      'type' => 'boolean',
    ) );
    register_post_meta( $this->config['postTypeSlug'], 'alert_text', array(
      'show_in_rest' => true,
      'single' => true,
      'default' => '',
      'type' => 'string',
    ) );
    register_post_meta( $this->config['postTypeSlug'], 'has_redirect', array(
      'show_in_rest' => true,
      'single' => true,
      'default' => false,
      'type' => 'boolean',
    ) );
    register_post_meta( $this->config['postTypeSlug'], 'redirect', array(
      'show_in_rest' => [
        'schema' => [
          'type' => 'object',
          'properties' => [
            'postId' => ['type' => 'number'],
            'url' => ['type' => 'string'],
          ]
        ]
      ],
      'single' => true,
      'default' => ['postId' => 0, 'url' => ''],
      'type' => 'object',
    ) );
    register_post_meta( $this->config['postTypeSlug'], 'location_parent', array(
      'show_in_rest' => true,
      'single' => true,
      'default' => 0,
      'type' => 'number',
    ) );
  }

  // hours and occupancy
  public function register_hours(){
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
    register_post_meta( $this->config['postTypeSlug'], 'has_appointments', array(
      'show_in_rest' => true,
      'single' => true,
      'default' => false,
      'type' => 'boolean',
    ) );
    register_post_meta( $this->config['postTypeSlug'], 'appointments', array(
      'show_in_rest' => [
        'schema' => [
          'type' => 'object',
          'properties' => [
            'linkText' => ['type' => 'string'],
            'linkUrl' => ['type' => 'string'],
          ]
        ]
      ],
      'single' => true,
      'default' => ['linkText' => 'Appointment Required', 'linkUrl' => ''],
      'type' => 'object',
    ) );
    register_post_meta( $this->config['postTypeSlug'], 'has_occupancy', array(
      'show_in_rest' => true,
      'single' => true,
      'default' => false,
      'type' => 'boolean',
    ) );
    register_post_meta( $this->config['postTypeSlug'], 'occupancy', array(
      'show_in_rest' => [
        'schema' => [
          'type' => 'object',
          'properties' => [
            'capacity' => ['type' => 'number'],
            'safespaceId' => ['type' => 'string'],
          ]
        ]
      ],
      'single' => true,
      'default' => ['capacity' => 0, 'safespaceId' => ''],
      'type' => 'object',
    ) );
    register_post_meta( $this->config['postTypeSlug'], 'has_hours_placeholder', array(
      'show_in_rest' => true,
      'single' => true,
      'default' => false,
      'type' => 'boolean',
    ) );
    register_post_meta( $this->config['postTypeSlug'], 'hours_placeholder', array(
      'show_in_rest' => true,
      'single' => true,
      'default' => '',
      'type' => 'string',
    ) );
  }
}
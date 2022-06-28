<?php

class UCDLibPluginSpecialMetaData {

  function __construct( $config ) {
    $this->config = $config;
    add_action('init', [$this, 'register_post_meta']);
  }

  public function register_post_meta(){
    register_post_meta( '', 'almaRecordId', array(
      'show_in_rest' => true,
      'single' => true,
      'type' => 'string',
      'default' => ''
    ) );
    register_post_meta( '', 'biography', array(
      'show_in_rest' => true,
      'single' => true,
      'type' => 'string',
      'default' => ''
    ) );
    register_post_meta( '', 'biographyOriginal', array(
      'show_in_rest' => true,
      'single' => true,
      'type' => 'string',
      'default' => ''
    ) );
    register_post_meta( '', 'description', array(
      'show_in_rest' => true,
      'single' => true,
      'type' => 'string',
      'default' => ''
    ) );
    register_post_meta( '', 'findingAid', array(
      'show_in_rest' => true,
      'single' => true,
      'type' => 'string',
      'default' => ''
    ) );
    register_post_meta( '', 'inclusiveDates', array(
      'show_in_rest' => true,
      'single' => true,
      'type' => 'string',
      'default' => ''
    ) );
    register_post_meta( '', 'extent', array(
      'show_in_rest' => true,
      'single' => true,
      'type' => 'string',
      'default' => ''
    ) );
    register_post_meta( '', 'subject', array(
      'show_in_rest' => true,
      'single' => true,
      'type' => 'string',
      'default' => ''
    ) );
  }

}
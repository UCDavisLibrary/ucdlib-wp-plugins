<?php

class UCDLibPluginSpecialMetaData {

  function __construct( $config ) {
    $this->config = $config;
    add_action('init', [$this, 'register_post_meta']);
  }

  public function register_post_meta(){
    register_post_meta( '', 'originalData', array(
      'show_in_rest' => [
        'schema' => [
          'type' => 'object',
          'properties' => [
            "creator" => ['type' => 'string'],
            "callNumber"=> ['type' => 'string'],
            "inclusiveDates" => ['type' => 'string'],
            "findingAid" => ['type' => 'object'],
            "description" => ['type' => 'string'],
            "extent" => ['type' => 'string'],
            "links" => ['type' => 'array'],
            "subject" => ['type' => 'array'],
            "title" => ['type' => 'string'],
          ]
        ]
      ],
      'single' => true,
      'type' => 'object',
      'default' =>  [
        "creator" => '',
        "callNumber"=> '',
        "inclusiveDates" => '',
        "findingAid" => ['id' => '', 'linkType' => '', 'linkURL' => '', 'displayLabel' => ''],
        "description" => '',
        "extent" => '',
        "links" => array(
          ['id' => '', 'linkType' => '', 'linkURL' => '', 'displayLabel' => '']
        ),
        "subject" => [],
        "title" => '',
      ]      
    ) );
    register_post_meta( '', 'almaRecordId', array(
      'show_in_rest' => true,
      'single' => true,
      'type' => 'string',
      'default' => ''
    ) );
    register_post_meta( '', 'callNumber', array(
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
    register_post_meta( '', 'creator', array(
      'show_in_rest' => true,
      'single' => true,
      'type' => 'string',
      'default' => ''
    ) );
    register_post_meta( '', 'author', array(
      'show_in_rest' => true,
      'single' => true,
      'type' => 'string',
      'default' => ''
    ) );
    register_post_meta( '', 'language', array(
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
    register_post_meta( '', 'marterial', array(
      'show_in_rest' => true,
      'single' => true,
      'type' => 'string',
      'default' => ''
    ) );
    register_post_meta( '', 'original', array(
      'show_in_rest' => true,
      'single' => true,
      'type' => 'string',
      'default' => ''
    ) );
    register_post_meta( '', 'photographer', array(
      'show_in_rest' => true,
      'single' => true,
      'type' => 'string',
      'default' => ''
    ) );
    register_post_meta( '', 'location', array(
      'show_in_rest' => true,
      'single' => true,
      'type' => 'string',
      'default' => ''
    ) );
    register_post_meta( '', 'repository', array(
      'show_in_rest' => true,
      'single' => true,
      'type' => 'string',
      'default' => ''
    ) );
    register_post_meta( '', 'shelf', array(
      'show_in_rest' => true,
      'single' => true,
      'type' => 'string',
      'default' => ''
    ) );
    register_post_meta( '', 'source', array(
      'show_in_rest' => true,
      'single' => true,
      'type' => 'string',
      'default' => ''
    ) );
    register_post_meta( '', 'findingAid', array(
      'show_in_rest' => [
        'schema' => [
          'type' => 'object',
          'properties' => [
            "id" => ['type' => 'string'],
            "linkType" => ['type' => 'string'],
            "linkURL" => ['type' => 'string'],
            "displayLabel" =>  ['type' => 'string'],
          ]
        ]
      ],
      'single' => true,
      'type' => 'object',
      'default' => ['id' => '', 'linkType' => '', 'linkURL' => '', 'displayLabel' => '']
    ) );
    register_post_meta( '', 'inclusiveDates', array(
      'show_in_rest' => true,
      'single' => true,
      'type' => 'string',
      'default' => ''
    ) );
    register_post_meta( '', 'title', array(
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
      'show_in_rest' => [
        'schema' => [
          'type' => 'array',
          'items' => array('type' => 'string'),
        ]
      ],
      'single' => true,
      'type' => 'array',
      'default' => []
    ) );
    register_post_meta( '', 'links', array(
      'type'  => 'array',
      'show_in_rest' => array(
          'schema' => array(
              'type'  => 'array',
              'items' => array(
                'type'       => 'object',
                'properties' => array(
                  "id" => ['type' => 'string'],
                  "linkType" => ['type' => 'string'],
                  "linkURL" => ['type' => 'string'],
                  "displayLabel" =>  ['type' => 'string'],
                ),
              ),
          ),
      ),
      'single' => true,
    ) );
  }

}
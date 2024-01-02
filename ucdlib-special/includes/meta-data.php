<?php

class UCDLibPluginSpecialMetaData {

  public $config;

  function __construct( $config ) {
    $this->config = $config;
    add_action('init', [$this, 'register_post_meta']);
  }

  public function register_post_meta(){
    register_post_meta( $this->config->postTypes['collection'], 'fetchedData', array(
      'show_in_rest' => [
        'schema' => [
          'type' => 'object',
          'properties' => [
            "creator" => ['type' => 'string'],
            "callNumber"=> ['type' => 'string'],
            "inclusiveDates" => ['type' => 'string'],
            "findingAid" => [
              'type' => 'object',
              'properties' => [
                "id" => ['type' => 'string'],
                "linkType" => ['type' => 'string'],
                "linkURL" => ['type' => 'string'],
                "linkTitle" => ['type' => 'string'],
                "displayLabel" =>  ['type' => 'string'],
              ]
            ],
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
        "findingAid" => ['id' => '', 'linkType' => '', 'linkURL' => '', 'linkTitle' => '', 'displayLabel' => ''],
        "description" => '',
        "extent" => '',
        "links" => array(
          ['id' => '', 'linkType' => '', 'linkURL' => '', 'displayLabel' => '']
        ),
        "subject" => [],
        "title" => '',
      ]
    ) );
    register_post_meta( $this->config->postTypes['collection'], 'almaRecordId', array(
      'show_in_rest' => true,
      'single' => true,
      'type' => 'string',
      'default' => ''
    ) );
    register_post_meta( $this->config->postTypes['collection'], 'callNumber', array(
      'show_in_rest' => true,
      'single' => true,
      'type' => 'string',
      'default' => ''
    ) );
    register_post_meta( $this->config->postTypes['collection'], 'creator', array(
      'show_in_rest' => true,
      'single' => true,
      'type' => 'string',
      'default' => ''
    ) );
    register_post_meta( $this->config->postTypes['collection'], 'author', array(
      'show_in_rest' => true,
      'single' => true,
      'type' => 'string',
      'default' => ''
    ) );
    register_post_meta( $this->config->postTypes['collection'], 'language', array(
      'show_in_rest' => true,
      'single' => true,
      'type' => 'string',
      'default' => ''
    ) );
    register_post_meta( $this->config->postTypes['collection'], 'description', array(
      'show_in_rest' => true,
      'single' => true,
      'type' => 'string',
      'default' => ''
    ) );
    register_post_meta( $this->config->postTypes['collection'], 'material', array(
      'show_in_rest' => true,
      'single' => true,
      'type' => 'string',
      'default' => ''
    ) );
    register_post_meta( $this->config->postTypes['collection'], 'original', array(
      'show_in_rest' => true,
      'single' => true,
      'type' => 'string',
      'default' => ''
    ) );
    register_post_meta( $this->config->postTypes['collection'], 'photographer', array(
      'show_in_rest' => true,
      'single' => true,
      'type' => 'string',
      'default' => ''
    ) );
    register_post_meta( $this->config->postTypes['collection'], 'location', array(
      'show_in_rest' => true,
      'single' => true,
      'type' => 'string',
      'default' => ''
    ) );
    register_post_meta( $this->config->postTypes['collection'], 'repository', array(
      'show_in_rest' => true,
      'single' => true,
      'type' => 'string',
      'default' => ''
    ) );
    register_post_meta( $this->config->postTypes['collection'], 'shelf', array(
      'show_in_rest' => true,
      'single' => true,
      'type' => 'string',
      'default' => ''
    ) );
    register_post_meta( $this->config->postTypes['collection'], 'source', array(
      'show_in_rest' => true,
      'single' => true,
      'type' => 'string',
      'default' => ''
    ) );
    register_post_meta( $this->config->postTypes['collection'], 'findingAid', array(
      'show_in_rest' => [
        'schema' => [
          'type' => 'object',
          'properties' => [
            "id" => ['type' => 'string'],
            "linkType" => ['type' => 'string'],
            "linkURL" => ['type' => 'string'],
            "linkTitle" => ['type' => 'string'],
            "displayLabel" =>  ['type' => 'string'],
          ]
        ]
      ],
      'single' => true,
      'type' => 'object',
      'default' => ['id' => '', 'linkType' => '', 'linkURL' => '', 'linkTitle' => '', 'displayLabel' => '']
    ) );
    register_post_meta( $this->config->postTypes['collection'], 'inclusiveDates', array(
      'show_in_rest' => true,
      'single' => true,
      'type' => 'string',
      'default' => ''
    ) );
    register_post_meta( $this->config->postTypes['collection'], 'title', array(
      'show_in_rest' => true,
      'single' => true,
      'type' => 'string',
      'default' => ''
    ) );
    register_post_meta( $this->config->postTypes['collection'], 'extent', array(
      'show_in_rest' => true,
      'single' => true,
      'type' => 'string',
      'default' => ''
    ) );
    register_post_meta( $this->config->postTypes['collection'], 'subject', array(
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
    register_post_meta( $this->config->postTypes['collection'], 'links', array(
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

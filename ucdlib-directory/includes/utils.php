<?php

class UCDLibPluginDirectoryUtils {
  public static function registerContactMeta($postType){
    register_post_meta( $postType, 'contactWebsite', array(
      'show_in_rest' => [
        'schema' => [
          'items' => [
            'type' => 'object',
            'properties' => [
              'type' => ['type' => 'string'],
              'value' => ['type' => 'string'],
              'label' => ['type' => 'string'],
              'additionalText' => ['type' => 'string']
            ]
          ]
        ]
      ],
      'single' => true,
      'type' => 'array',
      'default' => []
    ) );
    register_post_meta( $postType, 'contactEmail', array(
      'show_in_rest' => [
        'schema' => [
          'items' => [
            'type' => 'object',
            'properties' => [
              'value' => ['type' => 'string'],
              'label' => ['type' => 'string'],
              'additionalText' => ['type' => 'string']
            ]
          ]
        ]
      ],
      'single' => true,
      'type' => 'array',
      'default' => []
    ) );
    register_post_meta( $postType, 'contactPhone', array(
      'show_in_rest' => [
        'schema' => [
          'items' => [
            'type' => 'object',
            'properties' => [
              'value' => ['type' => 'string'],
              'label' => ['type' => 'string'],
              'additionalText' => ['type' => 'string']
            ]
          ]
        ]
      ],
      'single' => true,
      'type' => 'array',
      'default' => []
    ) );
  }
}
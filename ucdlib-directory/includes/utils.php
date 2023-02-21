<?php

class UCDLibPluginDirectoryUtils {
  public static function explodeQueryVar($queryVar, $asInt=true, $delim=','){
    $q = get_query_var($queryVar, '');
    $q = explode($delim, $q);
    if ( $asInt ) {
      $q = array_map(function($id){return intval($id);}, $q);
    } else {
      $q = array_map('strtolower', $q);
    }
    $q = array_filter($q, function($v){return $v;});
    return $q;
  }


  public static function registerContactMeta($postType){
    register_post_meta( $postType, 'contactWebsite', array(
      'show_in_rest' => [
        'schema' => [
          'items' => [
            'type' => 'object',
            'properties' => [
              'icon' => [
                'type' => 'object',
                'properties' => [
                  'icon' => ['type' => 'string'],
                  'iconSet' => ['type' => 'string']
                ]
              ],
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

  public static function formatContactList($attrs){
    $contact = [];
    $defaultIcon = 'ucd-public:fa-network-wired';
    $icons = [
      'phone' => 'ucd-public:fa-phone',
      'email' => 'ucd-public:fa-envelope',
      'appointment' => 'ucd-public:fa-calendar-check',
      'google-scholar' => $defaultIcon,
      'linkedin' => 'ucd-public:fa-linkedin',
      'orcid' => 'ucd-public:fa-orcid',
      'twitter' => 'ucd-public:fa-twitter',
      'other' => $defaultIcon
    ];
    $attrs['icons'] = [];

    if ( is_array($attrs['emails']) && count($attrs['emails'])) {
      $attrs['icons'][] = $icons['email'];
      foreach ($attrs['emails'] as $email) {
        if ( array_key_exists('value', $email) && $email['value'] ) {
          $contact[] = [
            'value' => $email['value'],
            'link' => 'mailto:' . $email['value'],
            'label' => array_key_exists('label', $email) && $email['label'] ? $email['label'] : $email['value'],
            'icon' => $icons['email'],
            'additionalText' => array_key_exists('additionalText', $email) ? $email['additionalText'] : ''
          ];
        }
      }
    }

    if ( is_array($attrs['phones']) && count($attrs['phones'])) {
      $attrs['icons'][] = $icons['phone'];
      foreach ($attrs['phones'] as $phone) {
        if ( array_key_exists('value', $phone) && $phone['value'] ) {
          $label = $phone['value'];
          if ( array_key_exists('label', $phone) && $phone['label'] ) {
            $label = $phone['label'];
          } elseif ( strlen($phone['value']) == 10) {
            $label = substr($phone['value'], 0, 3) . '-' . substr($phone['value'], 3, 3) . '-' . substr($phone['value'], 6, 4);
          } else if ( strlen($phone['value']) == 7 ) {
            $label = substr($phone['value'], 0, 3) . '-' . substr($phone['value'], 3, 4);
          }
          $contact[] = [
            'value' => $phone['value'],
            'link' => 'tel:' .  $phone['value'],
            'label' => $label,
            'icon' => $icons['phone'],
            'additionalText' => array_key_exists('additionalText', $phone) ? $phone['additionalText'] : ''
          ];
        }
      }
    }

    if ( $attrs['appointmentUrl'] ) {
      $attrs['icons'][] = $icons['appointment'];
      $contact[] = [
        'value' => $attrs['appointmentUrl'],
        'link' => $attrs['appointmentUrl'],
        'label' => 'Book an Appointment',
        'icon' => $icons['appointment']
      ];
    }

    if ( is_array($attrs['websites']) ) {
      foreach ($attrs['websites'] as $website) {
        if ( array_key_exists('value', $website) && $website['value'] ) {
          if ( 
            array_key_exists('icon', $website) && 
            array_key_exists('icon', $website['icon']) &&
            array_key_exists('iconSet', $website['icon']) &&
            $website['icon']['icon'] &&
            $website['icon']['iconSet']
            ){
              $icon = $website['icon']['iconSet'] . ':' . $website['icon']['icon'];
          } elseif (
            array_key_exists('type', $website) &&
            $website['type'] &&
            array_key_exists($website['type'], $icons)
            ) {
            $icon = $icons[$website['type']];
          } else {
            $icon = $defaultIcon;
          }
          $attrs['icons'][] = $icon;
          $contact[] = [
            'value' => $website['value'],
            'link' => $website['value'],
            'label' => array_key_exists('label', $website) && $website['label'] ? $website['label'] : $website['value'],
            'icon' => $icon,
            'additionalText' => array_key_exists('additionalText', $website) ? $website['additionalText'] : ''
          ];
        }
      }
    }
    $attrs['contact'] = $contact;
    return $attrs;
  }
}
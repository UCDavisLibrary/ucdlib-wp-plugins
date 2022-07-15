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
            'icon' => $icons['email']
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
            'icon' => $icons['phone']
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
          $icon = array_key_exists('type', $website) && $website['type'] && array_key_exists($website['type'], $icons) ? $icons[$website['type']] : $defaultIcon;
          $attrs['icons'][] = $icon;
          $contact[] = [
            'value' => $website['value'],
            'link' => $website['value'],
            'label' => array_key_exists('label', $website) && $website['label'] ? $website['label'] : $website['value'],
            'icon' => $icon
          ];
        }
      }
    }
    $attrs['contact'] = $contact;
    return $attrs;
  }
}
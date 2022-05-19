<?php

// Contains methods that transform the attributes of a block (mostly fetching additional data)
// See 'transform' property in $registry array in blocks class.
class UCDLibPluginDirectoryBlockTransformations {
  public static function getPosition($attrs=array(), $post_id=false){
    if ( ! $post_id ) $post_id = get_the_ID();
    $attrs['title'] = get_post_meta($post_id, 'position_title', true);
    $dept_id = get_post_meta($post_id, 'position_dept', true);
    if ( $dept_id ) {
      $dept = Timber::get_post( $dept_id );
      if ( $dept ) {
        $attrs['department'] = $dept->title();

      }
    }
    
    return $attrs;
  }

  public static function getPronouns($attrs=[], $post_id=false){
    if ( ! $post_id ) $post_id = get_the_ID();
    $attrs['pronouns'] = get_post_meta($post_id, 'pronouns', true);
    $attrs['hide'] = get_post_meta($post_id, 'hide_pronouns', true);
    return $attrs;
  }

  public static function getBio($attrs=[], $post_id=false){
    if ( ! $post_id ) $post_id = get_the_ID();
    $attrs['bio'] = get_post_meta($post_id, 'bio', true);
    $attrs['hide'] = get_post_meta($post_id, 'hide_bio', true);
    return $attrs;
  }

  public static function getLibraries($attrs=[], $post_id=false){
    if ( ! $post_id ) $post_id = get_the_ID();
    $attrs['libraries'] = get_the_terms($post_id, 'library');
    $attrs['hide'] = get_post_meta($post_id, 'hide_libraries', true);
    return $attrs;
  }

  public static function getDirectoryTags($attrs=[], $post_id=false){
    if ( ! $post_id ) $post_id = get_the_ID();
    $attrs['tags'] = get_the_terms($post_id, 'directory-tag');
    $attrs['hide'] = get_post_meta($post_id, 'hide_tags', true);
    return $attrs;
  }

  public static function getContactInfo($attrs=[], $post_id=false){
    if ( ! $post_id ) $post_id = get_the_ID();
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

    $attrs['hide'] = get_post_meta($post_id, 'hide_contact', true);
    $attrs['websites'] = get_post_meta($post_id, 'contactWebsite', true);
    $attrs['emails'] = get_post_meta($post_id, 'contactEmail', true);
    $attrs['phones'] = get_post_meta($post_id, 'contactPhone', true);
    $attrs['appointmentUrl'] = get_post_meta($post_id, 'contactAppointmentUrl', true);

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

  public static function getExpertiseAreas($attrs=[], $post_id=false){
    if ( ! $post_id ) $post_id = get_the_ID();
    $attrs['tags'] = get_the_terms($post_id, 'expertise-areas');
    $attrs['hide'] = get_post_meta($post_id, 'hide_tags', true);
    return $attrs;
  }
}
?>
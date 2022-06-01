<?php

// Customizations to the third-party "Forminator" plugin
class UCDLibPluginAssetsForminator {
  public function __construct(){
    add_filter('forminator_field_markup', [$this, 'styleRadioAndCheck'], 10, 3);
    add_filter('forminator_field_markup', [$this, 'styleConsentBox'], 10, 3);
    add_filter('forminator_render_button_markup', [$this, 'styleSubmitButton'], 10, 2);
  }

  public function styleSubmitButton($html, $button){
    $theirClass = 'forminator-button-submit';
    $ourClass = 'btn btn--primary';
    $html = str_replace($theirClass, $theirClass . " " . $ourClass, $html);
    return $html;
  }

  // applies radio or checkbox styles
  // http://dev.webstyleguide.ucdavis.edu/redesign/?p=atoms-radio-buttons-styled
  // http://dev.webstyleguide.ucdavis.edu/redesign/?p=atoms-checkbox-styled
  public function styleRadioAndCheck( $html, $field, $renderClass ){
    if ( !$field ) return $html;
    if ( $field['type'] == 'radio') {
      $forminatorRole = 'radiogroup';
      $brandClass = 'radio';
    } elseif ( $field['type'] == 'checkbox') {
      $forminatorRole = 'group';
      $brandClass = 'checkbox';
    } else {
      return $html;
    }
    try {
      $dom = $this->htmlToDOM($html);

      $divs = $dom->getElementsByTagName('div');
      $baseDiv = false;
      foreach ($divs as $div) {
        if ( $div->getAttribute('role') == $forminatorRole ) {
          $baseDiv = $div;
          break;
        } 
      }
      if ( !$baseDiv ) return $html;
      $c = $div->getAttribute('class');
      $c = $c ? $c : '';
      $baseDiv->setAttribute('class', "$c $brandClass");
      $ul = $dom->createElement('ul');
      $ul->setAttribute('class', 'list--reset');

      $labels = $dom->getElementsByTagName('label');

      for( $i = count($labels)-1; $i >= 0; $i--  ) {
        $label = $labels->item($i);
        $input = $label->getElementsByTagName('input')->item(0);
        $li = $dom->createElement('li');
        $li->appendChild($input);
        $li->appendChild($label);
        $ul->appendChild($li);
      }
      $baseDiv->appendChild($ul);
      return $dom->saveHTML();
    } catch (\Throwable $th) {
      //throw $th;
      return $html;
    }
    return $html;
  }

  public function styleConsentBox($html, $field, $renderClass){
    if ( !$field || $field['type'] != 'consent') return $html;
    try {
      $dom = $this->htmlToDOM($html);
    
      $divs = $dom->getElementsByTagName('div');
      $wrapper = false;
      $text = false;
      foreach ($divs as $div) {
        if (stripos($div->getAttribute('class'), 'forminator-checkbox__wrapper') !== false) {
          $wrapper = $div;
        } elseif (stripos($div->getAttribute('class'), 'forminator-checkbox__label') !== false) {
          $text = $div;
        }
      }
      if ( !$wrapper ) return $html;
  
      $wrapper->setAttribute('class', $wrapper->getAttribute('class') . ' checkbox');
      $label = $wrapper->getElementsByTagName('label')->item(0);
      $input = $wrapper->getElementsByTagName('input')->item(0);
      $wrapper->insertBefore($input, $label);
      if ( $text ) $label->appendChild($text);
      return $dom->saveHTML();
    } catch (\Throwable $th) {
      //throw $th;
      return $html;
    }

  }

  public function htmlToDOM($html) {
    $dom = new DOMDocument;
    libxml_use_internal_errors(true);
    $dom->loadHTML($html, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
    libxml_clear_errors();
    return $dom;
  }
}
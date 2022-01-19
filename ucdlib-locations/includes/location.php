<?php
class UCDLibPluginLocationsLocation extends Timber\Post {
  
  protected $core_data;
  public function core_data(){
    if ( ! empty( $this->core_data ) ) {
      return $this->core_data;
    }
    $out = array(
      'id' => $this->ID,
      'labels' => $this->meta('labels'),
      'links' => array(),
      'parent' => $this->meta('parent')
    );

    $out['labels']['title'] = $this->title();
    if ( array_key_exists("", $out['labels']) ) unset($out['labels']['']);

    $out['links']['native'] = $this->link();
    $out['links']['custom'] = $this->meta('custom_url');
    $out['links']['link'] = $out['links']['custom'] ? $out['links']['custom'] : $out['links']['native'];


    $this->core_data = $out;
    return $this->core_data;
  }
}
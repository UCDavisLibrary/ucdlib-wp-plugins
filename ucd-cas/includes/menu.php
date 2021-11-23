<?php
class UCDPluginCASMenu {
  public function __construct(){
    $this->capability = 'manage_options';
    $this->title = "CAS Configuration";
    add_action('admin_menu', array($this, 'registerMenu'));
  }

  public function registerMenu(){
    add_options_page(
      $this->title,
      "CAS",
      $this->capability,
      "ucd-cas",
      array($this, 'displayMenu')
    );
  }

  public function displayMenu(){
    // check user capabilities
    if ( ! current_user_can( $this->capability ) ) {
      return;
    }
    $context = array(
      "title" => $this->title
    );

    Timber::render( "@ucd-cas/menu.twig", $context );
  }
}
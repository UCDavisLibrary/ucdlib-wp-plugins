<?php
class UCDPluginCASMenu {
  public function __construct($slug){
    $this->slug = $slug;
    $this->optionsSlug = $this->slug . "_options";
    $this->capability = 'manage_options';
    $this->title = "CAS Configuration";
    add_action('admin_menu', array($this, 'registerMenu'));
  }

  public function registerMenu(){
    add_options_page(
      $this->title,
      "CAS",
      $this->capability,
      $this->slug,
      array($this, 'displayMenu')
    );

    register_setting( 
      $this->slug, 
      $this->optionsSlug,
      array(
        "type" => "array",
        "default" => array(
          $this->slug . "_field_host" => "ssodev.ucdavis.edu",
          $this->slug . "_field_port" => "443",
          $this->slug . "_field_uri" => "cas",
          $this->slug . "_field_validation_path" => ""
        )
      )
     );
    $this->addConnectionSection();
  }

  public function addConnectionSection(){
    $sectionSlug = $this->slug . "_section_connection";
    add_settings_section(
      $sectionSlug,
      "Connection", 
      array($this, "displaySectionConnection"),
      $this->slug
    );

    add_settings_field(
      $this->slug . "_field_host",
      "Host",
      array($this, "displayFieldsConnection"),
      $this->slug,
      $sectionSlug,
      array(
        'label_for' => $this->slug . "_field_host"
      )
    );

    add_settings_field(
      $this->slug . "_field_port",
      "Port",
      array($this, "displayFieldsConnection"),
      $this->slug,
      $sectionSlug,
      array(
        'label_for' => $this->slug . "_field_port"
      )
    );

    add_settings_field(
      $this->slug . "_field_uri",
      "URI",
      array($this, "displayFieldsConnection"),
      $this->slug,
      $sectionSlug,
      array(
        'label_for' => $this->slug . "_field_uri"
      )
    );

    add_settings_field(
      $this->slug . "_field_validation",
      "Do SSL Server Validation",
      array($this, "displayFieldsConnection"),
      $this->slug,
      $sectionSlug,
      array(
        'label_for' => $this->slug . "_field_validation"
      )
    );

    add_settings_field(
      $this->slug . "_field_validation_path",
      "SSL Server Validation Cert Path",
      array($this, "displayFieldsConnection"),
      $this->slug,
      $sectionSlug,
      array(
        'label_for' => $this->slug . "_field_validation_path"
      )
    );
    }

  public function displaySectionConnection( $args ){
    $context = array(
      "args" => $args
    );
    Timber::render( "@" . $this->slug . "/sections/connection.twig", $context );
  }

  public function displayFieldsConnection( $args ){
    $context = array(
      "args" => $args,
      "options" => get_option( $this->optionsSlug ),
      "slug" => $this->slug,
      "optionsSlug" => $this->optionsSlug
    );
    Timber::render( "@" . $this->slug . "/fields/connection.twig", $context );
  }

  public function displayMenu(){
    if ( ! current_user_can( $this->capability ) ) {
      return;
    }
    $context = array(
      "title" => $this->title,
      "slug" => $this->slug
    );

    Timber::render( "@" . $this->slug . "/menu.twig", $context );
  }
}
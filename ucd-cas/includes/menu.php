<?php
class UCDPluginCASMenu {
  public function __construct($slug, $env){
    $this->slug = $slug;
    $this->env = $env;
    $this->optionsSlug = $this->slug . "_options";
    $this->capability = 'manage_options';
    $this->title = "CAS Configuration";
    add_action('init', array($this, 'registerOptionsDefaults'));
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

    $this->addConnectionSection();
    $this->addAuthorizationSection();
  }

  public function registerOptionsDefaults(){
    register_setting( 
      $this->slug, 
      $this->optionsSlug,
      array(
        "type" => "array",
        "default" => array(
          $this->slug . "_field_host" => "ssodev.ucdavis.edu",
          $this->slug . "_field_port" => "443",
          $this->slug . "_field_uri" => "cas",
          $this->slug . "_field_validation_path" => "",
          $this->slug . "_field_validation_uri" => "p3/serviceValidate",
          $this->slug . "_field_access_denied_message" => "You are not authorized to login to this site.",
          $this->slug . "_field_access_denied_link" => "",
          $this->slug . "_field_blacklist" => "",
          $this->slug . "_field_whitelist" => "",
          $this->slug . "_field_deptlist" => "060500",
        )
      )
     );
  }

  public function addConnectionSection(){
    $sectionSlug = $this->slug . "_section_connection";
    add_settings_section(
      $sectionSlug,
      "Connection", 
      array($this, "displaySectionConnection"),
      $this->slug
    );

    $fields = array(
      array("slug" => "host", "label" => "Host", "env" => $this->env['host'], "required" => true),
      array("slug" => "port", "label" => "Port", "required" => true),
      array("slug" => "uri", "label" => "URI", "required" => true),
      array("slug" => "validation_uri", "label" => "Service Validation URI"),
      array("slug" => "validation", "label" => "Do SSL Validation"),
      array("slug" => "validation_path", "label" => "CAS Server Cert Path"),
    );

    $this->addSettingsFields($fields, "displayFieldsConnection", $sectionSlug);
  }

  public function addAuthorizationSection(){
    $sectionSlug = $this->slug . "_section_authorization";
    add_settings_section(
      $sectionSlug,
      "Authorization", 
      array($this, "displaySectionAuthorization"),
      $this->slug
    );

    $fields = array(
      array("slug" => "prevent_user_creation", "label" => "Don't Create Users after Authentication"),
      array("slug" => "prevent_deptlist", "label" => "Don't Use Department Access List"),
      array("slug" => "deptlist", "label" => "Department Access List"),
      array("slug" => "blacklist", "label" => "Blacklist"),
      array("slug" => "whitelist", "label" => "Whitelist"),
      array("slug" => "access_denied_message", "label" => "Access Denied Message"),
      array("slug" => "access_denied_link", "label" => "Link to Request Access"),
    );

    $this->addSettingsFields($fields, "displayFieldsAuthorization", $sectionSlug);
  }

  public function addSettingsFields( $fields, $sectionCb, $sectionSlug){
    foreach ($fields as $field) {
      $f = $this->slug . "_field_" . $field['slug'];
      $contextArgs = array(
        'label_for' => $f,
        'short_slug' => $field['slug']
      );
      if ( array_key_exists('env', $field) ) $contextArgs['env'] = $field['env'];
      if ( array_key_exists('required', $field) ) $contextArgs['required'] = $field['required'];
      add_settings_field(
        $f,
        $field['label'],
        array($this, $sectionCb),
        $this->slug,
        $sectionSlug,
        $contextArgs
      );
    }
  }

  public function displayFieldsAuthorization( $args ){
    $field = array(
      "args" => $args,
      "options" => get_option( $this->optionsSlug ),
      "slug" => $this->slug,
      "optionsSlug" => $this->optionsSlug
    );
    $context = array("field" => $field);
    Timber::render( "@" . $this->slug . "/fields/authorization.twig", $context );
  }

  public function displaySectionConnection( $args ){
    $context = array(
      "args" => $args
    );
    Timber::render( "@" . $this->slug . "/sections/connection.twig", $context );
  }

  public function displayFieldsConnection( $args ){
    $field = array(
      "args" => $args,
      "options" => get_option( $this->optionsSlug ),
      "slug" => $this->slug,
      "optionsSlug" => $this->optionsSlug
    );
    $context = array("field" => $field);
    Timber::render( "@" . $this->slug . "/fields/connection.twig", $context );
  }

  public function displaySectionAuthorization( $args ){
    $context = array(
      "args" => $args
    );
    Timber::render( "@" . $this->slug . "/sections/authorization.twig", $context );
  }

  public function displayMenu(){
    if ( ! current_user_can( $this->capability ) ) {
      return;
    }
    $context = array(
      "title" => $this->title,
      "slug" => $this->slug
    );

    if ( ! class_exists( 'phpCAS' ) ) {
      $context['cas_not_installed'] = true;
    }

    Timber::render( "@" . $this->slug . "/menu.twig", $context );
  }
}
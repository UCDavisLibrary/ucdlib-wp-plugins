<?php
class UCDPluginCASAuth {
  public function __construct($slug, $env){
    $this->slug = $slug;
    $this->env = $env;
    $this->optionsSlug = $this->slug . "_options";
    if ( ! class_exists( 'phpCAS' ) ) {
      // error notification is printed in admin menu
      return;
    }
    add_filter('wp_authenticate', array($this, 'login'), 10,2);
    add_filter('wp_logout', array($this, 'logout'), 10,0);
  }

  public function get_options(){
    if ( !isset($this->_options) ){
      $this->_options = get_option( $this->optionsSlug );
    }
    return $this->_options;
  }

  public function login($user_login, $user_password){
    $options = $this->get_options();
    $this->createClient();

    if ( array_key_exists($this->slug . "_field_validation", $options) ) {
      // TODO
      // phpCAS::setCasServerCACert($cas_server_ca_cert_path);

      // delete this when set up
      phpCAS::setNoCasServerValidation();
    } else {
      phpCAS::setNoCasServerValidation();
    }

    if ( phpCAS::isAuthenticated() ){
      $kerb = phpCAS::getUser();
      $user = get_user_by('login', $kerb);
      //$user = false;
      if ( $user && $this->userIsBlackListed($user->ID) ){
        $this->do403();

      } elseif ( $user ) {
        $this->loginExistingUser($user);

      } elseif ( $this->userCanBeCreated() ) {
        $this->createUser();

      } else {
        $this->do403();
      }

    } else {
      phpCAS::forceAuthentication();
    }
  }

  public function logout(){
    $this->createClient();
    phpCAS::logout();
  }

  public function userCanBeCreated(){
    $options = $this->get_options();

    if ( array_key_exists($this->slug . "_field_prevent_user_creation", $options) ){
      return false;
    }
    return true;
  }

  public function userIsBlackListed($user_id){
    $options = $this->get_options();
    return false;
  }

  public function createUser(){
    $options = $this->get_options();
  }

  public function do403(){
    $options = $this->get_options();
    $context = Timber::context();
    $context['message'] = $options[$this->slug . '_field_access_denied_message'];
    status_header(403);
    Timber::render( "@" . $this->slug . "/403.twig", $context );
    exit;
  }

  public function loginExistingUser($user){
    wp_set_auth_cookie($user->ID, true);
    $this->setReadOnlyUserAttributes($user);
    wp_redirect("/wp-admin");
    exit;
  }

  public function createClient(){
    $options = $this->get_options();
    if ( $this->env['host'] ) {
      $host = $this->env['host'];
    } else {
      $host = $options[$this->slug . "_field_host"];
    }
    $port = intval($options[$this->slug . "_field_port"]);
    $casUri = $options[$this->slug . "_field_uri"];

    phpCAS::client(CAS_VERSION_3_0, $host, $port, $casUri);
  }

  public function setReadOnlyUserAttributes($user){
    $attributes = phpCAS::getAttributes();
    if ( !is_array($attributes) ) return;

    if ( array_key_exists("ucdPersonIAMID", $attributes) ) {
      update_user_meta( $user->ID, $this->slug . "_iam-id", $attributes['ucdPersonIAMID'] );
    }
    if ( array_key_exists("employeeNumber", $attributes) ) {
      update_user_meta( $user->ID, $this->slug . "_ucpath-id", $attributes['employeeNumber'] );
    }
    if ( array_key_exists("title", $attributes) ) {
      update_user_meta( $user->ID, $this->slug . "_appt_title", $attributes['title'] );
    }
    if ( array_key_exists("ucdAppointmentDepartmentCode", $attributes) ) {
      update_user_meta( $user->ID, $this->slug . "_dept_code", $attributes['ucdAppointmentDepartmentCode'] );
    }
  }

}
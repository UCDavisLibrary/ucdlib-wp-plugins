<?php
class UCDPluginCASAuth {
  public function __construct($slug, $env){
    $this->slug = $slug;
    $this->env = $env;
    $this->optionsSlug = $this->slug . "_options";
    $this->fieldsSlug = $this->slug . "_field_";
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
      
      if ( $user && $this->userIsBlackListed($kerb) ){
        $this->do403();

      } elseif ( $user ) {
        $this->loginExistingUser($user);

      } elseif ( $this->userCanBeCreated($kerb) ) {
        $newUserId = $this->createUser($kerb);
        if ( is_wp_error($newUserId) ){
          $message = "We encountered an error and were unable to create an account for you: <br>";
          $message .= $newUserId->get_error_message();
          $this->do403($message);
        } else {
          $newUser = get_user_by('id', $newUserId);
          $this->loginExistingUser($newUser);
        }
        
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

  public function userCanBeCreated($kerb){
    $options = $this->get_options();

    if ( array_key_exists($this->fieldsSlug . "prevent_user_creation", $options) ){
      return false;
    }
    if ( $this->userIsBlackListed($kerb) ){
      return false;
    }
    if ( $this->userIsWhiteListed($kerb) ){
      return true;
    }
    if ( !array_key_exists($this->fieldsSlug . "prevent_deptlist", $options) ){
      return $this->userIsInWhiteListedDepartment();
    }
    
    return true;
  }

  public function userIsWhiteListed($kerb){
    $options = $this->get_options();
    $whitelist = $options[$this->fieldsSlug . "whitelist"];
    $whitelist = $this->textAreaToArray($whitelist);
    return in_array($kerb, $whitelist);
  }

  public function userIsBlackListed($kerb){
    $options = $this->get_options();
    $blacklist = $options[$this->fieldsSlug . "blacklist"];
    $blacklist = $this->textAreaToArray($blacklist);
    return in_array($kerb, $blacklist);
  }

  public function userIsInWhiteListedDepartment(){
    $options = $this->get_options();
    $attributes = phpCAS::getAttributes();
    $deptField = "ucdAppointmentDepartmentCode";
    if ( !is_array($attributes) || !array_key_exists($deptField, $attributes) ) {
      return false;
    }
    $whitelist = $options[$this->fieldsSlug . "deptlist"];
    $whitelist = $this->textAreaToArray($whitelist);
    return in_array($attributes[$deptField], $whitelist);
  }

  public function createUser($kerb){
    $attributes = phpCAS::getAttributes();
    $options = $this->get_options();
    
    $user = array('user_login' => $kerb);
    $user["user_pass"] = substr( hash("whirlpool", time()), 0, 8);

    if ( is_array($attributes) ){
      if ( array_key_exists('mail', $attributes) ) {
        $user['user_email'] = $attributes['mail'];
      }
      if ( array_key_exists('givenName', $attributes) ) {
        $user['first_name'] = $attributes['givenName'];
      }
      if ( array_key_exists('sn', $attributes) ) {
        $user['last_name'] = $attributes['sn'];
      }
      if ( array_key_exists('displayName', $attributes) ) {
        $user['display_name'] = $attributes['displayName'];
      }
      if ( 
        array_key_exists('eduPersonAffiliation', $attributes) && 
        $attributes['eduPersonAffiliation'] == 'student' &&
        get_role('student_employee') ){
          $user['role'] = 'student_employee';
      }
    }

    $userId = wp_insert_user($user);
    return $userId;
  }

  public function do403($message=false){
    $options = $this->get_options();
    $context = Timber::context();
    if ( $message ) {
      $context['message'] = $message;
    } else {
      $context['message'] = $options[$this->fieldsSlug . 'access_denied_message'];
    }
    $context['request_access_link'] = $options[$this->fieldsSlug . 'access_denied_link'];
    $context['title'] = "Access Denied";
    status_header(403);
    if ( wp_get_theme()->Template == 'ucdlib-theme-wp/theme' ){
      Timber::render( "@" . $this->slug . "/403.twig", $context );
    } else {
      echo $context['message'];
    }
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

  public function textAreaToArray($text){
    $arr = explode("\n", $text);
    $arr = array_map("trim", $arr);
    return $arr;
  }

}
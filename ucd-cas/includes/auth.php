<?php
/**
 * @class UCDPluginCASAuth
 * @classdesc Does user authentication and authorization
 */
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

  /**
   * @method get_options
   * @description retrieves plugin options as key/value pairs
   * @return {Array}
   */
  public function get_options(){
    if ( !isset($this->_options) ){
      $this->_options = get_option( $this->optionsSlug );
    }
    return $this->_options;
  }

  /**
   * @method login
   * @description CAS authenticates a user and either logs them in or creates an account for them.
   * Attaches to the 'wp_authenticate' hook
   * @param $user_login - Login entered by user. Not used by CAS
   * @param $user_password - Wordpress password entered by user. Not used by CAS.
   */
  public function login($user_login, $user_password){
    $options = $this->get_options();
    $this->createClient();

    if ( phpCAS::isAuthenticated() ){
      $kerb = phpCAS::getUser();
      $user = get_user_by('login', $kerb);
      
      // user is blacklisted, deny access
      if ( 
        $user && 
        $this->userIsBlackListed($kerb) &&
        !$this->userHasEnvironmentalAccess($kerb)
        ){
        $this->do403();

      // a wordpress account already exists for user, log them in
      } elseif ( $user ) {
        if ( $this->userHasEnvironmentalAccess($kerb) ){
          $user->set_role('administrator');
          wp_update_user($user);
        }
        $this->loginExistingUser($user);

      // user does not have wp account, and we can create one for them
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

  /**
   * @method logout
   * @description Logs a user out from CAS
   */
  public function logout(){
    $this->createClient();
    phpCAS::logout();
  }

  /**
   * @method userHasEnvironmentalAccess
   * @description user is guaranteed admin access from environmental variable
   * @param kerb - Kerberos id
   * @return Boolean
   * 
   */
  public function userHasEnvironmentalAccess($kerb){
    if ( !$this->env["ensure_users"] ) return false;
    return in_array($kerb, $this->env["ensure_users"]);
  }

  /**
   * @method userCanBeCreated
   * @description A user can be created based on what has been entered in the plugin options
   * @param kerb - Kerberos id
   * @return Boolean
   */
  public function userCanBeCreated($kerb){
    $options = $this->get_options();

    if ( $this->userHasEnvironmentalAccess($kerb) ){
      return true;
    }
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

  /**
   * @method userIsWhiteListed
   * @description User is in the whitelist defined on the plugin options page
   * @param kerb - Kerberos id
   * @return Boolean
   */
  public function userIsWhiteListed($kerb){
    $options = $this->get_options();
    $whitelist = $options[$this->fieldsSlug . "whitelist"];
    $whitelist = $this->textAreaToArray($whitelist);
    return in_array($kerb, $whitelist);
  }

  /**
   * @method userIsBlackListed
   * @description User is in the blacklist defined on the plugin options page
   * @param kerb - Kerberos id
   * @returns Boolean
   */
  public function userIsBlackListed($kerb){
    $options = $this->get_options();
    $blacklist = $options[$this->fieldsSlug . "blacklist"];
    $blacklist = $this->textAreaToArray($blacklist);
    return in_array($kerb, $blacklist);
  }

  /**
   * @method userIsInWhiteListedDepartment
   * @description User is in one of the UC Davis departments defined on the plugin options page
   * @param kerb - Kerberos id
   * @returns Boolean
   */
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

  /**
   * @method createUser
   * @description Creates a wp account for the user authenticated with CAS
   * @param kerb - Kerberos id
   */
  public function createUser($kerb){
    $attributes = phpCAS::getAttributes();
    $options = $this->get_options();
    
    $user = array('user_login' => $kerb);
    $user["user_pass"] = substr( hash("whirlpool", time()), 0, 8);

    if ( $this->userHasEnvironmentalAccess($kerb) ) {
      $user['role'] = 'administrator';
    }

    if ( is_array($attributes) ){
      if ( array_key_exists('mail', $attributes) ) {
        $user['user_email'] = $attributes['mail'];
      } elseif ( array_key_exists('email', $attributes) ){
        $user['user_email'] = $attributes['email'];
      }
      if ( array_key_exists('givenName', $attributes) ) {
        $user['first_name'] = $attributes['givenName'];
      }
      if ( array_key_exists('sn', $attributes) ) {
        $user['last_name'] = $attributes['sn'];
      } else if ( array_key_exists('surname', $attributes) ){
        $user['last_name'] = $attributes['surname'];
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

  /**
   * @method do403
   * @description Renders 403 page and kills php process
   */
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

  /**
   * @method loginExistingUser
   * @description Sets auth cookie and redirects user to admin dashboard
   * @param user A wordpress user class
   */
  public function loginExistingUser($user){
    wp_set_auth_cookie($user->ID, true);
    $kerberos = phpCAS::getUser();
    $this->setReadOnlyUserAttributes($user, $kerberos);
    do_action( $this->slug . "/login", $user, $kerberos);
    wp_redirect("/wp-admin");
    exit;
  }

  /**
   * @method createClient
   * @description Creates a CAS client using values from plugin options page
   * @returns {phpCAS::client}
   */
  public function createClient(){
    $options = $this->get_options();
    if ( $this->env['host'] ) {
      $host = $this->env['host'];
    } else {
      $host = $options[$this->slug . "_field_host"];
    }
    $port = intval($options[$this->slug . "_field_port"]);
    $casUri = $options[$this->slug . "_field_uri"];
    
    phpCAS::client(CAS_VERSION_3_0, $host, $port, $casUri, get_site_url());
    
    if ( array_key_exists($this->slug . "_field_validation_uri", $options) ) {
      $serviceValidate = $options[$this->slug . "_field_validation_uri"];
      if ( $serviceValidate ){
        if ( $port == 443 ) {
          $protocol = 'https';
        } else {
          $protocol = 'http';
        }
        phpCas::setServerServiceValidateURL( "$protocol://$host/$casUri/$serviceValidate" );
      }
    }

    // verify cas server
    $do_ssl = false;
    if ( $this->env['do_ssl'] !== false ) {
      $do_ssl = intval($this->env['do_ssl']) === 1 || false;
    } else {
      $do_ssl = array_key_exists($this->slug . "_field_validation", $options);
    }
    $cert_path = '';
    if ( $this->env['cert'] ) {
      $cert_path = $this->env['cert'];
    } else if ( array_key_exists($this->slug . "_field_validation_path", $options) ){
      $cert_path = $options[$this->slug . "_field_validation_path"];
    }

    if ( $do_ssl && $cert_path ) {
      if ( substr( $cert_path, 0, 1 ) === "/" ) {
        phpCAS::setCasServerCACert($cert_path);
      } else {
        phpCAS::setCasServerCACert(WP_PLUGIN_DIR . "/$this->slug/" . $cert_path);
      }
      
    } else {
      phpCAS::setNoCasServerValidation();
    }
  }

  /**
   * @method setReadOnlyUserAttributes
   * @description Saves a few CAS attributes to a wp user's metadata
   * @param user A wordpress user class
   */
  public function setReadOnlyUserAttributes($user){
    $attributes = phpCAS::getAttributes();
    if ( !is_array($attributes) ) return;

    $attrMap = [
      ['cas' => 'ucdPersonIAMID', 'wp' => 'iam-id'],
      ['cas' => 'employeeNumber', 'wp' => 'ucpath-id'],
      ['cas' => 'title', 'wp' => 'appt_title'],
      ['cas' => 'ucdAppointmentDepartmentCode', 'wp' => 'dept_code']
    ];

    foreach ($attrMap as $attr) {
      if ( array_key_exists($attr['cas'], $attributes) ) {
        $k =  $this->slug . "_" . $attr['wp'];
        $v = get_user_meta($user->ID, $k, true);
        if ( $attributes[$attr['cas']] != $v) {
          update_user_meta( $user->ID, $k, $attributes[$attr['cas']] );
        }
      }
    }
  }

  public function textAreaToArray($text){
    $arr = explode("\n", $text);
    $arr = array_map("trim", $arr);
    return $arr;
  }

}
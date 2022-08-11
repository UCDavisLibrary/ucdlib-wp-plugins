<?php
class UCDPluginCASMetaData {
  public function __construct($slug, $env){
    $this->slug = $slug;
    $this->env = $env;

    $this->userMetaFields = array(
      array('slug' => $this->slug . "_iam-id", 'label' => "IAM ID"),
      array('slug' => $this->slug . "_ucpath-id", 'label' => "UCPATH ID"),
      array('slug' => $this->slug . "_appt_title", 'label' => "Appointment Title"),
      array('slug' => $this->slug . "_dept_code", 'label' => "Department Code"),
    );

    add_action( 'init', array($this, 'register_meta') );
    add_action( 'show_user_profile', array($this, 'add_user_meta') );
    add_action( 'edit_user_profile', array($this, 'add_user_meta') );
  }

  public function register_meta(){
    foreach ($this->userMetaFields as $field) {
      register_meta('user', $field['slug'], array(
        "type" => "string",
        "single" => true,
        "show_in_rest" => true 
      ));
    }

  }

  public function add_user_meta($user){
    if ( ! current_user_can( 'manage_options' ) ) {
      return;
    }
    $fields = array();
    foreach ($this->userMetaFields as $field) {
      $field['value'] = get_user_meta($user->ID, $field['slug'], true);
      $fields[] = $field;
    }
    Timber::render( "@" . $this->slug . "/user-profile.twig", array("fields" => $fields) );
  }
}
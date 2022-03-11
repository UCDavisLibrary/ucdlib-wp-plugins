<?php

// Settings for the 'Redirection' third-party plugin
class UCDLibPluginMigrationRedirection {
  function __construct( $config ){

    $this->config = $config;
    add_filter( 'redirection_role', array($this, 'setBaseRole'));
    
    add_filter( 'redirection_capability_check', array($this, 'setGranularCapabilities'), 10, 2 );

  }

  public function setBaseRole($role){
    return 'read';
  }

  public function setGranularCapabilities($capability, $permission_name){

    // view redirects
    if ( $permission_name === 'redirection_cap_redirect_manage' ) {
      return $capability;
    }

    return 'manage_options';
  }
}
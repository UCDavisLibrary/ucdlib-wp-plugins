<?php

class UCDLibPluginMigrationMetaData {

  function __construct( $config ){

    $this->config = $config;

    // Register metadata fields handled by gutenberg
    add_action('init', array($this, 'register_post_meta'));

  }

  function register_post_meta(){

    register_post_meta( '', 'migration_status', array(
      'show_in_rest' => true,
      'single' => true,
      'type' => 'string',
      'default' => ''
    ) );
  }

}

?>
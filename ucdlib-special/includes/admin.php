<?php

class UCDLibPluginSpecialAdmin {

  public $config;

  public function __construct( $config ){
    $this->config = $config;
    add_action( 'admin_head', array($this, 'admin_head') );
    add_action( 'admin_menu', array($this, 'add_admin_menu'));
  }

  /**
   * if this element is detected, editor JS for this plugin will be executed.
   * Necessary because we use a single js build process for all plugins and the theme
   */
  public function admin_head(){
    $slug = $this->config->slug;
    echo "
    <meta name='ucdlib-plugin-active' content='$slug' />
    ";
  }

  public function add_admin_menu(){
    add_menu_page(
      __( 'Archives and Special Collections', 'textdomain' ),
      'Archives and Special Collections',
      'edit_posts',
      $this->config->slug,
      '',
      'dashicons-media-document',
      25
      );
  }
}

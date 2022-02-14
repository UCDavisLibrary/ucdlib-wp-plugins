<?php

class UCDLibPluginAssets {
  public function __construct(){
    $this->slug = "ucdlib-assets";

    $config = array(
      'slug' => $this->slug,
      'entryPath' => plugin_dir_path( __DIR__ ) . $this->slug . '.php',
      'version' => false,
      'isDevEnv' => getenv('UCD_THEME_ENV') == 'dev',
    );

    // static asset uris
    $config['uris'] = array(
      'base' => trailingslashit( plugins_url() ) . $config['slug'] . "/assets"
    );
    $config['uris']['js'] = $config['uris']['base'] . "/js";
    $config['uris']['css'] = $config['uris']['base'] . "/css";

    // list of assets we will stop from loading and include in this build instead
    $config['rmAssets'] = [
      ['slug' => 'ucd-public', "type" => 'script', 'location' => 'public'],
      ['slug' => 'ucd-public', "type" => 'style', 'location' => 'public'],
      ['slug' => 'ucdlib-locations/public', "type" => 'script', 'location' => 'public'],
      ['slug' => 'ucd-components', 'type' => 'script', 'location' => 'block_editor']
    ];

    // extract data from plugin docstring
    $plugin_metadata = get_file_data( $config['entryPath'], array(
      'Version' => 'Version'
    ) );
    if ( ! empty( $plugin_metadata['Version'] ) ) {
      $config['version'] = $plugin_metadata['Version'];
    }

    $this->config = $config;


    add_action( 'wp_enqueue_scripts', array($this, "enqueue_scripts") );
    add_action( 'wp_enqueue_scripts', array($this, "deregister_public"), 1000);
    add_action( 'enqueue_block_editor_assets', array($this, "enqueue_block_editor_assets"), 3);
    add_action( 'enqueue_block_editor_assets', array($this, "deregister_block_editor_assets"), 1000);

    add_action( 'after_setup_theme', array($this, 'enqueue_editor_css'));
    // add_filter( 'mce_css', array($this, 'enqueue_editor_css') );
    
  }

  public function enqueue_editor_css(){
    remove_editor_styles();
    add_theme_support( 'editor-styles' );
    $path = "../../../plugins/" . $this->config['slug'] . "/assets/css/";
    if ( $this->config['isDevEnv'] ) {
      add_editor_style( $path . "ucdlib-dev.css" );
    } else {
      add_editor_style( $path . "ucdlib.css" );
    }
  }

  public function deregister_public(){
    $this->_deregister('public');
  }

  public function deregister_block_editor_assets(){
    $this->_deregister('block_editor');
  }

  public function enqueue_block_editor_assets(){

    $slug = "ucdlib-editor";
    $file = $slug . ".js";
    // customizer not working properly when editor bundle is loaded.
    // TODO: figure out why?? 2021-10-25
    //$adminScreens = array('widgets', 'customize');
    $adminScreens = array( 'customize');
    if ( in_array( get_current_screen()->id, $adminScreens ) ) return;

    add_filter( 'ucd-theme/assets/editor-settings-slug', function(){
      return "ucdlib-editor";
    } );

    if ( $this->config['isDevEnv'] ){
      wp_enqueue_script(
        $slug, 
        $this->config['uris']['js'] . "/editor/dev/" . $file, 
        array(), 
        $this->config['version'], 
        true);

    } else {
      wp_enqueue_script(
        $slug, 
        $this->config['uris']['js'] . "/editor/dist/" . $file, 
        array(), 
        $this->config['version'],
        true);
    }
  }

  public function enqueue_scripts(){

    $slug = 'ucdlib';

    if ( $this->config['isDevEnv'] ){
      wp_enqueue_script(
        $slug,
        $this->config['uris']['js'] . "/dev/ucdlib.js",
        array(),
        $this->config['version'],
        true
      );
      wp_enqueue_style( 
        $slug,
        $this->config['uris']['css'] . "/ucdlib-dev.css",
        array(), 
        $this->config['version']
      );
    } else {
      wp_enqueue_script(
        $slug,
        $this->config['uris']['js'] . "/dist/ucdlib.js",
        array(),
        $this->config['version'],
        true
      );
      wp_enqueue_style( 
        $slug,
        $this->config['uris']['css'] . "/ucdlib.css",
        array(), 
        $this->config['version']
      );
    }
  }

  private function _deregister( $location ) {
    foreach ($this->config['rmAssets'] as $s) {
      if ( $s['location'] != $location ) continue;
      if ( $s['type'] == 'script' ) {
        wp_deregister_script( $s['slug'] );
      } elseif ( $s['type'] == 'style' ) {
        wp_deregister_style( $s['slug'] );
      }
    }
  }

}
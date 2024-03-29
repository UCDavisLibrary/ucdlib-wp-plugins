<?php
require_once( __DIR__ . '/auth.php' );
require_once( __DIR__ . '/meta-data.php' );
require_once( __DIR__ . '/menu.php' );

class UCDPluginCAS {

  public $slug;
  public $env;
  public $metaData;
  public $menu;
  public $auth;

  public function __construct(){
    $this->slug = "ucd-cas";
    $this->env = array(
      "host" => getenv('UCD_CAS_HOST'),
      "ensure_users" => getenv('UCD_CAS_ENSURE_USERS'),
      'cert' => getenv('UCD_CAS_SERVER_CA_CERT'),
      'do_ssl' => getenv('UCD_CAS_DO_SSL')
    );
    if ( is_string($this->env['ensure_users']) ){
      $this->env['ensure_users'] = array_map('trim', explode(',', $this->env['ensure_users'] ));
    }
    $this->metaData = new UCDPluginCASMetaData($this->slug, $this->env);
    $this->menu = new UCDPluginCASMenu($this->slug, $this->env);
    $this->auth = new UCDPluginCASAuth($this->slug, $this->env);
    add_filter( 'timber/locations', array($this, 'add_timber_locations') );
    add_action( 'after_setup_theme', array($this, 'check_for_timber'));
  }

  /**
   * Required to display menu
   * The theme loads it, so this shouldn't ever occur.
   */
  public function check_for_timber(){
    if ( ! class_exists( 'Timber' ) ) {
      add_action(
        'admin_notices',
        function() {
          echo '<div class="error"><p>Timber not activated. This is required for ' .  $this->slug . ' plugin. Make sure you add it as a composer dependency. </p></div>';
        }
      );
    }
  }

  /**
   * Adds twig files under the @ucd-cas namespace
   */
  public function add_timber_locations($paths){
    $paths[$this->slug] = array(WP_PLUGIN_DIR . "/" . $this->slug . '/views');
    return $paths;
  }
}

<?php
require_once( __DIR__ . '/robots.php' );
require_once( __DIR__ . '/log.php' );

class UCDLibPluginAssets {

  public $slug;
  public $config;
  public $activePlugins;
  public $forminator;
  public $hummingbird;
  public $log;


  public function __construct(){
    $this->slug = "ucdlib-assets";
    new UCDLibPluginAssetsRobots();
    $this->log = new UCDLibPluginAssetsLog();

    $config = array(
      'slug' => $this->slug,
      'entryPath' => plugin_dir_path( __DIR__ ) . $this->slug . '.php',
      'version' => false,
      'isDevEnv' => getenv('UCD_THEME_ENV') == 'dev',
    );

    $mainBuildInfo = $this->readBuildInfo('main-wp-website.json');
    if ( $mainBuildInfo ) {
      $appVersion = $this->getBuildVersion($mainBuildInfo);
      if ( $appVersion ) {
        putenv('APP_VERSION=' . $appVersion);
      }
      if ( array_key_exists('date', $mainBuildInfo) ) {
        putenv('BUILD_TIME=' . $mainBuildInfo['date']);
      }
    }

    $themeBuildInfo = $this->readBuildInfo('ucdlib-theme-wp.json');
    if ( $themeBuildInfo ) {
      $websiteTag = $this->getBuildVersion($themeBuildInfo);
      if ( $websiteTag ) {
        putenv('WEBSITE_TAG=' . $websiteTag);
      }
    }

    // Build params
    $config['buildParams'] = array(
      "APP_VERSION" => getenv('APP_VERSION'),
      "BUILD_TIME" => getenv('BUILD_TIME'),
      "WEBSITE_TAG" => getenv('WEBSITE_TAG')
    );

    $config['bundleVersion'] = (new DateTime())->getTimestamp();
    if ( !$config['isDevEnv'] && $config['buildParams']["BUILD_TIME"] ) {
      $config['bundleVersion'] = $config['buildParams']["BUILD_TIME"];
    }

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

    add_action( 'init', [$this, 'registerPluginCustomizations']);
    add_action( 'wp_enqueue_scripts', array($this, "enqueue_scripts") );
    add_action( 'wp_enqueue_scripts', array($this, "deregister_public"), 1000);
    add_action( 'enqueue_block_editor_assets', array($this, "enqueue_block_editor_assets"), 3);
    add_action( 'enqueue_block_editor_assets', array($this, "deregister_block_editor_assets"), 1000);
    add_filter( 'timber/locations', array($this, 'add_timber_locations') );
    add_filter( 'timber/context', array( $this, 'addGoogleAnalytics' ) );
    //add_action('wp_head', [$this, 'addGoogleAnalytics']);
    add_action( 'admin_footer', [$this, 'highlightCustomTaxonomyPages']);


    add_action( 'after_setup_theme', array($this, 'enqueue_editor_css'));
    add_action( 'admin_enqueue_scripts', [$this, 'registerAdminScripts']);
    // add_filter( 'mce_css', array($this, 'enqueue_editor_css') );

  }

  // reads build info from a cork-build-info file
  public function readBuildInfo($filename) {
    $filePath = '/cork-build-info/' . $filename;
    if (!file_exists($filePath)) {
      return null;
    }
    $jsonContent = file_get_contents($filePath);
    return json_decode($jsonContent, true);
  }

  public function getBuildVersion($buildInfo){
    if ( !empty($buildInfo['tag']) ) {
      return $buildInfo['tag'];
    } else if ( !empty($buildInfo['branch']) ) {
      return $buildInfo['branch'];
    } else if ( !empty($buildInfo['imageTag']) ) {
      $imageTag = explode(':', $buildInfo['imageTag']);
      return end($imageTag);
    }
    return null;
  }

  // registers customizations to third party plugins
  public function registerPluginCustomizations(){
    if ( $this->is_plugin_active('forminator/forminator.php') ){
      require_once( __DIR__ . '/forminator.php' );
      $this->forminator = new UCDLibPluginAssetsForminator();
    }
    if ( $this->is_plugin_active('wp-hummingbird/wp-hummingbird.php') ){
      require_once( __DIR__ . '/hummingbird.php' );
      $this->hummingbird = new UCDLibPluginAssetsHummingbird();
    }
  }

  public function registerAdminScripts(){
    $uri = $this->config['uris']['base'] . '/admin-css';
    wp_register_style( 'ucdlib-admin', $uri . '/ucdlib-admin.css', false, '1.0.0' );
    wp_enqueue_style( 'ucdlib-admin' );
  }

  public function is_plugin_active($plugin){
    if ( !isset( $this->activePlugins )){
      $this->activePlugins = get_option( 'active_plugins', array() );
    }
    return in_array( $plugin, $this->activePlugins, true );
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
        $this->config['bundleVersion'],
        true);

    } else {
      wp_enqueue_script(
        $slug,
        $this->config['uris']['js'] . "/editor/dist/" . $file,
        array(),
        $this->config['bundleVersion'],
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
        $this->config['bundleVersion']
      );
      wp_enqueue_style(
        $slug,
        $this->config['uris']['css'] . "/ucdlib-dev.css",
        array(),
        $this->config['bundleVersion']
      );
    } else {
      wp_enqueue_script(
        $slug,
        $this->config['uris']['js'] . "/dist/ucdlib.js",
        array(),
        $this->config['bundleVersion']
      );
      wp_enqueue_style(
        $slug,
        $this->config['uris']['css'] . "/ucdlib.css",
        array(),
        $this->config['bundleVersion']
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

  public function add_timber_locations($paths){
    $paths[$this->config['slug']] = array(WP_PLUGIN_DIR . "/" . $this->config['slug'] . '/views');
    return $paths;
  }

  public function addGoogleAnalytics($context){
    $context['twigHooks']['base']['postHead'][] = '@' . $this->config['slug'] . '/google-analytics.twig';
    return $context;
  }

  // a little hack to make sure that custom taxonomy admin menu items are highlighted
  // when on that page
  public function highlightCustomTaxonomyPages(){
    ?>
    <script type="text/javascript">
      (() => {
        const searchParams = new URLSearchParams(window.location.search);
        const tax = searchParams.get('taxonomy');
        if ( !tax ){
          return;
        }
        const parent = document.querySelector('.wp-has-submenu.wp-menu-open');
        if ( !parent || parent.querySelector('.current') ) return;
        Array.from(parent.querySelectorAll('a')).forEach(a => {
          if ( !a.href ) return;
          const q = a.href.split('?');
          if ( !q.length == 2 ) return;
          const params = new URLSearchParams(q[1]);
          if ( params.get('taxonomy') == tax ){
            a.classList.add('current');
            a.parentElement.classList.add('current');
          }
        });

      })();
    </script>
    <?php
  }

}

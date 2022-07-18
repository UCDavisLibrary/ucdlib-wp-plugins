<?php

require_once( __DIR__ . '/acf.php' );
require_once( __DIR__ . '/api-filters.php' );
require_once( __DIR__ . '/areas-of-expertise.php' );
require_once( __DIR__ . '/blocks.php' );
require_once( __DIR__ . '/departments.php' );
require_once( __DIR__ . '/directory-tags.php' );
require_once( __DIR__ . '/libraries.php' );
require_once( __DIR__ . '/people.php' );
require_once( __DIR__ . '/service-types.php' );
require_once( __DIR__ . '/services.php' );

class UCDLibPluginDirectory {
  public function __construct(){
    $this->slug = "ucdlib-directory";
    $this->config = $this->getConfig();

    $this->acf = new UCDLibPluginDirectoryACF( $this->config );
    $this->apiFilters = new UCDLibPluginDirectoryAPIFilters( $this->config );
    $this->blocks = new UCDLibPluginDirectoryBlocks( $this->config );
    $this->departments = new UCDLibPluginDirectoryDepartments( $this->config );
    $this->directoryTags = new UCDLibPluginDirectoryDirectoryTags( $this->config );
    $this->libraries = new UCDLibPluginDirectoryLibraries( $this->config );
    $this->people = new UCDLibPluginDirectoryPeople( $this->config );
    $this->serviceTypes = new UCDLibPluginDirectoryServiceTypes( $this->config );
    $this->services = new UCDLibPluginDirectoryServices( $this->config );
    $this->areasOfExpertise = new UCDLibPluginDirectoryAreasOfExpertise( $this->config );

    add_action( 'admin_menu', array($this, 'add_admin_menu'));
    add_action( 'admin_head', array($this, 'admin_head') );
    add_filter( 'timber/locations', array($this, 'add_timber_locations') );

  }

  // custom plugin admin menu. all post types and taxonomies are placed under it.
  public function add_admin_menu(){
    add_menu_page( 
      __( 'Directory (WIP)', 'textdomain' ),
      'Directory (WIP)',
      'manage_options',
      $this->slug,
      '',
      'dashicons-networking',
      25
      ); 
  }

  public function getConfig(){
    $config = $this->getBaseConfig();
    return $config;
  }

  public function getBaseConfig(){
    $config = array(
      'slug' => $this->slug,
      'entryPoint' => plugin_dir_path( __DIR__ ) . $this->slug . '.php',
      'version' => false,
      'taxSlugs' => [
        'service-type' => 'service-type',
        'library' => 'library',
        'directory' => 'directory-tag',
        'expertise' => 'expertise-areas'
      ],
      'postSlugs' => [
        'service' => 'service',
        'department' => 'department',
        'person' => 'person'
      ]
    );

    // Get version number from entrypoint doc string
    $plugin_metadata = get_file_data( $config['entryPoint'], array(
      'Version' => 'Version'
    ) );
    if ( ! empty( $plugin_metadata['Version'] ) ) {
      $config['version'] = $plugin_metadata['Version'];
    }

    return $config;
  }

  /**
   * if this element is detected, editor JS for this plugin will be executed.
   * Necessary because we use a single js build process for all plugins and the theme
   */
  public function admin_head(){
    echo "
    <ucdlib-plugin plugin='$this->slug' style='display:none'>
    </ucdlib-plugin>
    ";
  }

  /**
   * Adds twig files under the @ucdlib-directory namespace
   */
  public function add_timber_locations($paths){
    $paths[$this->config['slug']] = array(WP_PLUGIN_DIR . "/" . $this->config['slug'] . '/views');
    return $paths;
  }

}
<?php

require_once( __DIR__ . '/acf.php' );
require_once( __DIR__ . '/additional-authors.php');
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
    $this->additionalAuthors = new UCDLibPluginDirectoryAdditionalAuthors( $this->config );
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
    register_activation_hook($this->config['entryPoint'], [$this, 'onActivation'] );
    register_deactivation_hook($this->config['entryPoint'], [$this, 'onDeactivation'] );
  }

  // custom plugin admin menu. all post types and taxonomies are placed under it.
  public function add_admin_menu(){
    $people = $this->config['postSlugs']['personPlural'];

    add_menu_page( 
      __( 'Directory', 'textdomain' ),
      'Directory',
      "edit_$people",
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
    $person = 'person';
    $people = 'people';
    $dept = 'department';
    $depts = 'departments';
    $service = 'service';
    $services = 'services';
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
        'service' => $service,
        'department' => 'department',
        'person' => $person,
        'personPlural' => $people
      ],
      'capabilities' => [
        'manage_directory' => 'manage_directory'
      ]
    );

    // capabilities for each custom post type
    foreach ([$people, $depts, $services] as $cap) {
      $config['capabilities']["delete_others_$cap"] = "delete_others_$cap";
      $config['capabilities']["delete_$cap"] = "delete_$cap";
      $config['capabilities']["delete_private_$cap"] = "delete_private_$cap";
      $config['capabilities']["delete_published_$cap"] = "delete_published_$cap";
      $config['capabilities']["edit_others_$cap"] = "edit_others_$cap";
      $config['capabilities']["edit_$cap"] = "edit_$cap";
      $config['capabilities']["edit_private_$cap"] = "edit_private_$cap";
      $config['capabilities']["edit_published_$cap"] = "edit_published_$cap";
      $config['capabilities']["publish_$cap"] = "publish_$cap";
      $config['capabilities']["read_private_$cap"] = "read_private_$cap";
    }

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
    <meta name='ucdlib-plugin-active' content='$this->slug' />
    ";
  }

  /**
   * Adds twig files under the @ucdlib-directory namespace
   */
  public function add_timber_locations($paths){
    $paths[$this->config['slug']] = array(WP_PLUGIN_DIR . "/" . $this->config['slug'] . '/views');
    return $paths;
  }

  // set up roles and capabilities upon plugin activation
  public function onActivation(){

    $capabilities = $this->config['capabilities'];
    $people = $this->config['postSlugs']['personPlural'];
    $depts = $this->config['postSlugs']['department'] . 's';
    $services = $this->config['postSlugs']['service'] . 's';

    // admin
    $role = get_role( 'administrator' );
    foreach ($capabilities as $capability) {
      $role->add_cap( $capability ); 
    }

    // editor
    $role = get_role( 'editor' );
    $role->add_cap( "edit_$people" );
    $role->add_cap( "edit_published_$people" ); 
    $role->add_cap( "publish_$people" );
    $role->add_cap( "edit_$depts" );
    $role->add_cap( "edit_$services" );

    // author 
    $role = get_role( 'author' );
    $role->add_cap( "edit_$people" );
    $role->add_cap( "edit_published_$people" ); 
    $role->add_cap( "publish_$people" ); 
    $role->add_cap( "edit_$depts" );
    $role->add_cap( "edit_$services" );

    // contributor
    $role = get_role( 'contributor' );
    $role->add_cap( "edit_$people" );
    $role->add_cap( "edit_published_$people" );
    $role->add_cap( "edit_$depts" );
    $role->add_cap( "edit_$services" );

    // subscriber
    $role = get_role( 'subscriber' );
    $role->add_cap( "edit_$people" );
    $role->add_cap( "edit_published_$people" );
    $role->add_cap( "edit_$depts" );
    $role->add_cap( "edit_$services" );
    
    add_role('directory_manager', 'Directory Manager', $capabilities);

  }

  public function onDeactivation(){
    remove_role('directory_manager');
  }

}
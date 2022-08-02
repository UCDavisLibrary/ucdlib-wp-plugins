<?php
require_once( __DIR__ . '/acf.php' );
require_once( __DIR__ . '/admin.php' );
require_once( __DIR__ . '/blocks.php' );
require_once( __DIR__ . '/collection.php' );
require_once( __DIR__ . '/config.php' );
require_once( __DIR__ . '/api.php' );
require_once( __DIR__ . '/meta-data.php' );
require_once( __DIR__ . '/exhibit.php' );

// primary class for special collections plugin
// all actions and filters are applied here
class UCDLibPluginSpecial {
  public function __construct(){
    $this->slug = "ucdlib-special";
    $collection = 'collection';

    $configs = array(
      'slug' => $this->slug,
      'postTypeSlug' => 'collection',
      'entryPath' => plugin_dir_path( __DIR__ ) . $this->slug . '.php',
      'version' => false
    );

    // config values. slugs and what not.
    $this->config = new UCDLibPluginSpecialConfig();

    // capabilities for each custom post type
    $config['capabilities']["delete_others_$collection"] = "delete_others_$collection";
    $config['capabilities']["delete_$collection"] = "delete_$collection";
    $config['capabilities']["delete_private_$collection"] = "delete_private_$collection";
    $config['capabilities']["delete_published_$collection"] = "delete_published_$collection";
    $config['capabilities']["edit_others_$collection"] = "edit_others_$collection";
    $config['capabilities']["edit_$collection"] = "edit_$collection";
    $config['capabilities']["edit_private_$collection"] = "edit_private_$collection";
    $config['capabilities']["edit_published_$collection"] = "edit_published_$collection";
    $config['capabilities']["publish_$collection"] = "publish_$collection";
    $config['capabilities']["read_private_$collection"] = "read_private_$collection";
    
    // advanced custom fields config. handles plugin settings menu
    $this->acf = new UCDLibPluginSpecialACF( $this->config );

    // generic customizations to wordpress admin menu
    $this->admin = new UCDLibPluginSpecialAdmin( $this->config );

    // custom server-side "dynamic" blocks
    $this->blocks = new UCDLibPluginSpecialBlocks( $this->config );

    // 'special-collection' post type
    $this->collection = new UCDLibPluginSpecialCollections( $this->config );

    // register our API endpoints at /wp-json/ucdlib-special
    $this->api = new UCDLibPluginSpecialAPI( $configs);

    // register meta-data from the form
    $this->metaData = new UCDLibPluginSpecialMetaData( $this->config );

    // 'exhibit' post type
    $this->exhibit = new UCDLibPluginSpecialExhibits( $this->config );

    add_filter( 'timber/locations', array($this, 'add_timber_locations') );
    register_activation_hook($this->config->entryPoint, [$this, 'onActivation'] );
    register_deactivation_hook($this->config->entryPoint, [$this, 'onDeactivation'] );
  }

  /**
   * Adds twig files under the @ucdlib-special namespace
   */
  public function add_timber_locations($paths){
    $paths[$this->config->slug] = array(WP_PLUGIN_DIR . "/" . $this->config->slug . '/views');
    return $paths;
  }

  public function onActivation(){
    $capabilities = $this->config->capabilities;

    // admin needs everything
    $role = get_role( 'administrator' );
    foreach ($capabilities as $capability) {
      $role->add_cap( $capability ); 
    }

    add_role('exhibit_manager', 'Exhibit Manager', [$capabilities['manage_exhibits'] => true]);
    add_role('collection_manager', 'Special Collection Manager', [$capabilities['manage_collections'] => true]);
  }

  public function onDeactivation(){
    remove_role('exhibit_manager');
    remove_role('collection_manager');
  }

}
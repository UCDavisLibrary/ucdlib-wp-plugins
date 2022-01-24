<?php

class UCDLibPluginLocationsACF {

  public function __construct( $config ){
    $this->config = $config;

    add_action( 'acf/init', array($this, 'register_options_page') );
    add_filter( 'acf/settings/load_json', array($this, 'add_json_load_point') );
    add_action( 'acf/input/admin_head', array($this, 'move_block_editor') );
    add_action( 'acf/save_post', array($this, 'clear_all_transients'), 20 );
  }

  public function register_options_page(){
    acf_add_options_sub_page(array(
      'page_title'  => __('Location Settings'),
      'menu_title'  => __('Settings'),
      'parent_slug' => 'edit.php?post_type=' . $this->config['postTypeSlug'],
      'post_id' => $this->config['postTypeSlug'],
      'updated_message' => 'Location settings updated',
      'capability' => 'activate_plugins'
    ));
  }

  public function add_json_load_point( $paths ) {
    $paths[] = WP_PLUGIN_DIR . "/" . $this->config['slug'] . '/acf-json';
    return $paths;
  }

  // clears transients used to cache location data
  public function clear_all_transients(  ){
    $screen = get_current_screen();
    if (
      strpos($screen->id, "acf-options-settings") == true &&
      $screen->post_type === $this->config['postTypeSlug']
      ) {
      delete_transient('libcal_token');
      $locations = Timber::get_posts( [
        'post_type' => $this->config['postTypeSlug'],
        'nopaging' => true,
      ] );
      foreach ($locations as $location) {
        delete_transient('libcal_hours_' . $location->ID);
      }
    }
  }

  /**
   * Moves the block editor into an ACF tab for location pages
   * https://www.advancedcustomfields.com/resources/moving-wp-elements-content-editor-within-acf-fields/
   */
  public function move_block_editor(){
    global $typenow;
    if ( !isset($typenow) || $typenow !== 'location' ) return;
    ?>
    <script type="text/javascript">
    (function($) {
        
        $(document).ready(function(){
          var acfField = $('.acf-field-61e9b1df6ee8f .acf-input');
          if ( !acfField ) return;

          var intervalId;
          intervalId = setInterval(function(){

              var rootContainer = $('.is-root-container');
              if ( !rootContainer ) return;
              
              acfField.append( rootContainer );
              clearInterval(intervalId);
              intervalId = null;
            }, 300);
        });
        
    })(jQuery);    
    </script>
    <style type="text/css">
        .interface-interface-skeleton__body {
          flex-grow: 0 !important;
        }
    </style>
    
    <?php   
  }
  
}
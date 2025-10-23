<?php 

// Research Highlights Taxonomy 
class UCDDirectoryResearchHighlights {
  public $config;
  public $slug;
  public $postType;

  public function __construct($config) {
    $this->config = $config;
    $this->slug = $this->config['taxSlugs']['research-highlights'];
    $this->postType = $this->config['postSlugs']['person'];

    // run regiser function on init hook
    // add_action( 'init', array($this, 'register') );

    // run add_to_menu on admin_menu hook
    // add_action( 'admin_menu', array($this, 'add_to_menu'));

    // run expand_parent_menu on parent_file hook
    // add_action( 'parent_file',  array($this, 'expand_parent_menu') );
  }

  // register taxonomy
  public function register(){
    $people = $this->config['postSlugs']['personPlural'];
    $labels = [
      'name'              => _x( 'Research Highlights', 'taxonomy general name' ),
      'singular_name'     => _x( 'Research Highlight', 'taxonomy singular name' ),
      'search_items'      => __( 'Search Research Highlights' ),
      'all_items'         => __( 'All Research Highlights' ),
      'edit_item'         => __( 'Edit Research Highlight' ),
      'update_item'       => __( 'Update Research Highlight' ),
      'add_new_item'      => __( 'Add New Research Highlight' ),
      'new_item_name'     => __( 'New Research Highlight' ),
      'menu_name'         => __( 'Research Highlights' ),
    ];
    $args = [
      'labels' => $labels,
      'description' => 'Uncontrolled list of research highlights assigned to people',
      'public' => false,
      'publicly_queryable' => false,
      'hierarchical' => false,
      'show_ui' => true,
      'show_in_nav_menus' => false,
      'show_in_rest' => true,
      'capabilities' => [
        'manage_terms'  => $this->config['capabilities']['manage_directory'],
        'edit_terms'    => "edit_$people",
        'delete_terms'  => $this->config['capabilities']['manage_directory'],
        'assign_terms'  => "edit_$people"
      ],
    //   'show_admin_column' => true
    ];

    register_taxonomy(
      $this->slug,
      [$this->postType],
      $args
    );

  }

  // add to plugin admin menu
  public function add_to_menu(){
    $label = 'Research Highlights';
    add_submenu_page(
        $this->config['slug'],
        $label,
        $label,
        $this->config['capabilities']['manage_directory'],
        'edit-tags.php?taxonomy=' . $this->slug . '&post_type=' . $this->postType,
        false
    );
  }

    // expand plugin menu when on taxonomy admin page
    public function expand_parent_menu($parent_file){
        if(get_current_screen()->taxonomy === $this->slug){
            $parent_file = $this->config['slug'];
        }
        return $parent_file;
    }
}
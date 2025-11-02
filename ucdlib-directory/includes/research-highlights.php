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

    add_action( 'init', [$this, 'register_post_meta']);

    add_filter('ucdlib_directory_people_post_type', function($default){
      return $this->config['postSlugs']['person']; 
    });
    add_filter('ucdlib_directory_research_highlights_block_name', function($default){
      return 'ucdlib-directory/research-highlights';
    });
    add_filter('ucdlib_directory_research_highlights_meta_map', function($map){
      return [
        'hideResearchHighlights'=> 'hide_research_highlights'
      ];
    });
    add_filter('ucdlib_directory_research_highlights_insert_after', function($default){
      return 'ucdlib-directory/expertise-areas';
    });
    add_filter('ucdlib_directory_research_highlights_insert_position', function($default){
      return 'end';
    });
    add_filter('ucdlib/directory/research_highlights_default_attrs', function($attrs, $post_id){
      if (empty($attrs['expertId'])) $attrs['expertId'] = '';
      return $attrs;
    }, 10, 2);
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


  // register custom metadata for this post type
  public function register_post_meta() {
    // IMPORTANT: use the post type, not the taxonomy slug
    $post_type = $this->postType; // e.g. 'person'

    register_post_meta( $post_type, 'research_highlights_formatted', [
      'show_in_rest' => true,
      'single'       => true,
      'type'         => 'string',     // we'll save JSON.stringify([...]) from edit.js
      'default'      => '[]',         // make default consistent with sanitize
      'auth_callback'=> function() {  // adjust if you need to restrict
        return current_user_can('edit_posts');
      },
      'sanitize_callback' => function($v){
          $s = (string)$v;
          if ($s === '') return '[]';
          json_decode($s, true);
          return json_last_error() === JSON_ERROR_NONE ? $s : '[]';
        }
    ] );

    UCDLibPluginDirectoryUtils::registerContactMeta( $post_type );
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
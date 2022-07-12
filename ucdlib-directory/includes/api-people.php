<?php

class UCDLibPluginDirectoryAPIPeople {

  public function __construct( $config ){
    $this->config = $config;

    add_action( 'rest_api_init', array($this, 'register_endpoints') );
  }

  public function register_endpoints(){

    register_rest_route($this->config['slug'], 'people', array(
      'methods' => 'GET',
      'callback' => array($this, 'epcb_people'),
      'permission_callback' => function (){return true;}
    ) );

    register_rest_route($this->config['slug'], 'person/(?P<term>\S+)', array(
      'methods' => 'GET',
      'callback' => array($this, 'epcb_person'),
      'permission_callback' => function (){return true;},
      'args' => [        
        'field' => [
          'description' => 'The type of term being used for query',
          "type" => "string",
          "default" => "email",
          'enum' => ["email", "kerberos"]
        ]
      ]
    ) );
  }

  // endpoint for looking up a single person
  public function epcb_person( $request ) {
    $term = $request['term'];
    $field = $request['field'];
    $profile = false;
    $userFields = [
      'email' => 'email',
      'kerberos' => 'login'
    ];

    // check if user account exists
    $user = get_user_by( $userFields[$field], $term );
    if ( $user ) {
      $profileFields = [
        ['user' => $user->ID, 'profile' => 'wp_user_id'],
        ['user' => $user->user_login, 'profile' => 'username']
      ];
      
      foreach ($profileFields as $fields) {
        $profiles = Timber::get_posts([
          'post_type' =>$this->config['postSlugs']['person'],
          'meta_key' => $fields['profile'],
          'meta_value' => $fields['user'],
          'posts_per_page' => 1
        ]);
        if ( count($profiles) ){
          $profile = $profiles[0];
          break;
        }
      }
    }

    // Does not have a user account
    if ( !$profile ){
      if ( $field == 'email' ) {
        $profiles = Timber::get_posts([
          'post_type' =>$this->config['postSlugs']['person'],
          'meta_key' => 'contactEmail',
          'meta_value' => $term,
          'meta_compare' => 'LIKE',
          'posts_per_page' => 1
        ]);
        if ( count($profiles) ){
          $emails = $profiles[0]->meta('contactEmail');
          foreach ($emails as $email) {
            if ( array_key_exists('value', $email) && $email['value'] == $term ){
              $profile = $profiles[0];
              break;
            }
          }
        }
      } elseif( $field == 'kerberos' ){
        $profiles = Timber::get_posts([
          'post_type' =>$this->config['postSlugs']['person'],
          'meta_key' => 'username',
          'meta_value' => $term,
          'posts_per_page' => 1
        ]);
        if ( count($profiles) ){
          $profile = $profiles[0];
        }
      }
    }

    if ( !$profile ){
      return new WP_Error( 'rest_not_found', 'This person does not exist.', array( 'status' => 404 ) );
    }

    
    $out = [
      'id' => $profile->ID,
      'nameLast' => $profile->name_last(),
      'nameFirst' => $profile->name_first(),
      'link' => $profile->link(),
      'contactWebsite' => $profile->meta('contactWebsite'),
      'contactEmail' => $profile->meta('contactEmail'),
      'contactPhone' => $profile->meta('contactPhone'),
      'contactAppointmentUrl' => $profile->meta('contactAppointmentUrl'),
      'positionTitle' => $profile->meta('position_title')
    ];

    $pic = $profile->thumbnail();
    if ( $pic ) {
      $out['photo'] = ['id' => $pic->ID, 'link' => $pic->src()];
    } else {
      $out['photo'] = new ArrayObject();
    }

    $dept = $profile->department();
    if ( $dept ) {
      $out['department'] = [
        'id' => $dept->ID,
        'title' => $dept->title()
      ];
    } else {
      $out['department'] = new ArrayObject();
    }

    return rest_ensure_response($out);

  }

  // Endpoint callback for a single exhibit page
  public function epcb_people($request){

    $posts = Timber::get_posts( [
      'post_type' => $this->config['postSlugs']['person'],
      'posts_per_page' => -1
    ] );

    $out = [];
    foreach ($posts as $post) {
      $out[] = [
        'id' => $post->id,
        'name_last' => $post->name_last(),
        'name_first' => $post->name_first()
      ];
    }
    
    return rest_ensure_response($out);
  }
  
}
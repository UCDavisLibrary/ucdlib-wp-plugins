<?php

class UCDLibPluginDirectoryAPIPeople {

  public $config;

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
          'enum' => ["email", "kerberos", "uid", 'pid']
        ]
      ]
    ) );

    register_rest_route($this->config['slug'], 'research-highlights/(?P<id>[^/]+)', array(
      'methods' => 'GET',
      'callback' => array($this, 'epcb_research_highlights'),
      'permission_callback' => function (){return true;}
    ) );
  }

  public function epcb_research_highlights($request){
    $expertId = $request['id'];
    $out = [];

    $url = 'https://experts.ucdavis.edu/api/expert/' . rawurlencode($expertId);
    $response = wp_remote_get($url, ['timeout' => 20]);

    if ( is_wp_error( $response ) ) {
      return new WP_Error( 'rest_not_found', 'This research highlights does not exist.', array( 'status' => 404 ) );
    }

    $resp = json_decode(wp_remote_retrieve_body( $response ), true);

    $graph_unfiltered = is_array($resp) && isset($resp['@graph'])
      ? $resp['@graph']
      : (isset($resp->{'@graph'}) ? $resp->{'@graph'} : []);

    $graph = array_values(array_filter($graph_unfiltered , function ($item) {
      $types = is_array($item['@type']) ? $item['@type'] : [$item['@type']];
      foreach ($types as $t) {
        if (is_string($t) && strcasecmp($t, 'Work') === 0) {
          return true;
        }
      }
    }));

    $favourites = array_filter($graph, function($item) {
      if (!is_array($item)) {
        return false;
      }

      if (array_key_exists('ucdlib:favourite', $item) && $item['ucdlib:favourite'] === true) {
        return true;
      }     
        
      if (!isset($item['relatedBy']) || !is_array($item['relatedBy'])) {
        return false;
      }

      $related = $item['relatedBy'];

      if (is_array($related) && array_key_exists('ucdlib:favourite', $related)) {
        return $related['ucdlib:favourite'] === true;
      }

      if (is_array($related) && array_is_list($related)) {
        foreach ($related as $rel) {
          if (is_array($rel) && array_key_exists('ucdlib:favourite', $rel)) {
            if ($rel['ucdlib:favourite'] === true) {
              return true;
            }
          }
        }
      }
      return false;
    });

    if(count($favourites) === 0){
      $favourites = array_slice($graph, 0, 3);
    } else {
      $favourites = array_slice($favourites, 0, 3);
    }
      

    $out = array_values(array_map(function($item) {
      return [
        'id'             => $item['@id']             ?? '',
        'type'           => $item['type']           ?? [],
        'volume'         => $item['volume']          ?? '',
        'author'         => $item['author']          ?? [],
        'issn'           => $item['ISSN']            ?? '',
        'eissn'          => $item['eissn']           ?? '',
        'abstract'       => $item['abstract']        ?? '',
        'title'          => $item['title']           ?? '',
        'url'            => $item['url']             ?? '',
        'issuedDate'     => $item['issued']          ?? '',
        'status'         => $item['status']          ?? '',
        'containerTitle' => $item['container-title']  ?? '',
        'publication'    => $item['hasPublicationVenue']['name']     ??  '',
        'publisher'      => $item['publisher']       ?? '',
        'page'           => $item['page']            ?? '',
      ];
    }, $favourites));
    
    return rest_ensure_response( $favourites );
  }
  
  // endpoint for looking up a single person
  public function epcb_person( $request ) {
    $term = $request['term'];
    $field = $request['field'];
    $profile = false;
    $userFields = [
      'email' => 'email',
      'kerberos' => 'login',
      'uid' => 'id'
    ];

    // check if user account exists
    if ( in_array($field, array_keys($userFields))){
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
      } elseif ( $field == 'pid' ){
        $pid = intval($term);
        if ( $pid ){
          $profile = Timber::get_post($pid);
        }
      }
    }

    if ( !$profile ){
      return new WP_Error( 'rest_not_found', 'This person does not exist.', array( 'status' => 404 ) );
    }

    $out = [
      'id' => $profile->ID,
      'uid' => $profile->user() ? $profile->user()->ID : null,
      'email' => $profile->email(),
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

    // keep for backwards compatibility
    // remove when person teaser brand element is updated
    $dept = $profile->department();
    if ( $dept ) {
      $out['department'] = [
        'id' => $dept->ID,
        'title' => $dept->title()
      ];
    } else {
      $out['department'] = new ArrayObject();
    }

    $out['departments'] = [];
    $depts = $profile->departments();
    foreach ($depts as $dept) {
      $out['departments'][] = [
        'id' => $dept->ID,
        'title' => $dept->title()
      ];
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

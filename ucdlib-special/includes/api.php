<?php
class UCDLibPluginSpecialAPI {

  public function __construct( $config ){
    $this->config = $config;
    add_action( 'rest_api_init', array($this, 'register_endpoints') );
  }

  public function register_endpoints(){
    register_rest_route($this->config['slug'], 'collection', array(
      'methods' => 'GET',
      'callback' => array($this, 'collections'),
      'permission_callback' => function (){return true;}
    ) );
    register_rest_route($this->config['slug'], 'collection/(?P<id>\d+)', array(
        'methods' => 'GET',
        'callback' => array($this, 'collection'),
        'permission_callback' => function (){return true;}
    ) );
    register_rest_route($this->config['slug'], 'collection_pnx/(?P<id>\d+)', array(
        'methods' => 'GET',
        'callback' => array($this, 'collection_pnx'),
        'permission_callback' => function (){return true;}
      ) );
  }

  // Endpoint callback for collections
  public function collections($request){
    $fields = $request['fields'];


    $collections = Timber::get_posts( [
      'post_type' => $this->config['postTypeSlug'],
      'orderby' => 'menu_order',
      'order' => 'ASC',
      'nopaging' => true,
    ] );

    return new WP_REST_Response($collections);


    // return rest_ensure_response($out);
  }


  // Endpoint callback for a single collection
  public function collection($request){
    $fields = $request['fields'];
    $collectionId = $request['id'];


    $collection = Timber::get_posts( [
      'post_type' => $this->config['postTypeSlug'],
      'p' => $collectionId
    ] );

    if ( !$collection->found_posts ) {
      return new WP_Error( 'rest_not_found', 'This location does not exist.', array( 'status' => 404 ) );
    }


    return new WP_REST_Response($collection);


    // return rest_ensure_response($out);
  }

  // Endpoint callback for the PNX that is changes
  public function collection_pnx($request){
    $collectionId = $request['id'];

    $url = 'https://search.library.ucdavis.edu/primaws/rest/pub/pnxs/undefined/alma' . $collectionId . '?vid=01UCD_INST:UCD&lang=en';
    $response = wp_remote_get( $url );
    $outPnx = json_decode(wp_remote_retrieve_body( $response ), true);

    $out = array(
      "callNumber" => $outPnx["delivery"]["holding"][0]["callNumber"],
      "title" => $outPnx["pnx"]["display"]["title"], 
      "date" => array_key_exists("creationdate", $outPnx["pnx"]["display"]) ? $outPnx["pnx"]["display"]["creationdate"]  : null,
      "author" => array_key_exists("au", $outPnx["pnx"]["addata"]) ? $outPnx["pnx"]["addata"]["au"]  : null,
      "corp" =>  array_key_exists("aucorp", $outPnx["pnx"]["addata"]) ? $outPnx["pnx"]["addata"]["aucorp"]  : null,
      "featuredImage" => null,
      "extent" => array_key_exists("format", $outPnx["pnx"]["display"]) ? $outPnx["pnx"]["display"]["format"]  : null,
      "findingAid" => null,
      "description" => array_key_exists("description", $outPnx["pnx"]["display"]) ? $outPnx["pnx"]["display"]["description"]  : null,
      "history" => null,
      "almaRecordId" => $collectionId,
      "tags" => array_key_exists("subject", $outPnx["pnx"]["display"]) ? $outPnx["pnx"]["display"]["subject"]  : null,
      "links" => array_key_exists("link", $outPnx["delivery"]) ? $outPnx["delivery"]["link"]  : null,
    );

    $out = json_encode($out);
  
    return rest_ensure_response( json_decode($out));

  }
  
}
<?php

class UCDLibPluginSearchConfig {

  public $slug = "ucdlib-search";

  public $facets = [
    [
      'documentType' => ['post'],
      'label' => 'Library News',
      'labelPlural' => 'Library News',
      'source' => 'wordpress',
      'urlArg' => 'news',
      'defaultImage' => 'search-news.jpg',
      'showByline' => true
    ],
    [
      'documentType' => ['page', 'library'],
      'label' => 'Information Page',
      'labelPlural' => 'Information Pages',
      'source' => 'wordpress',
      'urlArg' => 'info-page',
      'defaultImage' => 'search-informationpages.jpg'
    ],
    [
      'documentType' => ['libguide'],
      'label' => 'Research Guide',
      'labelPlural' => 'Research Guides',
      'source' => 'libguides',
      'urlArg' => 'research-guide',
      'defaultImage' => 'search-researchguides.jpg'
    ],
    [
      'documentType' => ['database'],
      'label' => 'Database',
      'labelPlural' => 'Databases',
      'source' => 'libguides',
      'urlArg' => 'database',
      'defaultImage' => 'search-databases.jpg'
    ],
  ];

  public $sortOptions = [
    [
      'urlArg' => 'relevance',
      'label' => 'Relevance',
      'es' => false,
      'default' => true
    ],
    [
      'urlArg' => 'date',
      'label' => 'Date',
      'es' => ['sortByDate' => ['order' => 'desc', 'format' => 'strict_date_optional_time_nanos']],
      'default' => false
    ],
  ];

  public $menuTitle = 'UCD Library Search';
  public $menuTitleSlug = 'ucd-library-search';

  public function __construct(){
    $this->entryPoint = plugin_dir_path( __DIR__ ) . $this->slug . '.php';
    // Get version number from entrypoint doc string
    $plugin_metadata = get_file_data( $this->entryPoint, array(
      'Version' => 'Version'
    ) );
    if ( ! empty( $plugin_metadata['Version'] ) ) {
      $this->version = $plugin_metadata['Version'];
    }

    $this->elasticsearch = [
      "host" => getenv('ELASTIC_SEARCH_HOST') ? getenv('ELASTIC_SEARCH_HOST') : 'elasticsearch',
      "port" => getenv('ELASTIC_SEARCH_PORT') ? getenv('ELASTIC_SEARCH_PORT') : '9200',
      "username" => getenv('ELASTIC_SEARCH_USERNAME') ? getenv('ELASTIC_SEARCH_USERNAME') : 'elastic',
      "password" => getenv('ELASTIC_SEARCH_PASSWORD') ? getenv('ELASTIC_SEARCH_PASSWORD') : 'changeme',
      "requestTimeout" => getenv('ELASTIC_SEARCH_REQUEST_TIME') ? getenv('ELASTIC_SEARCH_REQUEST_TIME') : 3*60*1000,
      "indexAlias" => 'main-website',
      "fields" => [
        "exclude" => ['_'],
      ]
    ];
  }

  public function getFacet($value, $by='urlArg'){
    foreach ($this->facets as $facet) {
      if ( $by == 'documentType' && in_array($value, $facet[$by])) {
        return $facet;
      }
      elseif ( $facet[$by] === $value ) {
        return $facet;
      }
    }
    return false;
  }

  public function getSortOption($value, $by='urlArg'){
    foreach ($this->sortOptions as $o) {
      if ( $o[$by] === $value ){
        return $o;
      }
    }
    return false;
  }

  protected $teaserImageUrl;
  public function teaserImageUrl(){
    if ( ! empty( $this->teaserImageUrl ) ) {
      return $this->teaserImageUrl;
    }
    $this->teaserImageUrl = trailingslashit( plugins_url() ) . "$this->slug/assets/teaser-images/";
    return $this->teaserImageUrl;
  }

}
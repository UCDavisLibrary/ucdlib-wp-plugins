<?php

class UCDLibPluginAssetsRobots {

  public function __construct(){
    $this->site_url = get_site_url();
    $this->prodUrl = 'https://library.ucdavis.edu';
    $this->isProd =  $this->site_url == $this->prodUrl;

    add_filter('robots_txt', [$this, 'interceptRobotsTxt'], 10, 2);
    add_filter( 'wp_robots', [$this, 'robotsMeta'], 100 );

    // remove default wordpress behavior
    remove_filter('wp_robots', 'wp_robots_max_image_preview_large');
  }

  /**
   * Dynamically generates robots.txt
   * By default, don't allow indexing
   * Turn on for production site
   */
  public function interceptRobotsTxt( $output, $public ) {

    // TODO: remove this part after google has reindex our dev sites
    $output = "User-agent: *\nDisallow: /wp-admin/\nAllow: /wp-admin/admin-ajax.php\n\n";
    $output .= "Sitemap: $this->site_url/wp-sitemap.xml";
    return $output;

    if ( $this->isProd ) {
      $output = "User-agent: *\nDisallow: /wp-admin/\nAllow: /wp-admin/admin-ajax.php\n\n";
      $output .= "Sitemap: $this->prodUrl/wp-sitemap.xml";
    } else {
      $output = "User-agent: *\nDisallow: /\n";
    }

    return $output;
  }

  /**
   * Generates the <meta name='robots'> tag
   */
  public function robotsMeta($robots){
    if ( $this->isProd ){
      $robots = ['all' => true];
    } else {
      $robots = [
        'noindex' => true,
        'nofollow' => true
      ];
    }
    return $robots;
  }

  
}
<?php

class UCDLibPluginAssetsRobots {

  public function __construct(){
    add_filter('robots_txt', [$this, 'interceptRobotsTxt'], 10, 2);
  }

  /**
   * Dynamically generates robots.txt
   * By default, don't allow indexing
   * Turn on for production site
   */
  public function interceptRobotsTxt( $output, $public ) {

    $site_url = get_site_url();
    if ( $site_url == 'https://library.ucdavis.edu') {
      $output = "User-agent: *\nDisallow: /wp-admin/\nAllow: /wp-admin/admin-ajax.php\n\n";
      $output .= "Sitemap: https://library.ucdavis.edu/wp-sitemap.xml";
    } else {
      $output = "User-agent: *\nDisallow: /\n";
    }
    

    return $output;
  }

  
}
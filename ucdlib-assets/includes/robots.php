<?php

class UCDLibPluginAssetsRobots {

  public $site_url;
  public $prodUrl;
  public $isProd;

  public function __construct(){
    $this->site_url = get_site_url();
    $this->prodUrl = 'https://library.ucdavis.edu';
    $this->isProd =  $this->site_url == $this->prodUrl;

    add_filter('robots_txt', [$this, 'interceptRobotsTxt'], 10, 2);
    add_filter( 'wp_robots', [$this, 'robotsMeta'], 100 );
    add_action('wp_head', [$this, 'addGoogleSiteVerificationMetaTag'], 1);

    // remove default wordpress behavior
    remove_filter('wp_robots', 'wp_robots_max_image_preview_large');
  }

  /**
   * Dynamically generates robots.txt
   * Always allow robots since we're using the <meta name='robots'> tag to control indexing
   */
  public function interceptRobotsTxt( $output, $public ) {

    $output = "User-agent: *\nDisallow: /wp-admin/\nAllow: /wp-admin/admin-ajax.php\n\n";
    $output .= "Sitemap: $this->prodUrl/wp-sitemap.xml";

    return $output;
  }

  /**
   * Generates the <meta name='robots'> tag
   */
  public function robotsMeta($robots){
    if ( !$this->isProd ){
      $robots = [
        'noindex' => true,
        'nofollow' => true,
        'follow' => false,
        'index' => false
      ];
    }
    return $robots;
  }

  public function addGoogleSiteVerificationMetaTag(){
    if ( $this->isProd ){
      echo '<meta name="google-site-verification" content="-MjSr0vNihRH6zivp9DzzmZrApJZBOIpHS1OZ0lHEng" />';
      echo "\n";
    }
  }
}

<?php

/**
 * Wrapper class for an elasticsearch document "hit"
 */
class UCDLibPluginSearchDocument {

  public $config;
  public $document;
  public $post;
  public $type;
  public $hasHighlight;

  public function __construct($document, $config){
    $this->config = $config;
    $this->document = $document;

    $this->hasHighlight = array_key_exists('highlight', $document);

    $this->type = $this->config->getFacetFromDocument($document);
    if ( $this->type['source'] == 'wordpress' ){
      $this->post = Timber::get_post($document['_source']['id']);
    } else {
      $this->post = null;
    }
  }

  protected $image;
  public function image(){
    if ( ! empty( $this->image ) ) {
      return $this->image;
    }
    $image = false;
    $base_url = $this->config->teaserImageUrl();

    if ( $this->post && $this->post->teaser_image() ){
      $image = $this->post->teaser_image()->src('thumbnail');
    } else {
      $image = $base_url . $this->type['defaultImage'];
    }
    $this->image = $image;
    return $this->image;
  }

  public function title(){
    return $this->document['_source']['title'];
  }

  public function highlight(){
    if ( !$this->hasHighlight ) return '';
    if( array_key_exists('content', $this->document['highlight']) ) {
      return $this->document['highlight']['content'][0];
    }
    if( array_key_exists('description', $this->document['highlight']) ) {
      return $this->document['highlight']['description'][0];
    }
    if( array_key_exists('altTitles', $this->document['highlight']) ) {
      return $this->document['highlight']['altTitles'][0];
    }
    if( array_key_exists('tags.text', $this->document['highlight']) ) {
      return 'Tag: '.$this->document['highlight']['tags.text'][0];
    }

    return '';
  }

  public function link(){
    if ( $this->post ){
      return $this->post->link();
    }
    if ( isset($this->document['_source']['link']) ) {
      return $this->document['_source']['link'];
    }
    return $this->document['_source']['id'];
  }

  public function excerpt(){
    $words = 25;
    $postExcept = $this->post ? trim($this->post->excerpt(['words' => $words])) : '';
    if ( $postExcept ){
      return $postExcept;
    }
    if ( !array_key_exists('content', $this->document['_source'])) return '';
    $content = $this->document['_source']['content'];
    if ( is_array($content) ){
      $content = implode(' ', $content);
    }
    if ( !$content ) return '';
    $content = explode(' ', $content);
    return implode(' ', array_slice($content, 0, $words));
  }

  protected $showAuthor;
  public function showAuthor(){
    if ( ! empty( $this->showAuthor ) ) {
      return $this->showAuthor;
    }

    if (
      $this->author() &&
      $this->post &&
      $this->post->post_type == 'post' &&
      !$this->post->meta('ucd_hide_author')
      ) {
        $this->showAuthor = true;
      } else {
        $this->showAuthor = false;
      }
    return $this->showAuthor;
  }

  public function showPublishedDate(){
    if ( $this->post && $this->post->post_type == 'post' ){
      return true;
    }
    return false;
  }

  public function date(){
    if ( $this->post ) return $this->post->date();
    return "";
  }

  protected $author;
  public function author(){
    if ( ! empty( $this->author ) ) {
      return $this->author;
    }
    if ( $this->post && $this->post->author() ){
      $this->author = $this->post->author();
    } else {
      $this->author = false;
    }
    return $this->author;
  }

  protected $additionalAuthors;
  public function additionalAuthors(){
    if ( ! empty( $this->additionalAuthors ) ) {
      return $this->additionalAuthors;
    }
    $this->additionalAuthors = [];
    if ( $this->post && $this->post->additional_authors() ){
      $this->additionalAuthors = $this->post->additional_authors();
    }
    return $this->additionalAuthors;
  }

  protected $hideOgAuthor;
  public function hideOgAuthor(){
    if ( ! empty( $this->hideOgAuthor ) ) {
      return $this->hideOgAuthor;
    }
    if ( $this->post && $this->post->hide_og_author() ){
      $this->hideOgAuthor = $this->post->hide_og_author();
    } else {
      $this->hideOgAuthor = false;
    }
    return $this->hideOgAuthor;
  }
}

<?php

/**
 * Class Forminator_Addon_Rt_Api
 *
 * @since 1.0 Rt Addon
 */
class Forminator_Addon_Rt_Api {

  public function __construct($host, $secret, $defaultQueue=''){
    $this->host = trailingslashit($host);
    $this->defaultQueue = $defaultQueue;
    $this->secret = $secret;
    $this->path = 'REST/2.0';
  }

  public function postTicketUrl(){
    return $this->host . $this->path . '/ticket';
  }

  public function createTicket($data=[]){
    if ( !array_key_exists('Queue', $data) || empty($data['Queue']) ) {
      $data['Queue'] = $this->defaultQueue;
    }
    if ( !array_key_exists('ContentType', $data) || empty($data['ContentType']) ) {
      $data['ContentType'] = 'text/html';
    }

    $r = wp_remote_post(
      $this->postTicketUrl(),
      ['headers' => ['Authorization' => 'token ' . $this->secret, 'Content-Type' => 'application/json' ],
       'body' => wp_json_encode($data),
       'data_format' => 'body'
      ]
    );
    return $r;
  }

  public function formToContent($submitted_data){
    $content = '';
    foreach($submitted_data as $field){
      $content .= "<b>{$field['field_label']}</b>: {$field['field_value']}<br>";
    }
    return $content;

  }
}

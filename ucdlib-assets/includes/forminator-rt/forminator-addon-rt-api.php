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
    $this->_ticketCreationResponses = [];
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
       'blocking'    => true,
       'data_format' => 'body'
      ]
    );
    $this->_ticketCreationResponses[] = $r;
    return $r;
  }

  public function getTicket($id){
    $url = trailingslashit($this->postTicketUrl()) . $id;
    $r = wp_remote_get(
      $url,
      ['headers' => ['Authorization' => 'token ' . $this->secret]]
    );
    return $r;
  }

  public function getLastTicketCreated($returnCreationResponse=false){
    if ( empty($this->_ticketCreationResponses) ) return null;
    $r = end($this->_ticketCreationResponses);
    if ( is_wp_error($r) || wp_remote_retrieve_response_code($r) != 201 ) return null;
    $decoded = json_decode(wp_remote_retrieve_body($r), true);
    if ( $returnCreationResponse ) {
      return $decoded;
    }
    try {
      $ticket = $this->getTicket($decoded['id']);
      if ( is_wp_error($ticket) ) {
        throw new \Exception("Error retrieving ticket {$decoded['id']}. Error: " . $ticket->get_error_message());
      }
      if ( wp_remote_retrieve_response_code($ticket) != 200 ) {
        throw new \Exception("Error retrieving ticket {$decoded['id']}. Response code: " . wp_remote_retrieve_response_code($ticket));
      }
      return json_decode(wp_remote_retrieve_body($ticket), true);
    } catch (\Throwable $th) {
      forminator_addon_maybe_log( __METHOD__, $th->getMessage() );
      return null;
    }
    return null;

  }

  public function formToContent($submitted_data){
    $content = '';
    foreach($submitted_data as $field){
      $content .= "<b>{$field['field_label']}</b>: {$field['field_value']}<br>";
    }
    return $content;

  }
}

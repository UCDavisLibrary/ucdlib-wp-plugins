<?php

require_once dirname( __FILE__ ) . '/forminator-addon-rt-api.php';

class Forminator_Addon_Rt_Form_Hooks extends Forminator_Addon_Form_Hooks_Abstract {
  /**
	 * Forminator_Addon_Rt_Form_Hooks constructor.
	 *
	 * @since 1.0 Rt Addon
	 *
	 * @param Forminator_Addon_Abstract $addon
	 * @param                           $form_id
	 *
	 * @throws Forminator_Addon_Exception
	 */
	public function __construct( Forminator_Addon_Abstract $addon, $form_id ) {
		parent::__construct( $addon, $form_id );
		$this->_submit_form_error_message = __( 'Failed to create an RT ticket for your form submission! Please try again later.', 'forminator' );
    $this->ticketCreatedResponse = [];
	}

  public function on_form_submit( $submitted_data ) {
    $addon_slug = $this->addon->get_slug();
		$form_id = $this->form_id;
    $form = $this->custom_form;
    $form_fields = $this->form_settings_instance->get_form_fields();
    $is_success = true;

    $rt_host = $this->addon->get_rt_host();
    $rt_secret= $this->addon->get_rt_secret();
    $form_settings = $this->form_settings_instance->get_form_settings_values();
    $queue = $form_settings['queue'];
    $rt_api = new Forminator_Addon_Rt_Api( $rt_host, $rt_secret, $queue );

    // combine submitted data with form fields
    $submitted_form = [];
    foreach ( $form_fields as $form_field ) {
      $element_id  = $form_field['element_id'];
			$field_type  = $form_field['type'];
			$field_label = $form_field['field_label'];

      // todo: figure this out. The slack addon does some special handingling of postdata fields
      if ( stripos( $field_type, 'postdata' ) !== false ) continue;

      $field_value = forminator_addon_replace_custom_vars( '{' . $element_id . '}', $submitted_data, $this->custom_form, [], false );
      $submitted_form[] = [
        'element_id' => $element_id,
        'field_type' => $field_type,
        'field_label' => $field_label,
        'field_value' => $field_value,
      ];
    }

    $errorMsg = '';
    try {
      $ticket_subject = "New Submission from {$form->name}";
      $data = [
        'Subject' => $ticket_subject,
        'Content' => $rt_api->formToContent( $submitted_form ),
      ];
      $r = $rt_api->createTicket($data);
      if ( is_wp_error($r) ) {
        $is_success = false;
        forminator_addon_maybe_log( __METHOD__, $r->get_error_message() );
      } else if(wp_remote_retrieve_response_code($r) != 201){
        $is_success = false;
        forminator_addon_maybe_log( __METHOD__, wp_remote_retrieve_response_message($r) );
      }
      $this->ticketCreatedResponse = json_decode(wp_remote_retrieve_body($r), true);
    } catch (\Throwable $th) {
      $is_success = false;
      forminator_addon_maybe_log( __METHOD__, $th->getMessage() );
    }
    if ( $is_success === false ) {
      $is_success = $this->_submit_form_error_message;
    }

    return $is_success;
  }

  public function add_entry_fields( $submitted_data ) {
    $out = [
      [
        'name'  => 'rt_test',
        'value' => $this->ticketCreatedResponse,
      ],
    ];
    if ( !empty($this->ticketCreatedResponse) ){
      $out[] = [
        'name'  => 'rt_ticket_id',
        'value' => $this->ticketCreatedResponse['id'],
      ];
    }
    return $out;
  }
}

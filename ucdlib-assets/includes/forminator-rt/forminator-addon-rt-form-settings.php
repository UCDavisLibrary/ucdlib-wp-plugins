<?php

class Forminator_Addon_Rt_Form_Settings extends Forminator_Addon_Form_Settings_Abstract {
  protected $addon;

  public function __construct( Forminator_Addon_Abstract $addon, $form_id ) {
    parent::__construct( $addon, $form_id );
  }

  public function form_settings_wizards() {
		// numerical array steps.
		return array(
			array(
				'callback'     => array( $this, 'pick_queue' ),
				'is_completed' => array( $this, 'pick_queue_is_completed' ),
			),
		);
	}

  public function pick_queue($submitted_data){
    $template = forminator_addon_rt_dir() . 'views/form-settings/pick-queue.php';
    $settings = $this->get_form_settings_values();
    $has_errors = false;
    $buttons = [];
    $template_params = array(
			'queue' => isset( $settings['queue'] ) ? $settings['queue'] : '',
			'queue_error' => '',
			'queues' => $this->addon->get_queues_selected(),
		);
    $is_submit  = ! empty( $submitted_data );

    if ( $is_submit ) {
      if ( empty( isset($submitted_data['queue']) ? $submitted_data['queue'] : '' ) ) {
				$template_params['queue_error'] = __( 'Please select a queue', 'forminator' );
				$has_errors = true;
			}
    }

    $buttons['next']['markup'] = '<div class="sui-actions-right">' .
    Forminator_Addon_Abstract::get_button_markup( esc_html__( 'CONNECT', 'forminator' ), 'forminator-addon-next' ) .
    '</div>';

    return array(
			'html'       => Forminator_Addon_Abstract::get_template( $template, $template_params ),
			'buttons'    => $buttons,
			'redirect'   => false,
			'has_errors' => $has_errors,
		);

  }

  public function pick_queue_is_completed(){
    return false;
  }

}

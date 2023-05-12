<?php

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
		$this->_submit_form_error_message = __( 'RT failed to process submitted data. Please check your form and try again', 'forminator' );
	}
}

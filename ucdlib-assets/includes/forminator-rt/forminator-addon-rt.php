<?php

require_once dirname( __FILE__ ) . '/forminator-addon-rt-exception.php';

final class Forminator_Addon_Rt extends Forminator_Addon_Abstract {

	private static $_instance = null;
	/**
	 * Use this trait to mark this addon as PRO
	 */
	protected $_slug = 'rt';
	protected $_version = FORMINATOR_ADDON_RT_VERSION;
	protected $_min_forminator_version = '1.1';
	protected $_short_title = 'RT';
	protected $_title = 'Request Tracker (RT)';
	protected $_url = 'https://bestpractical.com/request-tracker';
	protected $_full_path = __FILE__;
	protected $_icon_x2 = '';
	protected $_image_x2 = '';
  protected $_position = 10;

  protected $rtApiPath = 'REST/2.0';

	public function __construct() {
		// late init to allow translation.
		$this->_description                = __( 'Create RT tickets on form submission', 'forminator' );
		$this->_activation_error_message   = __( 'Sorry but we failed to activate RT, don\'t hesitate to contact us', 'forminator' );
		$this->_deactivation_error_message = __( 'Sorry but we failed to deactivate RT, please try again', 'forminator' );

		$this->_update_settings_error_message = __(
			'Sorry, we failed to update settings, please check your form and try again',
			'forminator'
		);

    $this->_icon = forminator_addon_rt_assets_url() . 'rt.png';
    $this->_image = forminator_addon_rt_assets_url() . 'rt.png';
	}

	/**
	 * @return self|null
	 */
	public static function get_instance() {
		if ( is_null( self::$_instance ) ) {
			self::$_instance = new self();
		}

		return self::$_instance;
	}

	/**
	 * Flag for check if and addon connected (global settings suchs as api key complete)
	 *
	 * @return bool
	 */
	public function is_connected() {
		return false;
	}

  public function register_integration_sections() {
		return array(
			'authorize' => array( $this, 'authorize_page_callback' ),
		);
	}

	/**
	 * Flag for check if and addon connected to a form(form settings suchs as list name completed)
	 *
	 * @param $form_id
	 *
	 * @return bool
	 */
	public function is_form_connected( $form_id ) {
		return false;
	}

  public function is_settings_available() {
		return true;
	}

	/**
	 * Settings wizard
	 *
	 * @since 1.0 Slack Addon
	 * @return array
	 */
	public function settings_wizards() {
		return array(
			array(
				'callback'     => array( $this, 'setup_connection' ),
				'is_completed' => array( $this, 'setup_connection_is_completed' ),
      ),
      array(
				'callback'     => array( $this, 'pick_queues' ),
				'is_completed' => array( $this, 'rt_integration_complete' ),
			),
      array(
        'callback'     => array( $this, 'confirm_access' ),
				'is_completed' => array( $this, 'rt_integration_complete' ),
      )
		);
	}

	/**
	 * Setup connection wizard
	 *
	 * @since 1.0 Rt Addon
	 *
	 * @param $submitted_data
	 *
	 * @return array
	 */
	public function setup_connection( $submitted_data ) {
		$settings_values = $this->get_settings_values();
		$template = forminator_addon_rt_dir() . 'views/settings/setup-connection.php';

		$buttons = array();
		if ( $this->is_connected() ) {
			$buttons['disconnect']     = array(
				'markup' => self::get_button_markup( esc_html__( 'Disconnect', 'forminator' ), 'sui-button-ghost forminator-addon-disconnect' ),
			);
		}
    $buttons['next']['markup'] = '<div class="sui-actions-right">' .
										self::get_button_markup( esc_html__( 'Next', 'forminator' ), 'forminator-addon-next' ) .
										'</div>';

		$template_params = array(
			'rt_host'           => '',
			'rt_host_error'     => '',
			'rt_secret'         => '',
			'rt_secret_error'   => '',
			'error_message'       => '',
		);

		$has_errors = false;
		$is_submit  = ! empty( $submitted_data );

		foreach ( $template_params as $key => $value ) {
			if ( isset( $submitted_data[ $key ] ) ) {
				$template_params[ $key ] = $submitted_data[ $key ];
			} elseif ( isset( $settings_values[ $key ] ) ) {
				$template_params[ $key ] = $settings_values[ $key ];
			}
		}

		if ( empty( $template_params['rt_host'] ) ) {
			$saved_rt_host = $this->get_rt_host();
			if ( ! empty( $saved_rt_host ) ) {
				$template_params['rt_host'] = $saved_rt_host;
			}
		}

		if ( empty( $template_params['rt_secret'] ) ) {
			$saved_rt_secret = $this->get_rt_secret();

			if ( ! empty( $saved_rt_secret ) ) {
				$template_params['rt_secret'] = $saved_rt_secret;
			}
		}

		if ( $is_submit ) {
			$rt_host = isset( $submitted_data['rt_host'] ) ? $submitted_data['rt_host'] : '';
			$rt_secret = isset( $submitted_data['rt_secret'] ) ? $submitted_data['rt_secret'] : '';

			if ( empty( $rt_host ) ) {
				$template_params['rt_host_error'] = __( 'Please input valid RT host', 'forminator' );
				$has_errors = true;
			}

			if ( empty( $rt_secret ) ) {
				$template_params['rt_secret_error'] = __( 'Please input valid RT Secret', 'forminator' );
				$has_errors = true;
			}

			if ( ! $has_errors ) {
				// validate api.
				try {
					if ( $this->get_rt_host() !== $rt_host || $this->get_rt_secret() !== $rt_secret ) {
						$settings_values = array();
					}
					$settings_values['rt_host'] = $rt_host;
					$settings_values['rt_secret'] = $rt_secret;

					$this->save_settings_values( $settings_values );

				} catch ( Forminator_Addon_Rt_Exception $e ) {
					$template_params['error_message'] = $e->getMessage();
					$has_errors = true;
				}
			}
		}

		return array(
			'html'       => self::get_template( $template, $template_params ),
			'buttons'    => $buttons,
			'redirect'   => false,
			'has_errors' => $has_errors,
			'size'       => 'normal',
		);
	}

	/**
	 * Setup connection is complete
	 *
	 * @param $submitted_data
	 *
	 * @return bool
	 */
	public function setup_connection_is_completed( $submitted_data ) {

    $rt_host = $this->get_rt_host();
    $rt_secret = $this->get_rt_secret();

		if ( ! empty( $rt_host ) && ! empty( $rt_secret ) ) {
			return true;
		}

		return false;
	}

  public function pick_queues( $submitted_data ) {
    $settings_values = $this->get_settings_values();
		$template = forminator_addon_rt_dir() . 'views/settings/pick-queues.php';

		$buttons = [];
    $template_params = [];
    $has_errors = false;
    $is_submit  = ! empty( $submitted_data );

    $rt_host = $this->get_rt_host();
    $rt_secret = $this->get_rt_secret();

    if ( !$rt_host || !$rt_secret ) {
      $template_params['error_message'] = __( 'RT Host or secret is missing', 'forminator' );
      $has_errors = true;
      return array(
        'html'       => self::get_template( $template, $template_params ),
        'buttons'    => $buttons,
        'redirect'   => false,
        'has_errors' => $has_errors,
      );
    }
    try {
      $queuesUrl = trailingslashit( $rt_host ). $this->rtApiPath . '/queues/all?fields=Name&per_page=100';
      $r = wp_remote_get($queuesUrl, ['headers' => ['Authorization' => 'token ' . $rt_secret ]]);
      if ( is_wp_error($r) ) {
        $template_params['error_message'] = 'Error retrieving queues list: ' . $r->get_error_message();
        $has_errors = true;
      }
      else if (wp_remote_retrieve_response_code($r) == 200) {
        $queues = json_decode(wp_remote_retrieve_body($r), true);
        $queues = $queues['items'];
        $template_params['queues'] = $queues;
        $buttons['next']['markup'] = '<div class="sui-actions-right">' .
          self::get_button_markup( esc_html__( 'Next', 'forminator' ), 'forminator-addon-next' ) .
          '</div>';
      } else {
        $template_params['error_message'] = ['Error retrieving queues list'];
        $template_params['error_message'][] = 'Status code: ' . wp_remote_retrieve_response_code($r);
        $txt = wp_remote_retrieve_body($r);
        if ( $txt ) {
          $template_params['error_message'][] = 'Message: ' . $txt;
        }
        $has_errors = true;
      }
    } catch ( Forminator_Addon_Rt_Exception $e ) {
      $template_params['error_message'] = 'Error retrieving queues list:' . $e->getMessage();
      $has_errors = true;
    }
    $settings_values['test'] = $submitted_data;
    $this->save_settings_values( $settings_values );
    if ( $is_submit ) {
			$queues_selected = isset( $submitted_data['queues_selected'] ) ? $submitted_data['queues_selected'] : [];


			if ( empty( $queues_selected ) ) {
				$template_params['queues_selected_error'] = __( 'Please pick at least one queue', 'forminator' );
				$has_errors = true;
			}

			if ( ! $has_errors ) {
				// validate api.
				try {
					$settings_values['queues_selected'] = $queues_selected;

					$this->save_settings_values( $settings_values );

				} catch ( Forminator_Addon_Rt_Exception $e ) {
					$template_params['error_message'] = $e->getMessage();
					$has_errors = true;
				}
			}
		}


    return array(
			'html'       => self::get_template( $template, $template_params ),
			'buttons'    => $buttons,
			'redirect'   => false,
			'has_errors' => $has_errors,
		);
  }

  public function confirm_access( $submitted_data ) {
    $template = forminator_addon_rt_dir() . 'views/settings/confirm.php';
    $has_errors = false;
    $template_params = false;
    $buttons = [];
    $buttons['close'] = array(
      'markup' => self::get_button_markup( esc_html__( 'Close', 'forminator' ), 'forminator-addon-close forminator-integration-popup__close' ),
    );
    return array(
			'html'       => self::get_template( $template, $template_params ),
			'buttons'    => $buttons,
			'redirect'   => false,
			'has_errors' => $has_errors,
		);
  }

  public function rt_integration_complete( $submitted_data ) {
    $rt_host = $this->get_rt_host();
    $rt_secret = $this->get_rt_secret();
    $queues_selected = $this->get_queues_selected();

		if ( ! empty( $rt_host ) && ! empty( $rt_secret ) && ! empty( $queues_selected ) ) {
			return true;
		}

		return false;
  }

  public function authorize_page_callback( $query_args ) {
    $settings_values = $this->get_settings_values();
		$template = forminator_addon_rt_dir() . 'views/settings/authorize.php';

    $template_params = [
      'error_message' => '',
			'is_close'      => false,
    ];

    try {
      $template_params['is_close'] = true;
    } catch (Exception $e) {
      $template_params['error_message'] = $e->getMessage();
    }

    return self::get_template( $template, $template_params );
  }


  /**
	 * Get RT host
	 *
	 * @since 1.0 rt Addon
	 * @return string
	 */
	public function get_rt_host() {
		$settings_values = $this->get_settings_values();
		$rt_host = '';
		if ( isset( $settings_values ['rt_host'] ) ) {
			$rt_host = $settings_values ['rt_host'];
		} else {
      $settings = $this->get_rt_settings();
      if ( isset( $settings['rt_host'] ) ) {
				$rt_host = $settings['rt_host'];
			}
    }
		return $rt_host;
	}

  /**
	 * Get RT secret
	 *
	 * @since 1.0 rt Addon
	 * @return string
	 */
	public function get_rt_secret() {
		$settings_values = $this->get_settings_values();
		$rt_secret = '';
		if ( isset( $settings_values ['rt_secret'] ) ) {
			$rt_secret = $settings_values ['rt_secret'];
		} else {
      $settings = $this->get_rt_settings();
      if ( isset( $settings['rt_secret'] ) ) {
				$rt_secret = $settings['rt_secret'];
			}
    }
		return $rt_secret;
	}

  public function get_queues_selected(){
    $settings_values = $this->get_settings_values();
    $queues_selected = [];
    if ( isset( $settings_values ['queues_selected'] ) ) {
      $queues_selected = $settings_values ['queues_selected'];
    } else {
      $settings = $this->get_rt_settings();
      if ( isset( $settings['queues_selected'] ) ) {
				$queues_selected = $settings['queues_selected'];
			}
    }
    return $queues_selected;
  }

  /**
	 * Get rt settings while app is being connected
	 *
	 *
	 * @return array
	 */
	public function get_rt_settings() {
		$settings = get_option( $this->get_settings_options_name() );
		if ( ! empty( $settings ) ) {
			$slice_settings = array_slice( $settings, 0, 1 );
			$settings       = array_shift( $slice_settings );
		}

		return $settings;
	}
}

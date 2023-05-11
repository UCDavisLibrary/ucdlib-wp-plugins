<?php

//Direct Load
define( 'FORMINATOR_ADDON_RT_VERSION', '1.0' );

function forminator_addon_rt_url() {
	return trailingslashit( plugin_dir_url( __FILE__ ) );
}

function forminator_addon_rt_assets_url() {
	return trailingslashit( forminator_addon_rt_url() . 'assets' );
}

function forminator_addon_rt_dir() {
	return trailingslashit( dirname( __FILE__ ) );
}

add_action( 'forminator_addons_loaded', 'load_forminator_addon_rt' );
function load_forminator_addon_rt() {
	require_once dirname( __FILE__ ) . '/forminator-addon-rt.php';
	if ( class_exists( 'Forminator_Addon_Loader' ) ) {
		Forminator_Addon_Loader::get_instance()->register( 'Forminator_Addon_Rt' );
	}
}


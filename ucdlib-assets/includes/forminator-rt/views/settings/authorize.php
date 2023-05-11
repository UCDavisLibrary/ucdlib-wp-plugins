<?php
// defaults.
$vars = array(
	'auth_url' => ''
);
/** @var array $template_vars */
foreach ( $template_vars as $key => $val ) {
	$vars[ $key ] = $val;
}
?>

<div class="forminator-integration-popup__header">

	<h3 id="forminator-integration-popup__title" class="sui-box-title sui-lg" style="overflow: initial; white-space: normal; text-overflow: initial;">
		<?php
		/* translators: ... */
		echo esc_html( sprintf( __( 'Connect %1$s', 'forminator' ), 'RT' ) );
		?>
	</h3>

</div>

<p>hello world</p>

<div class="forminator-integration-popup__footer-temp">
  <a href="<?php echo esc_attr( $vars['auth_url'] ); ?>" target="_blank" class="sui-button sui-button-primary forminator-addon-connect forminator-integration-popup__close"><?php esc_html_e( 'Authorize', 'forminator' ); ?></a>
</div>

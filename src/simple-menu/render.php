<?php

use Timber\Timber;

$context = Timber::context( $attributes );

$extra = array();
if ( $attributes['horizontal'] ) {
	$extra['class'] = 'horizontal';
} else {
	$extra['class'] = 'vertical';
}

$context['wrapper_attributes'] = get_block_wrapper_attributes( $extra );
$context['selected_menu']      = Timber::get_menu( $attributes['menuLocation'] );

Timber::render( '@lohko/simple-menu/view.twig', $context );

<?php
/**
 * Render the simple menu block.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 *
 * @package Jcore\Lohko
 *
 * @var array $attributes Block attributes.
 */

namespace Jcore\Lohko;

use Timber\Timber;

$location = $attributes['menuLocation'] ?? '';
if ( '' === $location ) {
	return;
}

$nav_menu = Timber::get_menu( $location );
if ( null === $nav_menu ) {
	return;
}

$context = block_context(
	$attributes,
	array( 'class' => empty( $attributes['horizontal'] ) ? 'vertical' : 'horizontal' )
);

$context['selected_menu'] = $nav_menu;

Timber::render( '@lohko/simple-menu/view.twig', $context );

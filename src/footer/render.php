<?php
/**
 * Render the footer block.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 *
 * @package Jcore\Lohko
 *
 * @var array $attributes Block attributes.
 */

namespace Jcore\Lohko;

use Timber\Timber;

$context = block_context( $attributes );

$start_year = (int) ( $attributes['copyrightYear'] ?? 0 );
$years      = $start_year > 0 ? (string) $start_year : '';

if ( ! empty( $attributes['copyrightToCurrent'] ) ) {
	$current = gmdate( 'Y' );
	// Only show a range when the start year is set and is not the current year.
	$years = ( '' !== $years && $years !== $current ) ? "$years–$current" : $current;
}

$context['copyright_year'] = $years;

Timber::render( '@lohko/footer/view.twig', $context );

<?php
/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

namespace Jcore\Lohko;

use Timber\Timber;

$context        = timber_block_context( $attributes );
$copyright_year = $attributes['copyrightYear'] ? $attributes['copyrightYear'] : '';
if ( $attributes['copyrightToCurrent'] ) {
	if ( strlen( $copyright_year ) ) {
		$copyright_year .= ' - ';
	}
	$copyright_year .= gmdate( 'Y' );
}
$context['copyright_year'] = $copyright_year;

Timber::render( '@lohko/footer/view.twig', $context );

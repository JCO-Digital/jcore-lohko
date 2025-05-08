<?php
/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

namespace Jcore\Lohko;

use DateTime;

use Timber\Timber;

$context                = timber_block_context( $attributes );
$context['currentYear'] = ( new DateTime() )->format( 'Y' );


Timber::render( '@lohko/copyright-date/view.twig', $context );

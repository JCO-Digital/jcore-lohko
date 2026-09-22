<?php
/**
 * Render the copyright date block.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 *
 * @package Jcore\Lohko
 *
 * @var array $attributes Block attributes.
 */

namespace Jcore\Lohko;

use Timber\Timber;

$context                = block_context( $attributes );
$context['currentYear'] = gmdate( 'Y' );

Timber::render( '@lohko/copyright-date/view.twig', $context );

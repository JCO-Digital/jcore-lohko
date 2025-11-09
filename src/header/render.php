<?php
/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

namespace Jcore\Lohko;

use Timber\Timber;

$context = timber_block_context( $attributes );
Timber::render( '@lohko/header/view.twig', $context );

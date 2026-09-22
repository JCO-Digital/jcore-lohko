<?php
/**
 * Render the header block.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 *
 * @package Jcore\Lohko
 *
 * @var array  $attributes Block attributes.
 * @var string $content    Rendered inner blocks.
 */

namespace Jcore\Lohko;

use Timber\Timber;

$context = block_context( $attributes );

$location            = $attributes['menuLocation'] ?? '';
$context['nav_menu'] = '' === $location ? null : Timber::get_menu( $location );
$context['content']  = $content;

Timber::render( '@lohko/header/view.twig', $context );

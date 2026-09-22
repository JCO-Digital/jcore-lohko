<?php
/**
 * Render the navigation block.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 *
 * @package Jcore\Lohko
 *
 * @var array $attributes Block attributes.
 */

namespace Jcore\Lohko;

use Timber\Timber;

$location = $attributes['menuLocation'] ?? 'primary';

$context             = block_context( $attributes );
$context['nav_menu'] = Timber::get_menu( $location );

Timber::render( '@lohko/navigation/view.twig', $context );

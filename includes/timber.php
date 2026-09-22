<?php
/**
 * Timber helpers for block render templates.
 *
 * @package Jcore\Lohko
 */

namespace Jcore\Lohko;

use Timber\Timber;

defined( 'ABSPATH' ) || exit;

/**
 * Build the Timber context for a block render template.
 *
 * Uses the global context rather than `Timber::context()`, which resolves the
 * whole query and calls `setup()` on the post. That mutates the global post
 * data, which is not something a block render should do mid-loop.
 *
 * Attributes are merged in at the top level so templates can use `{{ myAttr }}`,
 * and are also exposed under `attributes` so a template can still reach an
 * attribute whose name collides with a context key such as `post` or `menu`.
 *
 * @param array $attributes         The block attributes.
 * @param array $wrapper_attributes Extra attributes for the block wrapper.
 *
 * @return array
 */
function block_context( array $attributes = array(), array $wrapper_attributes = array() ): array {
	$context = array_merge( Timber::context_global(), $attributes );

	$context['attributes']         = $attributes;
	$context['wrapper_attributes'] = get_block_wrapper_attributes( $wrapper_attributes );

	return $context;
}

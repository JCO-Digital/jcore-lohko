<?php
/**
 * Render the sliding menu block.
 *
 * Every menu level is rendered up front as its own flat panel, and the view
 * script only switches which panel is active.
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

$panels = array(
	array(
		'id'     => 'root',
		'parent' => null,
		'title'  => null,
		'link'   => null,
		'items'  => $nav_menu->get_items(),
	),
);

// Panel holding the current item, and the deepest panel holding an ancestor.
$current_panel  = null;
$ancestor_panel = null;
$ancestor_depth = -1;

$collect = function ( array $items, string $panel_id, int $depth ) use ( &$collect, &$panels, &$current_panel, &$ancestor_panel, &$ancestor_depth ) {
	foreach ( $items as $item ) {
		if ( ! empty( $item->current ) && null === $current_panel ) {
			$current_panel = $panel_id;
		}
		if ( ! empty( $item->current_item_ancestor ) && $depth > $ancestor_depth ) {
			$ancestor_panel = $panel_id;
			$ancestor_depth = $depth;
		}

		$children = $item->children();
		if ( empty( $children ) ) {
			continue;
		}

		$panels[] = array(
			'id'     => (string) $item->id,
			'parent' => $panel_id,
			'title'  => $item->title(),
			'link'   => $item->link(),
			'items'  => $children,
		);

		$collect( $children, (string) $item->id, $depth + 1 );
	}
};
$collect( $panels[0]['items'], 'root', 0 );

$start = $current_panel ?? $ancestor_panel ?? 'root';

$align = in_array( $attributes['buttonAlign'] ?? '', array( 'center', 'right' ), true ) ? $attributes['buttonAlign'] : 'left';

$context = block_context( $attributes, array( 'class' => 'is-button-align-' . $align ) );

$context['panels']                = $panels;
$context['menu_id']               = wp_unique_id( 'lohko-sliding-menu-' );
$context['button_label']          = '' !== ( $attributes['buttonLabel'] ?? '' ) ? $attributes['buttonLabel'] : __( 'Menu', 'lohko' );
$context['interactivity_context'] = wp_interactivity_data_wp_context(
	array(
		'isOpen'    => false,
		'start'     => $start,
		'current'   => $start,
		'previous'  => null,
		'direction' => 'forward',
	)
);

Timber::render( '@lohko/sliding-menu/view.twig', $context );

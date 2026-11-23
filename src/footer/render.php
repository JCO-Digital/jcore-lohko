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

// The logo set on the block (a path inside the active theme, or a full URL),
// or else the site logo (Customizer → Site Identity, or what the theme's
// get_custom_logo filter gives). WordPress's own link around the site logo is
// dropped: the footer links the logo to the front page itself.
$logo = trim( (string) ( $attributes['logo'] ?? '' ) );
$path = '' !== $logo && ! wp_http_validate_url( $logo ) ? get_theme_file_path( ltrim( $logo, '/' ) ) : '';
if ( '' !== $path && str_ends_with( strtolower( $path ), '.svg' ) && is_readable( $path ) ) {
	// An SVG in the theme is inlined, so a logo drawn with fill="currentColor"
	// takes the footer's text colour (in an <img> it would be black).
	// phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- A file in the active theme.
	$context['logo_svg']   = trim( (string) preg_replace( '#<\?xml[^>]*>#', '', file_get_contents( $path ) ) );
	$context['logo_label'] = '' !== trim( (string) ( $attributes['logoAlt'] ?? '' ) ) ? $attributes['logoAlt'] : get_bloginfo( 'name' );
} elseif ( '' !== $logo ) {
	$context['logo_url'] = wp_http_validate_url( $logo ) ? $logo : get_theme_file_uri( ltrim( $logo, '/' ) );
} else {
	$context['site_logo'] = trim( (string) preg_replace( '#</?a\b[^>]*>#i', '', get_custom_logo() ) );
}
$context['logo_link'] = home_url( '/' );

Timber::render( '@lohko/footer/view.twig', $context );

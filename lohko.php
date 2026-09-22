<?php
/**
 * Plugin Name:       JCORE Lohko
 * Description:       Default blocks used in JCORE 3.
 * Version:           1.0.0-beta.1
 * Requires at least: 6.8
 * Requires PHP:      8.2
 * Author:            J&Co Digital
 * Author URI:        https://jco.fi
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       lohko
 * Domain Path:       /languages
 *
 * @package Jcore\Lohko
 */

namespace Jcore\Lohko;

defined( 'ABSPATH' ) || exit;

require_once __DIR__ . '/includes/timber.php';

const BLOCK_DIR = __DIR__ . '/build';

/**
 * Register the Twig template locations for the blocks.
 *
 * Templates live next to their block source, so `@lohko/header/view.twig`
 * resolves whether the block is loaded from `src` or `build`.
 */
add_filter(
	'timber/locations',
	function ( $paths ) {
		$paths['lohko'] = array(
			__DIR__ . '/src',
			__DIR__ . '/twig',
		);

		return $paths;
	}
);

add_action( 'init', __NAMESPACE__ . '\\block_init' );
add_action( 'init', __NAMESPACE__ . '\\load_textdomain' );
add_filter( 'upload_mimes', __NAMESPACE__ . '\\add_rive_mime_type' );
add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\\set_script_translations' );
add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\\set_script_translations' );

/**
 * Register every block from the generated `blocks-manifest.php`.
 *
 * The manifest is written by `wp-scripts build --blocks-manifest`, and lets
 * WordPress register all block metadata in one pass instead of reading each
 * `block.json` from disk.
 *
 * @see https://make.wordpress.org/core/2025/03/13/more-efficient-block-type-registration-in-6-8/
 *
 * @return void
 */
function block_init(): void {
	$manifest = BLOCK_DIR . '/blocks-manifest.php';
	if ( ! file_exists( $manifest ) ) {
		return;
	}

	if ( function_exists( 'wp_register_block_types_from_metadata_collection' ) ) {
		wp_register_block_types_from_metadata_collection( BLOCK_DIR, $manifest );

		return;
	}

	// Fallback for hosts still on an older core than the plugin asks for.
	foreach ( array_keys( require $manifest ) as $block_type ) {
		register_block_type( BLOCK_DIR . '/' . $block_type );
	}
}

/**
 * Load the plugin translations.
 *
 * @return void
 */
function load_textdomain(): void {
	load_plugin_textdomain( 'lohko', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
}

/**
 * Point the block editor scripts at the plugin's translations.
 *
 * Reads the generated manifest rather than globbing and decoding every
 * `block.json` on each request.
 *
 * @return void
 */
function set_script_translations(): void {
	$manifest = BLOCK_DIR . '/blocks-manifest.php';
	if ( ! file_exists( $manifest ) ) {
		return;
	}

	$languages = plugin_dir_path( __FILE__ ) . 'languages';

	foreach ( require $manifest as $block ) {
		if ( empty( $block['name'] ) || empty( $block['textdomain'] ) ) {
			continue;
		}

		$prefix = str_replace( '/', '-', $block['name'] );
		foreach ( array( 'view-script', 'editor-script' ) as $suffix ) {
			$handle = "$prefix-$suffix";
			// Script modules are not handled by wp_set_script_translations().
			if ( wp_script_is( $handle, 'registered' ) ) {
				wp_set_script_translations( $handle, $block['textdomain'], $languages );
			}
		}
	}
}

/**
 * Allow Rive animation files to be uploaded.
 *
 * Only added when the Rive block is actually registered, so a site that does
 * not use it keeps the default upload restrictions.
 *
 * @param array $mimes Array of allowed mime types.
 *
 * @return array
 */
function add_rive_mime_type( $mimes ): array {
	if ( ! \WP_Block_Type_Registry::get_instance()->is_registered( 'lohko/rive-animation' ) ) {
		return $mimes;
	}

	$mimes['riv'] = 'application/riv';

	return $mimes;
}

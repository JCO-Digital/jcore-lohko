<?php
/**
 * Plugin Name:       JCORE Lohko
 * Description:       Template for default blocks used in JCORE 3.
 * Version: 0.5.0
 * Requires at least: 6.7
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

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

require_once __DIR__ . '/includes/timber.php';

/**
 * Lohko Plugin
 *
 * This plugin provides custom blocks using the WordPress block editor,
 * implements Timber/Twig templating for blocks, and uses the improved
 * block registration approach from WordPress 6.7/6.8.
 *
 * The plugin registers custom block locations for Timber and handles
 * conditional registration based on WordPress version.
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


/**
 * Registers the block using a `blocks-manifest.php` file, which improves the performance of block type registration.
 * Behind the scenes, it also registers all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://make.wordpress.org/core/2025/03/13/more-efficient-block-type-registration-in-6-8/
 * @see https://make.wordpress.org/core/2024/10/17/new-block-type-registration-apis-to-improve-performance-in-wordpress-6-7/
 */
function block_init() {
	/**
	 * Registers the block(s) metadata from the `blocks-manifest.php` and registers the block type(s)
	 * based on the registered block metadata.
	 * Added in WordPress 6.8 to simplify the block metadata registration process added in WordPress 6.7.
	 *
	 * @see https://make.wordpress.org/core/2025/03/13/more-efficient-block-type-registration-in-6-8/
	 */
	if ( function_exists( 'wp_register_block_types_from_metadata_collection' ) ) {
		wp_register_block_types_from_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );
		return;
	}

	/**
	 * Registers the block(s) metadata from the `blocks-manifest.php` file.
	 * Added to WordPress 6.7 to improve the performance of block type registration.
	 *
	 * @see https://make.wordpress.org/core/2024/10/17/new-block-type-registration-apis-to-improve-performance-in-wordpress-6-7/
	 */
	if ( function_exists( 'wp_register_block_metadata_collection' ) ) {
		wp_register_block_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );
	}
	/**
	 * Registers the block type(s) in the `blocks-manifest.php` file.
	 *
	 * @see https://developer.wordpress.org/reference/functions/register_block_type/
	 */
	$manifest_data = require __DIR__ . '/build/blocks-manifest.php';
	foreach ( array_keys( $manifest_data ) as $block_type ) {
		register_block_type( __DIR__ . "/build/{$block_type}" );
	}
}
add_action( 'init', '\Jcore\Lohko\block_init' );

/**
 * Adds the Rive mime type to the allowed upload mime types.
 * This allows Rive files to be uploaded to the media library.
 *
 * @param array $mimes Array of allowed mime types.
 *
 * @return array
 */
function add_rive_mime_type( $mimes ): array {
	// Check if the 'jcore/rive-animation' block is registered.

	if ( ! \WP_Block_Type_Registry::get_instance()->is_registered( 'jcore/rive-animation' ) ) {
		// If the block is registered, add the Rive mime type.
		return $mimes;
	}

	$mimes['riv'] = 'application/riv';

	return $mimes;
}
add_filter( 'upload_mimes', 'Jcore\Lohko\add_rive_mime_type' );

/**
 * Set the script translations.
 *
 * @return void
 */
function set_script_translations() {
	$manifest_dir = __DIR__ . '/build';
	if ( ! is_dir( $manifest_dir ) ) {
		return;
	}

	$block_json_paths = glob( $manifest_dir . '/*/block.json' );
	foreach ( $block_json_paths as $block_json_path ) {
		if ( ! file_exists( $block_json_path ) ) {
			continue;
		}

		$block_json = json_decode( file_get_contents( $block_json_path ), true ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents

		if ( empty( $block_json ) || ! is_array( $block_json ) ) {
			continue;
		}

		$name       = $block_json['name'];
		$textdomain = $block_json['textdomain'];
		if ( empty( $textdomain ) || empty( $name ) ) {
			continue;
		}

		// Replace slashes with dashes in the block name for the script handle.
		$script_handle = str_replace( '/', '-', $name );
		wp_set_script_translations( $script_handle . '-view-script', $textdomain, plugin_dir_path( __FILE__ ) . 'languages' );
		wp_set_script_translations( $script_handle . '-editor-script', $textdomain, plugin_dir_path( __FILE__ ) . 'languages' );
	}
}
add_action( 'wp_enqueue_scripts', 'Jcore\Lohko\set_script_translations' );
add_action( 'admin_enqueue_scripts', 'Jcore\Lohko\set_script_translations' );
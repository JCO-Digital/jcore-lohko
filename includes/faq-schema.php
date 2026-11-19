<?php
/**
 * FAQ schema for accordions: an accordions block with "FAQ schema" on
 * (attribute addStructuredData, the same name as in other projects' Lohko)
 * marks its items up as FAQPage questions and answers: the item's title is
 * the question, its content the answer.
 *
 * With Yoast SEO the questions go into Yoast's schema graph (the page becomes
 * WebPage + FAQPage with the questions as mainEntity), as Yoast's own FAQ
 * block does, so the page has one consistent graph. Without Yoast, a plain
 * FAQPage JSON-LD script is printed instead.
 *
 * @package Jcore\Lohko
 */

namespace Jcore\Lohko;

defined( 'ABSPATH' ) || exit;

/**
 * The questions of the FAQ accordions in the current page's content.
 *
 * @return array[] schema.org Question objects.
 */
function faq_schema_questions(): array {
	static $questions = null;
	if ( null !== $questions ) {
		return $questions;
	}

	$questions = array();
	$post      = is_singular() ? get_queried_object() : null;
	if ( ! $post instanceof \WP_Post || ! has_block( 'lohko/accordions', $post ) ) {
		return $questions;
	}

	$collect = static function ( array $blocks ) use ( &$collect, &$questions ): void {
		foreach ( $blocks as $block ) {
			if ( 'lohko/accordions' === $block['blockName'] && ! empty( $block['attrs']['addStructuredData'] ) ) {
				foreach ( $block['innerBlocks'] as $item ) {
					if ( 'lohko/accordion-item' !== $item['blockName'] ) {
						continue;
					}
					// The answer is the item's content blocks only, so it doesn't repeat the title.
					$answer = '';
					foreach ( $item['innerBlocks'] as $inner ) {
						$answer .= render_block( $inner );
					}
					$question = faq_schema_item_title( $item );
					$answer   = trim( preg_replace( '/\s+/u', ' ', wp_strip_all_tags( $answer ) ) );
					if ( '' === $question || '' === $answer ) {
						continue;
					}
					$questions[] = array(
						'@type'          => 'Question',
						'name'           => $question,
						'acceptedAnswer' => array(
							'@type' => 'Answer',
							'text'  => $answer,
						),
					);
				}
			} elseif ( ! empty( $block['innerBlocks'] ) ) {
				$collect( $block['innerBlocks'] );
			}
		}
	};
	$collect( parse_blocks( $post->post_content ) );

	return $questions;
}

/**
 * An accordion item's title: saved in its HTML (attribute source
 * ".accordion-item__title"), not in the block comment.
 *
 * @param array $item Parsed accordion-item block.
 *
 * @return string Plain text.
 */
function faq_schema_item_title( array $item ): string {
	if ( ! empty( $item['attrs']['title'] ) ) {
		return trim( wp_strip_all_tags( (string) $item['attrs']['title'] ) );
	}
	$html = (string) ( $item['innerHTML'] ?? '' );
	if ( '' === $html || ! class_exists( 'DOMDocument' ) ) {
		return '';
	}

	$doc      = new \DOMDocument();
	$previous = libxml_use_internal_errors( true );
	$doc->loadHTML( '<?xml encoding="utf-8"?><div>' . $html . '</div>' );
	libxml_clear_errors();
	libxml_use_internal_errors( $previous );

	$nodes = ( new \DOMXPath( $doc ) )->query( '//*[contains(concat(" ", normalize-space(@class), " "), " accordion-item__title ")]' );
	$title = $nodes && $nodes->length ? $nodes->item( 0 )->textContent : '';

	return trim( preg_replace( '/\s+/u', ' ', $title ) );
}

add_filter( 'wpseo_schema_webpage', __NAMESPACE__ . '\\faq_schema_yoast_webpage' );

/**
 * Yoast: the page is also an FAQPage, its questions the main entity.
 *
 * @param array $data Yoast's WebPage schema piece.
 *
 * @return array
 */
function faq_schema_yoast_webpage( $data ) {
	$questions = faq_schema_questions();
	if ( ! $questions || ! is_array( $data ) ) {
		return $data;
	}

	$data['@type']      = array_values( array_unique( array_merge( (array) ( $data['@type'] ?? 'WebPage' ), array( 'FAQPage' ) ) ) );
	$data['mainEntity'] = $questions;

	return $data;
}

add_action( 'wp_head', __NAMESPACE__ . '\\faq_schema_without_yoast', 20 );

/**
 * Without Yoast: a plain FAQPage JSON-LD script.
 */
function faq_schema_without_yoast(): void {
	if ( defined( 'WPSEO_VERSION' ) ) {
		return;
	}
	$questions = faq_schema_questions();
	if ( ! $questions ) {
		return;
	}

	$schema = array(
		'@context'   => 'https://schema.org',
		'@type'      => 'FAQPage',
		'mainEntity' => $questions,
	);
	echo '<script type="application/ld+json">' . wp_json_encode( $schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) . "</script>\n"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
}

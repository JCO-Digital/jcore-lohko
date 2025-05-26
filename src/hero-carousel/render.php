<?php
/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

namespace Jcore\Lohko;

use Timber\Timber;

$context = timber_block_context( $attributes );

$number_of_posts = isset($context['numberOfPosts']) && $context['numberOfPosts'] ? $context['numberOfPosts'] : 3;

$args = array(
    'posts_per_page' => $number_of_posts, // Number of posts to retrieve
    'post_type'      => 'post', // Post type to query
    'post_status'    => 'publish', // Only published posts
    'orderby'        => 'date', // Order by date
    'order'          => 'DESC', // Latest first
);

$posts = Timber::get_posts( $args );

$context['posts'] = $posts;

Timber::render( '@lohko/hero-carousel/view.twig', $context );

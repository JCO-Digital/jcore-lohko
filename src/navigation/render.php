<?php

use Timber\Timber;

$context = Timber::context( $attributes );

$context['wrapper_attributes'] = get_block_wrapper_attributes();

Timber::render( '@lohko/navigation/view.twig', $context );

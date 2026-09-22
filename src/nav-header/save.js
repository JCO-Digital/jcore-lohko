import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * The data attributes are only emitted when enabled, so jutils does not see a
 * literal "false" and treat it as truthy.
 *
 * @param {Object} props            Block props.
 * @param {Object} props.attributes Block attributes.
 *
 * @return {Element} Element to render.
 */
export default function save( { attributes } ) {
	const { scroll, sticky } = attributes;

	return (
		<header
			{ ...useBlockProps.save() }
			data-jscroll={ scroll ? 'true' : undefined }
			data-jsticky={ sticky ? 'true' : undefined }
		>
			<InnerBlocks.Content />
		</header>
	);
}

import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * The data attributes are only emitted when enabled, so jutils does not see a
 * literal "false" and treat it as truthy.
 *
 * Sticky also writes data-jsticky-no-spacer. The header sticks with CSS
 * (position: sticky in style.scss, fixed when it's an overlay), so it keeps
 * its own place in the page; without the attribute, jcore-utils' sticky
 * script inserts an empty spacer of the header's height before it (made for
 * headers that turn position: fixed), which shows as a gap above the header.
 * Headers saved before this are handled by deprecated.js.
 *
 * @param {Object} props            Block props.
 * @param {Object} props.attributes Block attributes.
 *
 * @return {Element} Element to render.
 */
export default function save( { attributes } ) {
	const { scroll, sticky, overlay } = attributes;

	return (
		<header
			{ ...useBlockProps.save( {
				className: overlay ? 'is-overlay' : undefined,
			} ) }
			data-jscroll={ scroll ? 'true' : undefined }
			data-jsticky={ sticky ? 'true' : undefined }
			data-jsticky-no-spacer={ sticky ? 'true' : undefined }
		>
			<InnerBlocks.Content />
		</header>
	);
}

import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import metadata from './block.json';

/**
 * Earlier versions of the nav header's saved markup, so headers saved with
 * them stay valid in the editor (and get the current markup when saved).
 */
const deprecated = [
	// Before data-jsticky-no-spacer: sticky headers got jcore-utils' spacer.
	{
		attributes: metadata.attributes,
		supports: metadata.supports,
		save( { attributes } ) {
			const { scroll, sticky, overlay } = attributes;

			return (
				<header
					{ ...useBlockProps.save( {
						className: overlay ? 'is-overlay' : undefined,
					} ) }
					data-jscroll={ scroll ? 'true' : undefined }
					data-jsticky={ sticky ? 'true' : undefined }
				>
					<InnerBlocks.Content />
				</header>
			);
		},
	},
];

export default deprecated;

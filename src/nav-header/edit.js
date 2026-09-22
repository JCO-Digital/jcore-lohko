import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	InnerBlocks,
} from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';

import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @param {Object}   props               Block props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Attribute setter.
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	const { scroll, sticky } = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'lohko' ) }>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'Scroll classes', 'lohko' ) }
						help={ __(
							'Set jutils scroll classes on scroll.',
							'lohko'
						) }
						checked={ scroll }
						onChange={ ( newValue ) =>
							setAttributes( { scroll: newValue } )
						}
					/>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'Sticky', 'lohko' ) }
						help={ __( 'Set jutils sticky.', 'lohko' ) }
						checked={ sticky }
						onChange={ ( newValue ) =>
							setAttributes( { sticky: newValue } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<header
				{ ...useBlockProps() }
				data-jscroll={ scroll }
				data-jsticky={ sticky }
			>
				<InnerBlocks />
			</header>
		</>
	);
}

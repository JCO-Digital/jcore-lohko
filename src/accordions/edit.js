import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	useBlockProps,
	InnerBlocks,
} from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object}                       props               Block props.
 * @param {Object}                       props.attributes    Block attributes.
 * @param {(attributes: Object) => void} props.setAttributes Attribute setter.
 *
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'lohko' ) }>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'First item open', 'lohko' ) }
						help={ __(
							'The first item is open when the page loads, unless the address points to another one.',
							'lohko'
						) }
						checked={ attributes.firstOpen }
						onChange={ ( value ) =>
							setAttributes( { firstOpen: value } )
						}
					/>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'FAQ schema', 'lohko' ) }
						help={ __(
							'Mark the items up as questions and answers (FAQPage structured data) for search engines: the title is the question, the content the answer.',
							'lohko'
						) }
						checked={ !! attributes.addStructuredData }
						onChange={ ( value ) =>
							setAttributes( { addStructuredData: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<InnerBlocks
					allowedBlocks={ [ 'lohko/accordion-item' ] }
					template={ [
						[
							'lohko/accordion-item',
							{ title: 'Accordion Title 1' },
						],
					] }
				/>
			</div>
		</>
	);
}

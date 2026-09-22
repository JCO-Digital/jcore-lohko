import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';

import './editor.scss';
import metadata from './block.json';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @param {Object}   props               Block props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Attribute setter.
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	const { copyrightShow, copyrightText, copyrightYear, copyrightToCurrent } =
		attributes;
	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'lohko' ) }>
					<ToggleControl
						__nextHasNoMarginBottom
						checked={ !! copyrightShow }
						onChange={ () =>
							setAttributes( { copyrightShow: ! copyrightShow } )
						}
						label={ __( 'Show Copyright Section', 'lohko' ) }
						help={ __(
							'Toggle to show or hide the copyright text.',
							'lohko'
						) }
					/>
					{ copyrightShow && (
						<>
							<TextControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label={ __( 'Copyright text', 'lohko' ) }
								value={ copyrightText }
								onChange={ ( newValue ) =>
									setAttributes( { copyrightText: newValue } )
								}
							/>
							<TextControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label={ __( 'Copyright year', 'lohko' ) }
								value={ copyrightYear }
								type="number"
								onChange={ ( newValue ) => {
									const value = parseInt( newValue, 10 );

									setAttributes( {
										copyrightYear: Number.isNaN( value )
											? 0
											: value,
									} );
								} }
							/>
							<ToggleControl
								__nextHasNoMarginBottom
								checked={ !! copyrightToCurrent }
								onChange={ () =>
									setAttributes( {
										copyrightToCurrent:
											! copyrightToCurrent,
									} )
								}
								label={ __( 'Add Current Year', 'lohko' ) }
								help={ __(
									'Toggle to show current year.',
									'lohko'
								) }
							/>
						</>
					) }
				</PanelBody>
			</InspectorControls>

			<div { ...useBlockProps() }>
				<ServerSideRender
					block={ metadata.name }
					attributes={ attributes }
				/>
			</div>
		</>
	);
}

import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, SelectControl, ToggleControl } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';

import './editor.scss';
import metadata from './block.json';
import { useMenuLocationOptions } from '../shared/use-menu-locations';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @param {Object}   props               Block props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Attribute setter.
 *
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	const { menuLocation, showChildren } = attributes;
	const menuOptions = useMenuLocationOptions();

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'lohko' ) }>
					<SelectControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={ __( 'Menu location', 'lohko' ) }
						help={ __(
							'Which registered menu to display.',
							'lohko'
						) }
						value={ menuLocation }
						options={ menuOptions }
						onChange={ ( value ) =>
							setAttributes( { menuLocation: value } )
						}
					/>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'Show sub menus', 'lohko' ) }
						checked={ showChildren }
						onChange={ ( value ) =>
							setAttributes( { showChildren: value } )
						}
					/>
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

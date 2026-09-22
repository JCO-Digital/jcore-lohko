import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { PanelBody, SelectControl, ToggleControl } from '@wordpress/components';

import './editor.scss';
import { useMenuLocationOptions } from '../shared/use-menu-locations';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * The header is rendered on the server with Timber, so the editor draws an
 * approximation of it and keeps the inner blocks editable in place.
 *
 * @param {Object}   props               Block props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Attribute setter.
 *
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	const { menuLocation, showLogo, showChildren } = attributes;
	const menuOptions = useMenuLocationOptions();

	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps( {
		className: 'lohko-header__content',
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'lohko' ) }>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'Show logo', 'lohko' ) }
						help={ __(
							'Displays the site logo set in the customizer.',
							'lohko'
						) }
						checked={ showLogo }
						onChange={ ( value ) =>
							setAttributes( { showLogo: value } )
						}
					/>
					<SelectControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={ __( 'Menu location', 'lohko' ) }
						help={ __(
							'Which registered menu to show in the header.',
							'lohko'
						) }
						value={ menuLocation }
						options={ menuOptions }
						onChange={ ( value ) =>
							setAttributes( { menuLocation: value } )
						}
					/>
					{ menuLocation && (
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __( 'Show sub menus', 'lohko' ) }
							checked={ showChildren }
							onChange={ ( value ) =>
								setAttributes( { showChildren: value } )
							}
						/>
					) }
				</PanelBody>
			</InspectorControls>

			<header { ...blockProps }>
				<div className="lohko-header__inner">
					{ showLogo && (
						<div className="lohko-header__placeholder">
							{ __( 'Site logo', 'lohko' ) }
						</div>
					) }
					{ menuLocation && (
						<div className="lohko-header__placeholder">
							{ __( 'Menu:', 'lohko' ) } { menuLocation }
						</div>
					) }
					<div { ...innerBlocksProps } />
				</div>
			</header>
		</>
	);
}

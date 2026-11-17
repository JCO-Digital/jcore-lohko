import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	Placeholder,
	SelectControl,
	TextControl,
} from '@wordpress/components';
import {
	AlignmentControl,
	BlockControls,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';

import metadata from './block.json';
import { useMenuLocationOptions } from '../shared/use-menu-locations';
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @param {Object}                       props               Block props.
 * @param {Object}                       props.attributes    Block attributes.
 * @param {(attributes: Object) => void} props.setAttributes Attribute setter.
 *
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	const { menuLocation, buttonLabel, buttonAlign } = attributes;
	const menuOptions = useMenuLocationOptions();

	return (
		<>
			<BlockControls group="block">
				<AlignmentControl
					value={ buttonAlign }
					onChange={ ( value ) =>
						setAttributes( { buttonAlign: value ?? 'left' } )
					}
				/>
			</BlockControls>
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'lohko' ) }>
					<SelectControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={ __( 'Menu location', 'lohko' ) }
						help={ __(
							'Choose which menu slot to display.',
							'lohko'
						) }
						value={ menuLocation }
						options={ menuOptions }
						onChange={ ( value ) =>
							setAttributes( { menuLocation: value } )
						}
					/>
					<TextControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={ __( 'Button label', 'lohko' ) }
						help={ __( 'Defaults to "Menu".', 'lohko' ) }
						value={ buttonLabel }
						onChange={ ( value ) =>
							setAttributes( { buttonLabel: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...useBlockProps() }>
				{ menuLocation ? (
					<ServerSideRender
						block={ metadata.name }
						attributes={ attributes }
					/>
				) : (
					<Placeholder
						icon={ metadata.icon }
						label={ metadata.title }
						instructions={ __(
							'Select a menu location in the block settings.',
							'lohko'
						) }
					/>
				) }
			</div>
		</>
	);
}

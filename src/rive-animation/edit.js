import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	useBlockProps,
	BlockControls,
	MediaReplaceFlow,
	MediaPlaceholder,
} from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import Rive, { Alignment, Fit, Layout } from '@rive-app/react-canvas';

import './editor.scss';

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
	const { riveFile, riveFileUrl, stateMachineName } = attributes;

	const onSelect = ( media ) =>
		setAttributes( {
			riveFile: media.id,
			riveFileUrl: media.url,
			riveFileName: media.name,
		} );

	const onSelectURL = ( url ) =>
		setAttributes( {
			riveFile: undefined,
			riveFileUrl: url,
			riveFileName: undefined,
		} );

	return (
		<>
			<BlockControls>
				<MediaReplaceFlow
					mediaURL={ riveFileUrl }
					mediaId={ riveFile }
					allowedTypes={ [ 'application/riv' ] }
					accept={ [ 'application/riv' ] }
					onSelect={ onSelect }
					onSelectURL={ onSelectURL }
					onReset={ () =>
						setAttributes( {
							riveFile: undefined,
							riveFileUrl: '',
							riveFileName: undefined,
						} )
					}
					name={
						riveFileUrl
							? __( 'Replace Rive file', 'lohko' )
							: __( 'Add Rive file', 'lohko' )
					}
				/>
			</BlockControls>
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'lohko' ) }>
					<TextControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={ __( 'State machine name', 'lohko' ) }
						value={ stateMachineName ?? '' }
						help={ __(
							'The name of the state machine to control the animation.',
							'lohko'
						) }
						onChange={ ( value ) =>
							setAttributes( { stateMachineName: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...useBlockProps() }>
				{ riveFileUrl ? (
					<Rive
						src={ riveFileUrl }
						layout={
							new Layout( {
								fit: Fit.FitHeight,
								alignment: Alignment.BottomCenter,
							} )
						}
						stateMachines={
							stateMachineName ? [ stateMachineName ] : undefined
						}
					/>
				) : (
					<MediaPlaceholder
						icon="superhero"
						labels={ {
							title: __( 'Rive Animation', 'lohko' ),
							instructions: __(
								'Select a .riv file to display the animation.',
								'lohko'
							),
						} }
						allowedTypes={ [ 'application/riv' ] }
						accept={ [ 'application/riv' ] }
						onSelect={ onSelect }
						onSelectURL={ onSelectURL }
					/>
				) }
			</div>
		</>
	);
}

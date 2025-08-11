import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	useBlockProps,
	MediaUpload,
	MediaUploadCheck,
	BlockControls,
	MediaReplaceFlow,
	MediaPlaceholder,
} from '@wordpress/block-editor';
import {
	PanelBody,
	Button,
	Placeholder,
	TextControl,
	Popover,
} from '@wordpress/components';
import './editor.css';
import Rive, { Layout, Fit, Alignment } from '@rive-app/react-canvas';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
	return (
		<>
			<BlockControls>
				<MediaReplaceFlow
					mediaURL={attributes.riveFileUrl}
					mediaId={attributes.riveFile}
					allowedTypes={['application/riv']}
					accept={['application/riv']}
					onSelect={(media) => {
						setAttributes({
							riveFile: media.id,
							riveFileUrl: media.url,
							riveFileName: media.name,
						});
					}}
					onReset={() =>
						setAttributes({
							riveFile: null,
							riveFileUrl: null,
							riveFileName: null,
						})
					}
					onSelectURL={(url) => {
						setAttributes({
							riveFile: null,
							riveFileUrl: url,
							riveFileName: null,
						});
					}}
					name={
						!attributes.riveFileUrl
							? __('Add Rive file')
							: __('Replace Rive file')
					}
				/>
			</BlockControls>
			<InspectorControls>
				<PanelBody title={__('Settings')}>
					<TextControl
						label={'State Machine Name'}
						value={attributes.stateMachineName ?? ''}
						onChange={(newValue) =>
							setAttributes({ stateMachineName: newValue })
						}
						help={__(
							'The name of the state machine to control the animation.'
						)}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...useBlockProps()}>
				{attributes.riveFileUrl ? (
					<Rive
						src={attributes.riveFileUrl}
						layout={
							new Layout({
								fit: Fit.FitHeight,
								alignment: Alignment.BottomCenter,
							})
						}
						stateMachines={
							attributes.stateMachineName
								? attributes.stateMachineName
								: undefined
						}
					/>
				) : (
					<MediaPlaceholder
						icon="superhero"
						labels={{
							title: __('Rive Animation', 'jcore'),
							instructions: __(
								'Select a .riv file to display the animation.',
								'jcore'
							),
						}}
						allowedTypes={['application/riv']}
						onSelect={(media) => {
							setAttributes({
								riveFile: media.id,
								riveFileUrl: media.url,
								riveFileName: media.name,
							});
						}}
						accept={['application/riv']}
						onSelectURL={(url) => {
							setAttributes({
								riveFile: null,
								riveFileUrl: url,
								riveFileName: null,
							});
						}}
					/>
				)}
			</div>
		</>
	);
}

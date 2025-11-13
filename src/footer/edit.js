import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
	const { copyrightShow, copyrightText, copyrightYear, copyrightToCurrent } =
		attributes;
	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings', 'lohko')}>
					<ToggleControl
						checked={!!copyrightShow}
						onChange={() =>
							setAttributes({ copyrightShow: !copyrightShow })
						}
						label={__('Show Copyright Section', 'lohko')}
						help={__(
							'Toggle to show or hide the copyright text.',
							'lohko'
						)}
					/>
					{copyrightShow && (
						<>
							<TextControl
								label="Copyright Text"
								value={copyrightText}
								onChange={(newValue) =>
									setAttributes({ copyrightText: newValue })
								}
							/>
							<TextControl
								label={__('Copyright Year', 'lohko')}
								value={copyrightYear}
								type="number"
								onChange={(newValue) => {
									let value = parseInt(newValue);

									setAttributes({
										copyrightYear:
											value === NaN ? 0 : value,
									});
								}}
							/>
							<ToggleControl
								checked={!!copyrightToCurrent}
								onChange={() =>
									setAttributes({
										copyrightToCurrent: !copyrightToCurrent,
									})
								}
								label={__('Add Current Year', 'lohko')}
								help={__(
									'Toggle to show current year.',
									'lohko'
								)}
							/>
						</>
					)}
				</PanelBody>
			</InspectorControls>

			<div {...useBlockProps()}>
				<ServerSideRender
					block="jcore/footer"
					attributes={{ ...attributes, preview: true }}
				/>
			</div>
		</>
	);
}

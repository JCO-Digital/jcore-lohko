import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { PanelBody, SelectControl } from '@wordpress/components';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';
import './editor.css';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
	// Fetch menu locations from the REST API
	const menuLocations = useSelect((select) => {
		return select('core').getMenuLocations();
	}, []);

	// Ensure menuLocation is always a string
	const menuLocation = attributes.menuLocation || '';

	// Prepare options for the select box
	const options = menuLocations
		? menuLocations.map(({ description, name }) => ({
				label: description,
				value: name,
			}))
		: [];
	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings', 'lohko')}>
					<SelectControl
						label="Select Menu Location"
						value={menuLocation}
						options={options}
						onChange={(value) =>
							setAttributes({ menuLocation: value })
						}
						help="Choose which menu slot to display."
					/>
				</PanelBody>
			</InspectorControls>
			<div {...useBlockProps()}>
				<ServerSideRender
					block="jco/simple-menu"
					attributes={{ ...attributes, preview: true }}
				/>
			</div>
		</>
	);
}

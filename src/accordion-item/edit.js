import { __ } from '@wordpress/i18n';
import { RichText, useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { applyFilters } from '@wordpress/hooks';
import { useEffect } from 'react';
import { useInstanceId } from '@wordpress/compose';

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
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
	const allowedBlocks = applyFilters('jcore.accordion-item.allowedBlocks', [
		'core/heading',
		'core/paragraph',
		'core/list',
		'core/list-item',
		'core/group',
		'core/image',
	]);

	const instanceId = useInstanceId(Edit);

	useEffect(() => {
		if (!attributes.id) {
			setAttributes({ id: instanceId });
		}
	}, [attributes, setAttributes, instanceId]);

	return (
		<>
			<div
				{...useBlockProps({
					'data-accordion-id': attributes.id,
				})}
			>
				<div className="accordion-item__header">
					{/* We are not using the same structure as the Save function, because it breaks the styles in the editor */}
					<RichText
						tagName="h3"
						value={attributes.title}
						identifier="title"
						onChange={(title) => setAttributes({ title })}
						placeholder={__('Title', 'jcore')}
						className="accordion-item__title"
					/>
					<span className="accordion-item__toggle">
						<span className="accordion-item__toggle-icon"></span>
						<span className="screen-reader-text">Toggle</span>
					</span>
				</div>
				<div className="accordion-item__content">
					<InnerBlocks
						allowedBlocks={allowedBlocks}
						template={[
							'core/paragraph',
							{ placeholder: 'Accordion Content here' },
						]}
					/>
				</div>
			</div>
		</>
	);
}

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {Element} Element to render.
 */
export default function save({ attributes }) {
	return (
		<div
			{...useBlockProps.save({
				id: `accordion-${attributes.id}`,
				'data-accordion-id': attributes.id,
				'data-wp-bind--aria-expanded': 'state.isActive',
				'data-wp-class--active': 'state.isActive',
			})}
		>
			<div
				className="accordion-item__header"
				data-wp-on-async--click="actions.openAccordion"
				aria-controls={`accordion-item-${attributes.id}`}
			>
				<h3 className="accordion-item__title">{attributes.title}</h3>
				<button className="accordion-item__toggle">
					<span className="accordion-item__toggle-icon"></span>
					<span className="screen-reader-text">Toggle</span>
				</button>
			</div>
			<div
				id={`accordion-item-${attributes.id}`}
				className="accordion-item__content"
			>
				<InnerBlocks.Content />
			</div>
		</div>
	);
}

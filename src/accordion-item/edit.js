import { __ } from '@wordpress/i18n';
import {
	RichText,
	useBlockProps,
	InnerBlocks,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { applyFilters } from '@wordpress/hooks';
import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

import './editor.scss';
import metadata from './block.json';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @param {Object}   props               Block props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Attribute setter.
 * @param {string}   props.clientId      The block's client id.
 *
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes, clientId } ) {
	const allowedBlocks = applyFilters( 'lohko.accordion-item.allowedBlocks', [
		'core/heading',
		'core/paragraph',
		'core/list',
		'core/list-item',
		'core/group',
		'core/image',
	] );

	// The id ends up in the DOM and in the anchor link, so it has to be unique
	// on the page. Duplicating a block copies its attributes, so a copy has to
	// notice the clash and take a new one.
	const isDuplicate = useSelect(
		( select ) => {
			if ( ! attributes.id ) {
				return false;
			}
			const {
				getClientIdsWithDescendants,
				getBlockName,
				getBlockAttributes,
			} = select( blockEditorStore );

			return getClientIdsWithDescendants().some(
				( id ) =>
					id !== clientId &&
					getBlockName( id ) === metadata.name &&
					getBlockAttributes( id )?.id === attributes.id
			);
		},
		[ attributes.id, clientId ]
	);

	useEffect( () => {
		if ( ! attributes.id || isDuplicate ) {
			setAttributes( { id: clientId.slice( 0, 8 ) } );
		}
	}, [ attributes.id, isDuplicate, clientId, setAttributes ] );

	return (
		<div
			{ ...useBlockProps( {
				'data-accordion-id': attributes.id,
			} ) }
		>
			<div className="accordion-item__header">
				{ /* Not the same structure as save(), which breaks the styles in the editor. */ }
				<RichText
					tagName="h3"
					value={ attributes.title }
					identifier="title"
					onChange={ ( title ) => setAttributes( { title } ) }
					placeholder={ __( 'Title', 'lohko' ) }
					className="accordion-item__title"
				/>
				<span className="accordion-item__toggle">
					<span className="accordion-item__toggle-icon"></span>
					<span className="screen-reader-text">
						{ __( 'Toggle', 'lohko' ) }
					</span>
				</span>
			</div>
			<div className="accordion-item__content">
				<InnerBlocks
					allowedBlocks={ allowedBlocks }
					template={ [
						[
							'core/paragraph',
							{
								placeholder: __(
									'Accordion content here',
									'lohko'
								),
							},
						],
					] }
				/>
			</div>
		</div>
	);
}

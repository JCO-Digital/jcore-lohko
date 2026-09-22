/**
 * Shared editor helpers for picking a registered menu location.
 */
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Options for a SelectControl listing every registered menu location.
 *
 * The first option is an explicit empty choice, so a block with no location
 * chosen does not silently display the first menu in the list.
 *
 * @return {Array<{label: string, value: string}>} Select options.
 */
export function useMenuLocationOptions() {
	const menuLocations = useSelect(
		( select ) => select( 'core' ).getMenuLocations(),
		[]
	);

	const options = ( menuLocations ?? [] ).map(
		( { description, name } ) => ( {
			label: description || name,
			value: name,
		} )
	);

	return [
		{ label: __( 'Select a menu…', 'lohko' ), value: '' },
		...options,
	];
}

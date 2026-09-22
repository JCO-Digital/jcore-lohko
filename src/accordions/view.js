import { getContext, getElement, store } from '@wordpress/interactivity';

const ACCORDION_HASH_PREFIX = 'accordion-';

/**
 * Find the accordion item element an event target belongs to.
 *
 * @param {HTMLElement} element Element inside an accordion item.
 *
 * @return {HTMLElement|null} The accordion item, or null when not found.
 */
const getItem = ( element ) => {
	if ( ! element ) {
		return null;
	}
	if ( element.getAttribute( 'data-accordion-id' ) ) {
		return element;
	}
	return element.closest( '[data-accordion-id]' );
};

/**
 * Read the accordion id an element belongs to.
 *
 * @param {HTMLElement} element Element inside an accordion item.
 *
 * @return {string} The id, or an empty string when not found.
 */
const getAccordionId = ( element ) => {
	const item = getItem( element );
	return item ? item.getAttribute( 'data-accordion-id' ) ?? '' : '';
};

store( 'lohko/accordions', {
	state: {
		get isActive() {
			const context = getContext();
			const { ref } = getElement();
			const id = getAccordionId( ref );
			return id !== '' && context.currentAccordion === id;
		},
	},
	actions: {
		parseUrl() {
			const hash = window.location.hash.slice( 1 );
			if ( ! hash.startsWith( ACCORDION_HASH_PREFIX ) ) {
				return;
			}

			// Keep the whole remainder: ids may contain hyphens.
			const id = hash.slice( ACCORDION_HASH_PREFIX.length );
			if ( ! id ) {
				return;
			}

			getContext().currentAccordion = id;
		},
		openAccordion() {
			const { ref } = getElement();
			const item = getItem( ref );

			if ( ! item ) {
				return;
			}

			const id = item.getAttribute( 'data-accordion-id' ) ?? '';

			if ( id === '' ) {
				return;
			}

			const context = getContext();

			const wasActive = context.currentAccordion === id;
			context.currentAccordion = wasActive ? '' : id;

			if ( wasActive ) {
				window.history.pushState(
					null,
					'',
					window.location.pathname + window.location.search
				);
				return;
			}

			item.scrollIntoView( { behavior: 'smooth' } );
			window.history.pushState( null, '', `#${ item.id }` );
		},
	},
} );

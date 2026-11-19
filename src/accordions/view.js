import { getContext, getElement, store } from '@wordpress/interactivity';

const ACCORDION_HASH_PREFIX = 'accordion-';

/**
 * Keep an element where it is on the screen while the page above it changes
 * (e.g. an item above closes). Measures it now, and after the next paint
 * scrolls by however much it moved. No smooth scrolling: nothing jumps.
 *
 * @param {HTMLElement} element The element to keep in place.
 */
const keepInView = ( element ) => {
	if ( ! element ) {
		return;
	}
	const before = element.getBoundingClientRect().top;
	window.requestAnimationFrame( () =>
		window.requestAnimationFrame( () => {
			const moved = element.getBoundingClientRect().top - before;
			if ( Math.abs( moved ) > 1 ) {
				window.scrollBy( { top: moved, behavior: 'instant' } );
			}
		} )
	);
};

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
	return item ? ( item.getAttribute( 'data-accordion-id' ) ?? '' ) : '';
};

store( 'lohko/accordions', {
	state: {
		get isActive() {
			// Read the context first, so the directive subscribes to it even
			// when the element ref isn't available yet on the first render.
			const { currentAccordion } = getContext();
			const { ref } = getElement();
			const id = getAccordionId( ref );
			return id !== '' && currentAccordion === id;
		},
	},
	actions: {
		parseUrl() {
			const context = getContext();
			const hash = window.location.hash.slice( 1 );

			// Keep the whole remainder: ids may contain hyphens.
			const id = hash.startsWith( ACCORDION_HASH_PREFIX )
				? hash.slice( ACCORDION_HASH_PREFIX.length )
				: '';
			if ( id ) {
				context.currentAccordion = id;
				return;
			}

			// The block's "First item open" option.
			if ( context.openFirst ) {
				const { ref } = getElement();
				const first = ref.querySelector( '[data-accordion-id]' );
				context.currentAccordion =
					first?.getAttribute( 'data-accordion-id' ) ?? '';
			}
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

			// The clicked title stays where it is, even when an item above
			// it closes at the same time.
			keepInView( ref );

			const wasActive = context.currentAccordion === id;
			context.currentAccordion = wasActive ? '' : id;

			// The address shows the open item, for sharing; replaced, not
			// pushed, so opening items doesn't fill the back button's history.
			window.history.replaceState(
				null,
				'',
				wasActive
					? window.location.pathname + window.location.search
					: `#${ item.id }`
			);
		},
	},
} );

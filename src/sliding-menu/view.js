import { getContext, getElement, store } from '@wordpress/interactivity';

// Keep in sync with the transition duration in style.scss.
const TRANSITION_MS = 300;

const BLOCK_SELECTOR = '.wp-block-lohko-sliding-menu';

/**
 * Wait for the panel transition to finish.
 *
 * @return {Promise<void>} Resolves after the transition duration.
 */
const waitForTransition = () =>
	new Promise( ( resolve ) => setTimeout( resolve, TRANSITION_MS ) );

/**
 * Find the block root an element belongs to.
 *
 * @param {HTMLElement} element Element inside the block.
 *
 * @return {HTMLElement|null} The block root.
 */
const getRoot = ( element ) => element?.closest( BLOCK_SELECTOR ) ?? null;

/**
 * Find a panel element by id.
 *
 * @param {HTMLElement|null} root Block root.
 * @param {string}           id   Panel id.
 *
 * @return {HTMLElement|null} The panel.
 */
const getPanel = ( root, id ) =>
	root?.querySelector( `[data-panel-id="${ window.CSS.escape( id ) }"]` ) ??
	null;

/**
 * Focus the first focusable element in a panel.
 *
 * @param {HTMLElement|null} panel Panel element.
 */
const focusPanel = ( panel ) => {
	panel?.querySelector( 'a[href], button' )?.focus();
};

const { actions } = store( 'lohko/sliding-menu', {
	state: {
		// Panels get their id from their own context, which inherits the
		// block context. getElement().ref is still null on the first render.
		get isActive() {
			const context = getContext();
			return context.current === context.panelId;
		},
		get isPrevious() {
			const context = getContext();
			return context.previous === context.panelId;
		},
		get isPanelInert() {
			const context = getContext();
			return context.current !== context.panelId;
		},
		get isRoot() {
			return getContext().current === 'root';
		},
		get isBack() {
			return getContext().direction === 'back';
		},
	},
	actions: {
		*open() {
			const context = getContext();
			const root = getRoot( getElement().ref );

			context.isOpen = true;
			document.body.classList.add( 'lohko-noscroll' );

			// Wait for inert to be removed before moving focus.
			yield waitForTransition();
			focusPanel( getPanel( root, context.current ) );
		},
		*close() {
			const context = getContext();
			const root = getRoot( getElement().ref );

			context.isOpen = false;
			document.body.classList.remove( 'lohko-noscroll' );
			root?.querySelector( `${ BLOCK_SELECTOR }__toggle` )?.focus();

			// Reset to the starting level once the menu is out of view.
			yield waitForTransition();
			if ( ! context.isOpen ) {
				context.direction = 'forward';
				context.previous = null;
				context.current = context.start;
			}
		},
		*goTo( target, direction ) {
			const context = getContext();
			const from = context.current;

			if ( ! target || target === from ) {
				return;
			}

			context.direction = direction;
			context.previous = from;
			context.current = target;

			yield waitForTransition();

			// Another navigation may have started meanwhile.
			if ( context.current !== target ) {
				return;
			}
			context.previous = null;

			// Generator actions restore the element scope after each yield.
			const panel = getPanel( getRoot( getElement().ref ), target );
			if ( 'forward' === direction ) {
				focusPanel( panel );
				return;
			}

			// Return focus to the button that opened the panel we left.
			const opener = panel?.querySelector(
				`[data-target="${ window.CSS.escape( from ) }"]`
			);
			if ( opener ) {
				opener.focus();
			} else {
				focusPanel( panel );
			}
		},
		*forward() {
			const { ref } = getElement();
			yield actions.goTo( ref.getAttribute( 'data-target' ), 'forward' );
		},
		*back() {
			const { ref } = getElement();
			yield actions.goTo( ref.getAttribute( 'data-target' ), 'back' );
		},
		*home() {
			yield actions.goTo( 'root', 'back' );
		},
		onKeydown( event ) {
			if ( 'Escape' === event.key ) {
				event.preventDefault();
				actions.close();
			}
		},
	},
} );

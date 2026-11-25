/**
 * Escape closes the navigation: first an open submenu, then the open mobile
 * menu. The menus are opened and closed by jcore-utils (data-jtoggle), so
 * Escape presses the same button a click would, and jcore-utils keeps its
 * own state and aria-expanded right.
 */

/**
 * Press a jcore-utils toggle button: mousedown, then click, as a mouse would.
 *
 * @param {HTMLElement|null} button The button.
 */
const press = ( button ) => {
	if ( ! button ) {
		return;
	}
	button.dispatchEvent(
		new window.MouseEvent( 'mousedown', {
			bubbles: true,
			cancelable: true,
		} )
	);
	button.click();
};

document.addEventListener( 'keydown', ( event ) => {
	if ( event.key !== 'Escape' ) {
		return;
	}
	document
		.querySelectorAll( '.wp-block-lohko-navigation' )
		.forEach( ( nav ) => {
			const submenu = nav.querySelector( '.menu-level-1.open' );
			if ( submenu ) {
				const item = submenu.closest( '.menu-item-level-0' );
				// Back to the parent link first (its focus would open the
				// submenu again after the close), then close.
				item?.querySelector( ':scope > .menu-link' )?.focus();
				window.setTimeout(
					() => press( item?.querySelector( ':scope > .toggle' ) ),
					60
				);
				return;
			}
			const menu = nav.querySelector( '.menu-level-0.mobile-open' );
			if ( menu ) {
				const hamburger = nav.querySelector( '.hamburger' );
				press( hamburger );
				hamburger?.focus();
			}
		} );
} );

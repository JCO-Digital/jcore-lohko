/**
 * Front end runtime for the Rive animation block.
 *
 * Uses the plain canvas runtime rather than the React wrapper, which keeps the
 * view bundle to the Rive runtime alone.
 */
import { Alignment, Fit, Layout, Rive } from '@rive-app/canvas';

document
	.querySelectorAll( '.wp-block-lohko-rive-animation' )
	.forEach( ( container ) => {
		const { riveFileUrl, riveStateMachine } = container.dataset;

		if ( ! riveFileUrl ) {
			return;
		}

		const canvas = document.createElement( 'canvas' );
		container.appendChild( canvas );

		const rive = new Rive( {
			canvas,
			src: riveFileUrl,
			autoplay: true,
			stateMachines: riveStateMachine ? [ riveStateMachine ] : undefined,
			layout: new Layout( {
				fit: Fit.FitHeight,
				alignment: Alignment.BottomCenter,
			} ),
			onLoad: () => rive.resizeDrawingSurfaceToCanvas(),
		} );

		window.addEventListener( 'resize', () =>
			rive.resizeDrawingSurfaceToCanvas()
		);
	} );

import React from '@wordpress/element';
import { createRoot } from '@wordpress/element';
import Rive, { Alignment, Fit, Layout } from '@rive-app/react-canvas';

document
	.querySelectorAll('.wp-block-jcore-rive-animation')
	.forEach((container) => {
		const riveFileUrl = container.dataset.riveFileUrl;
		const stateMachineName = container.dataset.riveStateMachine;

		if (riveFileUrl) {
			createRoot(container).render(
				<Rive
					src={riveFileUrl}
					layout={
						new Layout({
							fit: Fit.FitHeight,
							alignment: Alignment.BottomCenter,
						})
					}
					stateMachines={stateMachineName ? [stateMachineName] : []}
				/>
			);
		}
	});

import { getContext, getElement, store } from '@wordpress/interactivity';

const getParent = (element) => {
	if (!element.getAttribute('data-accordion-id')) {
		element = element.closest('[data-accordion-id]');
	}
	return element;
};

const getAccordionId = (element) => {
	const accordionEl = getParent(element);
	return accordionEl.getAttribute('data-accordion-id');
};

store('jcore/accordions', {
	state: {
		get isActive() {
			const context = getContext();
			const { ref } = getElement();
			return context.currentAccordion === getAccordionId(ref);
		},
	},
	actions: {
		parseUrl() {
			const context = getContext();
			// Anchor link from url #accordion-<id>
			const url = window.location.href;
			const id = url.split('#')[1];
			if (!id) return;
			if (!id.startsWith('accordion-')) return;
			const pureId = id.split('-')[1];
			if (!pureId) return;
			context.currentAccordion = pureId;
		},
		openAccordion() {
			const { ref } = getElement();
			const context = getContext();
			const accordionEl = getParent(ref);
			const id = getAccordionId(ref);
			if (!id) return;
			const currentlyActive = context.currentAccordion === id;
			context.currentAccordion = currentlyActive ? '' : id;
			if (!currentlyActive) {
				accordionEl.scrollIntoView({ behavior: 'smooth' });
				window.history.pushState(null, '', `#${accordionEl.id}`);
			} else {
				window.history.pushState(
					null,
					'',
					window.location.href.split('#')[0]
				);
			}
		},
	},
});

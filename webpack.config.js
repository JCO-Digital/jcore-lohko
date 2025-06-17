// Import the original config from the @wordpress/scripts package.
const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');

// Add a new entry point by extending the Webpack config.
module.exports = {
	...defaultConfig,
	resolve: {
	  ...defaultConfig.resolve,
	  alias: {
			'media$': path.resolve(__dirname, 'node_modules/@jcodigital/jcore-media/src/media.scss')
	}
	}
};

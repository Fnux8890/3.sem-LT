const path = require("path");
const {SourceMapDevToolPlugin} = require("webpack");
module.exports = {
	mode: "development",
	entry: {
		excersise: {
			import: "./app/views/js/Excersises/excersise1.js",
		},
		login: {
			import: "./app/views/js/login/login.js",
		},
		navbar: {
			import: "./app/views/js/Navbar/navbar.js",
		},
	},
	output: {
		filename: "[name].js",
		path: path.resolve(__dirname, "app/views/js/dist"),
	},
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env"],
					},
				},
			},
			{
				test: /\.js$/,
				enforce: "pre",
				use: ["source-map-loader"]
			},
		],
	},
	optimization: {
		splitChunks: {
			chunks: "async",
			minSize: 20000,
			minRemainingSize: 0,
			minChunks: 1,
			maxAsyncRequests: 30,
			maxInitialRequests: 30,
			enforceSizeThreshold: 50000,
			cacheGroups: {
				defaultVendors: {
					test: /[\\/]node_modules[\\/]/,
					priority: -10,
					reuseExistingChunk: true,
				},
				default: {
					minChunks: 2,
					priority: -20,
					reuseExistingChunk: true,
				},
			},
		},
	},

	plugins: [
		new SourceMapDevToolPlugin({filename: "[file].map"})
	]
};

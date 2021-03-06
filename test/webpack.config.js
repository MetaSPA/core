const path = require("path");
const HTMLPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
// const OfflinePlugin = require('offline-plugin')

const timeStamp = new Date().getTime();

module.exports = {
    entry: {
        bundle: "./index.tsx",
    },
    output: {
        pathinfo: true,
        filename: `static/${timeStamp}/js/[name].js`,
        path: path.resolve(__dirname, "dist"),
        publicPath: "/",
    },
    mode: "development",
    context: path.resolve(__dirname, "src"),
    watch: false,
    devtool: "source-map",
    module: {
        rules: [
            { parser: { system: false } },
            {
                test: /\.(ts|tsx)$/,
                exclude: [path.resolve(__dirname, "node_modules")],
                enforce: "pre",
                use: ["babel-loader", "ts-loader"],
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(png|jpg|gif|ico)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: `[name].[ext]`,
                            publicPath: "/",
                        },
                    },
                ],
            },
            {
                test: /\.exec\.js$/,
                use: ["script-loader"],
            },
        ],
    },
    resolve: {
        modules: [path.resolve(__dirname, "src"), "node_modules"],
        extensions: [".ts", ".tsx", ".js"],
        alias: {
            'react': 'preact-compat',
            'react-dom': 'preact-compat'
        }
    },
    devServer: {
        host: "0.0.0.0",
        port: 3200,
        contentBase: path.resolve(__dirname, "dist"),
        publicPath: "/",
        headers: {
            "Service-Worker-Allowed": "/",
        },
        historyApiFallback: {
            rewrites: [
                {
                    from: /^\/$/,
                    to: "/index.html",
                },
                {
                    from: /./,
                    to: "/index.html",
                },
            ],
        },
        inline: true,
        watchOptions: {
            watch: true,
        },
        disableHostCheck: true,
        compress: true,
        proxy: {
            "/react/public": {
                target: "http://127.0.0.1:8081/",
                changeOrigin: true,
            },
            "/vue/public": {
                target: "http://127.0.0.1:8081/",
                changeOrigin: true,
            }
        },
    },
    plugins: [
        new HTMLPlugin({
            title: "test",
            template: path.resolve(__dirname, "src/index.ejs"),
        }),
        // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        /* new OfflinePlugin({
			AppCache: false,
			appShell: '/',
			ServiceWorker: {
                minify: false,
				events: true,
				output: 'static/sw.js',
				publicPath: '/dist/static/sw.js',
				scope: '/'
			},
			caches: {
				main: [
					`static/${timeStamp}/js/vendor.js`,
					`static/${timeStamp}/js/bundle.js`
				],
				//additional: [`static/${timeStamp}/static/*.png`]
			},
			externals: ['/'],
			autoUpdate: 1000 * 60 * 60 * 24,
			safeToUseOptionalCaches: true
		}) */
    ],
    optimization: {
        splitChunks: {
            chunks: "async",
            minSize: 0,
            minChunks: 1,
            automaticNameDelimiter: "~",
            name: true,
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all",
                },
                commons: {
                    test: /[\\/]node_modules[\\/](react|react-dom)[\\/]./,
                    name: "react",
                    chunks: "all",
                },
                commons: {
                    test: /[\\/]node_modules[\\/](@babel|core-js)[\\/]./,
                    name: "polyfill",
                    chunks: "all",
                },
            },
        },
    },
};

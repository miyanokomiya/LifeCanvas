/*!
 * LIFECANVAS
 * v1.0.0 (c) 2016 miyanokomiya.tokyo
 * license MIT
 */
require.config({
    baseUrl: '../src/',

    paths: {
        jquery: 'lib/jquery-2.1.3.min',
    },
});

define(function(require) {
	var App = require("lifeGame/App");

	var main = new App("main", {
		width : 600,
		height : 300
	});

	var sub = new App("sub", {
		width : 300,
		height : 150,
		worldRowCount : 15,
		worldColumnCount : 20
	});
});

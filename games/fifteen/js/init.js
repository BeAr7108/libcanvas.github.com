
// Globalizing LibCanvas variables
LibCanvas.extract();

window.Fifteen = {};

// onDomReady - run our app
atom.dom(function () {

	new Fifteen.Field({
		tile: {
			width : 64,
			height: 64,
			margin: 4
		}
	});
});
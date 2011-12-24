
Mines.Controller = atom.Class({
	Implements: [ atom.Class.Options ],

	options: {
		 tileSize : { width: 24, height: 24 },
		fieldSize : { width: 30, height: 16 },
		switcher  : false,
		mines: 99
	},

	$switcher: null,

	initialize: function (canvas, options) {
		this.setOptions( options );

		var libcanvas = new LibCanvas(canvas, {
			preloadImages: { field : 'im/flag-mine.png' }
		}).listenMouse();

		if (this.options.switcher) {
			atom.dom('.action-switcher-wrapper').removeClass('hidden');
			var toggle = function (e) {
				$switcher.toggleClass( 'active' );
				e.preventDefault();
			};
			var $switcher = this.$switcher = atom
				.dom('.action-switcher')
				.bind('touchstart', toggle)
				.bind('click', toggle);
		}

		libcanvas.addEvent('ready', this.start.bind(this, libcanvas));
	},

	start: function (libcanvas) {
		var field = new Mines.Field( libcanvas, this.options );

		libcanvas.mouse.addEvent({
			click      : this.eventListener(field, false),
			contextmenu: this.eventListener(field, true)
		});

		this.bindTouch( field, libcanvas.mouse );

		this.showStats(field);
	},

	bindTouch: function (field, libcanvas) {
		libcanvas.wrapper.addEventListener( 'touchstart', function (e) {
			field.action( libcanvas.mouse.getOffset(e) , this.isFlagAction() );
			e.preventDefault();
		}.bind(this), false);

		var prevent = function(e){e.preventDefault()};
		libcanvas.wrapper.addEventListener( 'touchmove', prevent, false );
		libcanvas.wrapper.addEventListener( 'touchend' , prevent, false );
	},

	eventListener: function (field, flags) {
		var controller = this;
		return function (e) {
			if (flags || e.button == 0) {
				field.action( e.offset , controller.isFlagAction(flags) );
			}
			e.preventDefault();
		};
	},

	isFlagAction: function (force) {
		if (force) return true;
		return this.$switcher && this.$switcher.hasClass('active');
	},

	showStats: function (field) {
		var $stat = atom.dom('.stat'), $elems = {
			closed   : $stat.find('.tiles-left em'),
			minesLeft: $stat.find('.mines-left em'),
			time     : $stat.find('.time em')
		};

		field.addEvent( 'change', function (property) {
			$elems[property].html( field[property] );
		});
	}

});
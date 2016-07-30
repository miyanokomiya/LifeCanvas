define(function(require) {
	var $ = require("jquery");
	var lifeGameLogic = require("lifeGame/common/logic/lifeGameLogic");
	var canvasUtil = require("lifeGame/common/canvas/canvasUtil");

	/**
	 * アプリ本体
	 * @class App
	 * @namespace lifeGame
	 * @constructor
	 * @param rootId {string} ルートとなるDOMのID
	 * @param option {} オプション
	 */
	var Constructor = function(rootId, option) {
		/**
		 * ルートとなるDOMのID
		 * @property rootId
		 * @type {string}
		 */
		this.rootId = rootId;

		/**
		 * 世界
		 * @property world
		 * @type {number[][]
		 * @default null
		 */
		this.world = null;

		/**
		 * キャンバスDOM
		 * @property canvas
		 * @type {}
		 * @default null
		 */
		this.canvas = null;

		/**
		 * キャンバスの描画要素
		 * @property ctx
		 * @type {}
		 * @default null
		 */
		this.ctx = null;

		/**
		 * ループ用タイマーID
		 * @property timer
		 * @type {number}
		 * @default null
		 */
		this.timer = null;

		//
		// オプション要素
		//

		if (!option) {
			option = {};
		}

		/**
		 * 行数
		 * @property rowCount
		 * @type {number}
		 * @default 50
		 */
		this.rowCount = option.rowCount || 50;

		/**
		 * 列数
		 * @property columnCount
		 * @type {number}
		 * @default 50
		 */
		this.columnCount = option.columnCount || 50;

		/**
		 * 誕生条件
		 * @property birthList
		 * @type {number[]}
		 * @default [3]
		 *
		 */
		this.birthList = option.birthList || [3];

		/**
		 * 生存条件
		 * @property liveList
		 * @type {number[]}
		 * @default [2, 3]
		 *
		 */
		this.liveList = option.liveList || [2, 3];

		/**
		 * 幅
		 * @property width
		 * @type {number}
		 * @default 400
		 */
		this.width = option.width || 400;

		/**
		 * 高さ
		 * @property height
		 * @type {number}
		 * @default 400
		 */
		this.height = option.height || 400;

		/**
		 * ステップ間隔<br>
		 * ミリ秒
		 * @property stepFrame
		 * @type {number}
		 * @default 300
		 */
		this.stepFrame = option.stepFrame || 300;

		this.init();
	};

	/**
	 * 初期化
	 * @method init
	 */
	Constructor.prototype.init = function() {
		this.initDom();
		this.initWorld();
		this.startLoop();
	};

	/**
	 * 世界の初期化
	 * @method initWorld
	 */
	Constructor.prototype.initWorld = function() {
		this.world = [];
		for (var r = 0; r < this.rowCount; r++) {
			this.world[r] = [];
			for (var c = 0; c < this.columnCount; c++) {
				this.world[r][c] = (Math.random() < 0.2) ? 1 : 0;
			}
		}
	};

	/**
	 * 世界クリア
	 * @method clearWorld
	 */
	Constructor.prototype.clearWorld = function() {
		this.world = [];
		for (var r = 0; r < this.rowCount; r++) {
			this.world[r] = [];
			for (var c = 0; c < this.columnCount; c++) {
				this.world[r][c] = 0;
			}
		}
	};

	/**
	 * ループスタート
	 * @method startLoop
	 */
	Constructor.prototype.startLoop = function() {
		var self = this;

		// 2重ループ防止
		if (!this.timer) {
			this.timer = setInterval(function() {
				self.nextStep();
			}, this.stepFrame);
		}
	};

	/**
	 * ループエンド
	 * @method stopLoop
	 */
	Constructor.prototype.stopLoop = function() {
		if (this.timer) {
			clearInterval(this.timer);
			this.timer = null;
		}

	};

	/**
	 * ステップ進む
	 * @method nextStep
	 */
	Constructor.prototype.nextStep = function() {
		var birthList = this.birthList;
		var liveList = this.liveList;
		var canvas = this.canvas;
		var ctx = this.ctx;
		var world = this.world;

		world = lifeGameLogic.getNextWorld(world, birthList, liveList);
		canvasUtil.paintWorld(ctx, world, canvas.width, canvas.height);

		this.world = world;
	};

	/**
	 * DOM初期化
	 * @method initDom
	 */
	Constructor.prototype.initDom = function() {
		var $root = $("#" + this.rootId);

		//
		// キャンバス本体
		//
		var $canvas = $("<canvas>");

		$root.append($canvas);

		this.canvas = $canvas[0];
		this.canvas.width = this.width;
		this.canvas.height = this.height;

		this.ctx = this.canvas.getContext('2d');

		this.bindCanvasEvent(this.canvas);

		//
		// ボタン
		//
		var $init = $("<input type='button'>");
		var $clear = $init.clone();
		var $auto = $init.clone();
		var $step = $init.clone();

		$init.val("INIT");
		$clear.val("CLEAR");
		$auto.val("STOP");
		$step.val("STEP");

		$root.append($("<br>"));
		$root.append($init);
		$root.append($clear);
		$root.append($auto);
		$root.append($step);

		this.bindButtonEvent($init, $clear, $auto, $step);
	};

	/**
	 * ボタンへのイベントハンドラ
	 * @method bindButtonEvent
	 * @param init {} 初期化イベントハンドラ設定先
	 * @param clear {} クリアイベントハンドラ設定先
	 * @param auto {} 自動イベントハンドラ設定先
	 * @param step {} ステップイベントハンドラ設定先
	 */
	Constructor.prototype.bindButtonEvent = function(init, clear, auto, step) {
		var self = this;

		$(init).on("click", function(e) {
			self.initWorld();
			canvasUtil.paintWorld(self.ctx, self.world, self.canvas.width, self.canvas.height);
		});

		$(clear).on("click", function(e) {
			self.clearWorld();
			canvasUtil.paintWorld(self.ctx, self.world, self.canvas.width, self.canvas.height);
		});

		// ループ用タイマー
		var timer = null;

		$(auto).on("click", function(e) {
			if (self.timer) {
				$(this).val("AUTO");
				self.stopLoop();
			} else {
				$(this).val("STOP");
				self.startLoop();
			}
		});

		$(step).on("click", function(e) {
			self.nextStep();
		});
	};

	/**
	 * キャンバスへのイベントハンドラ
	 * @method bindCanvasEvent
	 * @param target {} イベントハンドラ設定先
	 */
	Constructor.prototype.bindCanvasEvent = function(target) {
		var self = this;

		// ドラッグ処理分岐用
		var dragState = 0;

		// ドラッグ開始時に自動ループだったフラグ
		var isLoop = false;

		$(target).on("mousedown touchstart", function(e) {
			var world = self.world;
			var canvas = self.canvas;
			var ctx = self.ctx;

			var p = canvasUtil.getCursorPoint(e);
			var state = canvasUtil.getCellStateOnPoint(p.x, p.y, world, canvas.width, canvas.height);

			// ドラッグ状態決定
			if (state === 0) {
				dragState = 1;
				canvasUtil.changeCellOnPoint(p.x, p.y, world, canvas.width, canvas.height, 1);
			} else if (state === 1) {
				dragState = 2;
				canvasUtil.changeCellOnPoint(p.x, p.y, world, canvas.width, canvas.height, 0);
			} else {
				dragState = 0;
			}

			canvasUtil.paintWorld(ctx, world, canvas.width, canvas.height);

			if (self.timer) {
				isLoop = true;
				// ループ止める
				self.stopLoop();
			} else {
				isLoop = false;
			}
		});

		$(target).on("mousemove touchmove", function(e) {
			e.preventDefault();

			var world = self.world;
			var canvas = self.canvas;
			var ctx = self.ctx;

			var p = canvasUtil.getCursorPoint(e);
			var rePaint = false;

			if (dragState === 1) {
				rePaint = canvasUtil.changeCellOnPoint(p.x, p.y, world, canvas.width, canvas.height, 1);
			} else if (dragState === 2) {
				rePaint = canvasUtil.changeCellOnPoint(p.x, p.y, world, canvas.width, canvas.height, 0);
			} else {
				// 何もしない
			}

			// 変化ありなら再描画
			if (rePaint) {
				canvasUtil.paintWorld(ctx, world, canvas.width, canvas.height);
			}
		});

		$(target).on("mouseup mouseleave touchend touchcancel", function(e) {
			dragState = 0;

			if (isLoop) {
				// ループ再開
				self.startLoop();
			}
		});
	};

	/**
	 * アプリ削除<br>
	 * 本メソッド実行後に他メソッド実行すると動作不定
	 * @method dispose
	 */
	Constructor.prototype.dispose = function() {
		this.stopLoop();
		$("#" + this.rootId).empty();
	};

	return Constructor;
});

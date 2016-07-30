define(function(require) {
	/**
	 * キャンバス処理
	 * @class canvasUtil
	 * @namespace lifeGame.common.canvas
	 * @static
	 */
	var ret = {
		/**
		 * 長さの分割線を取得する(両端含む)
		 * @method getSplitLineList
		 * @param length {number} 長さ
		 * @param count {number} セル数
		 * @return {number[]} 分割線位置リスト
		 */
		getSplitLineList : function(length, count) {
			var ret = [];

			var unitLength = length / count;

			var current = 0;
			while (ret.length <= count) {
				current += unitLength;
				ret.push(current);
			}

			return ret;
		},

		/**
		 * 世界の色付を行う
		 * @method paintWorld
		 * @param ctx {} 描画要素
		 * @param world {number[][]} 世界
		 * @param width {number} 幅
		 * @param height {number} 高さ
		 */
		paintWorld : function(ctx, world, width, height) {
			var unitWidth = width / world[0].length;
			var unitHeight = height / world.length;

			var r,c;

			for (r = 0; r < world.length; r++) {
				for (c = 0; c < world[r].length; c++) {
					if (world[r][c] === 1) {
						ctx.fillStyle = "green";
					} else {
						ctx.fillStyle = "black";
					}
					ctx.fillRect(c * unitWidth, r * unitHeight, unitWidth, unitHeight);
				}
			}

			// 枠線
			ctx.strokeStyle = "#696969";
			ctx.beginPath();
			for (r = 0; r <= world.length; r++) {
				ctx.moveTo(0, r * unitHeight);
				ctx.lineTo(width, r * unitHeight);
			}
			for (c = 0; c <= world[0].length; c++) {
				ctx.moveTo(c * unitWidth, 0);
				ctx.lineTo(c * unitWidth, height);
			}
			ctx.stroke();
		},

		/**
		 * 指定座標のセルを取得する
		 * @method getCellOnPoint
		 * @param x {number} x座標
		 * @param y {number} y座標
		 * @param unitWidth {number} セル幅
		 * @param unitHeight {number} セル高さ
		 * @return {number[]} [行インデックス, 列インデックス]
		 */
		getCellOnPoint : function(x, y, unitWidth, unitHeight) {
			var ret = [];

			ret[0] = Math.floor(y / unitHeight);
			ret[1] = Math.floor(x / unitWidth);

			return ret;
		},

		/**
		 * 指定座標のセル状態を取得する
		 * @method getCellStateOnPoint
		 * @param x {number} x座標
		 * @param y {number} y座標
		 * @param world {number[][]} 世界
		 * @param width {number} 幅
		 * @param height {number} 高さ
		 * @return {number} 状態
		 */
		getCellStateOnPoint : function(x, y, world, width, height) {
			var ret = 0;

			var unitWidth = width / world[0].length;
			var unitHeight = height / world.length;

			var cell = this.getCellOnPoint(x, y, unitWidth, unitHeight);
			if (0 <= cell[0] && cell[0] < world.length && 0 <= cell[1] && cell[1] < world[0].length) {
				ret = world[cell[0]][cell[1]];
			}

			return ret;
		},

		/**
		 * 指定座標のセルを反転する
		 * @method toggleCellOnPoint
		 * @param x {number} x座標
		 * @param y {number} y座標
		 * @param world {number[][]} 世界
		 * @param width {number} 幅
		 * @param height {number} 高さ
		 */
		toggleCellOnPoint : function(x, y, world, width, height) {
			var unitWidth = width / world[0].length;
			var unitHeight = height / world.length;

			var cell = this.getCellOnPoint(x, y, unitWidth, unitHeight);
			if (0 <= cell[0] && cell[0] < world.length && 0 <= cell[1] && cell[1] < world[0].length) {
				// 0と1を反転
				world[cell[0]][cell[1]] = (world[cell[0]][cell[1]] === 0) ? 1 : 0;
			}
		},

		/**
		 * 指定座標のセル状態を更新する
		 * @method changeCellOnPoint
		 * @param x {number} x座標
		 * @param y {number} y座標
		 * @param world {number[][]} 世界
		 * @param width {number} 幅
		 * @param height {number} 高さ
		 * @param state {number} 変更先状態
		 * @return {bool} 変化があったフラグ
		 */
		changeCellOnPoint : function(x, y, world, width, height, state) {
			var ret = false;

			var unitWidth = width / world[0].length;
			var unitHeight = height / world.length;

			var cell = this.getCellOnPoint(x, y, unitWidth, unitHeight);
			if (0 <= cell[0] && cell[0] < world.length && 0 <= cell[1] && cell[1] < world[0].length) {
				ret = (world[cell[0]][cell[1]] !== state);

				// 変更
				world[cell[0]][cell[1]] = state;
			}

			return ret;
		},

		/**
		 * マウスイベント発生座標取得
		 * @method getCursorPoint
		 * @param e {} イベント引数
		 * @return {x,y} キャンバス上の座標
		 */
		getCursorPoint : function(e) {
			var p = null;

			// jqueryイベントに対応
			var event = e.originalEvent || e;

			// タッチイベントの場合
			if (event.touches && event.touches.length > 0) {
				event = event.touches[0];
			}

			var rect = event.target.getBoundingClientRect();

			// 要素の位置座標を計算
			var positionX = rect.left + window.pageXOffset;
			var positionY = rect.top + window.pageYOffset;

			// ターゲット上の座標取得
			p = {
				x : event.pageX  - positionX,
				y : event.pageY  - positionY
			};

			return p;
		},
	};

	return ret;
});

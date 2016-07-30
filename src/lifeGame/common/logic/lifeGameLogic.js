define(function(require) {
	/**
	 * ライフゲームロジック群
	 * @class lifeGameLogic
	 * @namespace lifeGame.common.logic
	 * @static
	 */
	var ret = {
		/**
		 * 周囲セルの状態を取得する<br>
		 * 0 | 1 | 2
		 * 3 |   | 4
		 * 5 | 6 | 7
		 * @method getAroundState
		 * @param world {number[][]} ワールド情報
		 * @param rowIndex {number} 行インデックス
		 * @param columnIndex {number} 列インデックス
		 * @return {number[]} 周囲セル情報(要素数8の配列)
		 */
		getAroundState : function(world, rowIndex, columnIndex) {
			var ret = [0,0,0,0,0,0,0,0];

			// 上段判定
			if (rowIndex - 1 >= 0) {
				if (columnIndex - 1 >= 0) {
					ret[0] = world[rowIndex - 1][columnIndex - 1];
				}

				ret[1] = world[rowIndex - 1][columnIndex];

				if (columnIndex + 1 <= world[rowIndex - 1].length) {
					ret[2] = world[rowIndex - 1][columnIndex + 1];
				}
			}

			// 中段判定
			if (columnIndex - 1 >= 0) {
				ret[3] = world[rowIndex][columnIndex - 1];
			}

			if (columnIndex + 1 <= world[rowIndex].length) {
				ret[4] = world[rowIndex][columnIndex + 1];
			}

			// 下段判定
			if (rowIndex + 1 < world.length) {
				if (columnIndex - 1 >= 0) {
					ret[5] = world[rowIndex + 1][columnIndex - 1];
				}

				ret[6] = world[rowIndex + 1][columnIndex];

				if (columnIndex + 1 <= world[rowIndex + 1].length) {
					ret[7] = world[rowIndex + 1][columnIndex + 1];
				}
			}

			return ret;
		},

		/**
		 * 周囲セルの生存数を取得する(自分含まない)
		 * @method getAroundLifeCount
		 * @param world {number[][]} ワールド情報
		 * @param rowIndex {number} 行インデックス
		 * @param columnIndex {number} 列インデックス
		 * @return {number} 周囲セルの生存数
		 */
		getAroundLifeCount : function(world, rowIndex, columnIndex) {
			var info = this.getAroundState(world, rowIndex, columnIndex);
			var count = info.filter(function(val) {
				return (val === 1);
			}).length;

			return count;
		},

		/**
		 * 次期の状態を取得する
		 * @method getNextState
		 * @param world {number[][]} ワールド情報
		 * @param rowIndex {number} 行インデックス
		 * @param columnIndex {number} 列インデックス
		 * @param birthList {number[]} 誕生セル数条件
		 * @param liveList {number[]} 生存セル数条件
		 * @return {number} 次期状態
		 */
		getNextState : function(world, rowIndex, columnIndex, birthList, liveList) {
			var count = this.getAroundLifeCount(world, rowIndex, columnIndex);
//			console.log(rowIndex + ", " + columnIndex + " : " + count);

			var current = world[rowIndex][columnIndex];

			// デフォを死滅にする
			var next = 0;

			if (current === 1) {
				// 現在生存中
				if (liveList.indexOf(count) !== -1) {
					// 生存
					next = 1;
				}
			} else {
				// 現在死滅中
				if (birthList.indexOf(count) !== -1) {
					// 誕生
					next = 1;
				}
			}

			return next;
		},

		/**
		 * 次期世界を取得する
		 * @method getNextWorld
		 * @param world {number[][]} ワールド情報
		 * @param birthList {number[]} 誕生セル数条件
		 * @param liveList {number[]} 生存セル数条件
		 * @return {number[][]} ワールド情報
		 */
		getNextWorld : function(world, birthList, liveList) {
			var nextWorld = [];

			for (var r = 0; r < world.length; r++) {
				nextWorld[r] = [];
				for (var c = 0; c < world[r].length; c++) {
					nextWorld[r][c] = this.getNextState(world, r, c, birthList, liveList);
				}
			}

			return nextWorld;
		},
	};

	return ret;
});
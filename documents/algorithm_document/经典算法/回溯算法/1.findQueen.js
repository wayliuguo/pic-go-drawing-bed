// 定义一个 8 * 8 的棋盘，用来放置皇后
const board = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
];

// 记录一共有多少种方案
let count = 0;

// 搜索皇后位置
function findQueen(i) {
    // 当前操作行数 > 7 表示一个棋盘搜索完成
    if (i > 7) {
        // 打印得到的结果
        // console.log(board);
        // 此时方案数量 + 1
        count++;
        return;
    }
    // 每行有 8 个位置可供选择
    for (let j = 0; j < 8; j++) {
        // 检查皇后摆放的位置是否合适
        if (check(i, j)) {
            board[i][j] = 1;
            findQueen(i + 1);
            // 还原数据
            board[i][j] = 0;
        }
    }
}

// 检查当前位置是否合适
function check(k, j) {
    // 检查横向和纵向是否有皇后棋子存在
    for (let i = 0; i < 8; i++) {
        if (board[i][j] === 1) {
            return false;
        }
    }
    // 检查左斜方向是否有皇后
    for (let i = k - 1, m = j - 1; i >= 0 && m >= 0; i--, m--) {
        if (board[i][m] === 1) {

            return false;
        }
    }
    // 检查右斜方向是否有皇后
    for (let i = k - 1, m = j + 1; i >= 0 && m <= 7; i--, m++) {
        if (board[i][m] === 1) {
            return false;
        }
    }
    // 此时表示当前位置可以放置棋子
    return true;
}

findQueen(0);
console.log(count)

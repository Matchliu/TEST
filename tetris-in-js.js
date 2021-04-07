/*
 * Author: Chonghan Chen (paulcccccch@gmail.com)
 * -----
 * Last Modified: Wednesday, 24th March 2021 11:53:10 am
 * Modified By: Chonghan Chen (paulcccccch@gmail.com)
 * Modified By: Kobe Norris (KobeNorrisWu@gmail.com)
 * -----
 * Copyright (c) 2021 IceWould Information Technology Co., Ltd.
 */


/**
 * 定义方块和画面大小，在完成逻辑之前最好先不要动哦。 
 */

var score=0;
var Speed=900;
var BLOCKSIZE = 20;	//in pixel
var ROW_NUM = 20;
var COL_NUM = 10;

/*
    定义全部的七种方块。前三种已经定义好。
    定义完之后，请把 PIECE_NUM 设置成 7，以启用所有的方块。
*/
var PIECE_NUM = 7;
var bar = [[0, 0], [-1, 0], [1, 0], [2, 0]];
var sevenShape = [[0, -1], [0, 0], [1, 0], [2, 0]];
var square = [[0, 0], [1, 0], [0, 1], [1, 1]];
/************************
    YOUR CODE STARTS
*************************/
var sevenShapeReversed = [[0, 0], [1, 0], [2, 0], [0, 1]];
var hump = [[0, 0], [0, 1], [0, 2], [1, 1]];
var zShape = [[0, 0], [1, 0], [0, -1], [1, 1]];
var zShapeReversed = [[0, 0], [1, 0], [0, 1], [1, -1]];
/************************
    YOUR CODE ENDS
*************************/

var LAYOUTS = [square, bar, sevenShape, sevenShapeReversed, hump, zShape, zShapeReversed];
var COLORS = ['red', 'blue', 'pink', 'purple', 'silver', 'orange', 'grey'];

// 定义储存游戏板的二维数组，以存储方块的状态
// 并初始化各项为 null
var occupationMatrix = new Array(20);
for (var i = 0; i < ROW_NUM; i++) {
    occupationMatrix[i] = new Array(COL_NUM);
    for (var j = 0; j < COL_NUM; j++) {
        occupationMatrix[i][j] = null;
    }
}


// 生成一个新的 piece ，并插入到 gameBoard 中
function generatePiece() {
    // 获取 HTML 文件中的内容板 --> gameBoard
    var gameBoard = document.getElementById('gameBoard');

    // 随机获取一种方块
    pieceIdx = Math.floor(PIECE_NUM * Math.random())

    // 生成一个方块的 DOM （其实是 HTML 中的一个 <div> 标签）
    // getPiece 这个函数是需要被完善的 (内部的 blockList 和其他 attributes 的实现)
    var newPiece = initializePiece(pieceIdx);

    // 将这个 piece 挂到 gameBoard 内容板里
    newPiece.id = "currentPiece";
    gameBoard.appendChild(newPiece);

    // 初始化 piece 位置
    setPosition(newPiece, 0, 5);
}

// 初始化 piece 的 attribute 及其 children ( blockList )
function initializePiece(pieceTypeIdx) {
    /*
        在这个函数里，你需要返回一个 <div> 标签。
        你需要根据 pieceIdx，来从 LAYOUTS 这个变量中拿出对应的方块，

        提示：
        - 你可以使用 document.createElement 来生成 DOM
        - 你可以使用 DOM 变量的 .appendChild 方法来把其它 DOM 塞进去
        - 你可以直接设置 DOM 变量的各种字段，这就和在 HTML 标签里加各种参数效果一样
    */

    /************************
        YOUR CODE STARTS
    *************************/
    var newPiece = document.createElement('div');

    newPiece.className = 'piece';
    newPiece.layout = LAYOUTS[pieceTypeIdx]

    for (var i = 0; i < 4; i++) {
        var newBlock = document.createElement('div')
        newBlock.style.width = BLOCKSIZE + 'px';
        newBlock.style.height = BLOCKSIZE + 'px';
        newBlock.style.background = COLORS[pieceTypeIdx];
        newBlock.className = 'block';
        newPiece.appendChild(newBlock);
    }
    /************************
        YOUR CODE ENDS
    *************************/

    return newPiece;
}

// 重新定义 piece 的位置
function setPosition(piece, row, col) {
    /**
     * 请认真阅读这个函数。它的参数是一个 piece，以及它的新的行和列。
     */

    // 拿到 piece 的所有子节点
    //      blockList 就是一个数组，比如 blockList[0] 就是第一个 DOM
    var blockList = piece.children;

    // layout 就是第一题 “定义方块” 中的一种
    var layout = piece.layout;

    // 把新位置存储在母节点的对应属性中（只是记录一下而已，对页面没有什么影响）
    piece.rowPos = row;
    piece.colPos = col;

    // 设置母节点的位置 :
    //      top --> 与 DOM 中 gameBoard 上边缘的距离
    //      left --> 与 DOM 中 gameBoard 左边缘的距离
    piece.style.top = row * BLOCKSIZE + 'px';
    piece.style.left = col * BLOCKSIZE + 'px';

    // 设置所有子节点的位置，并储存
    for (var i = 0; i < piece.children.length; i++) {
        block = blockList[i]
        block.rowPos = row + layout[i][0];
        block.colPos = col + layout[i][1];
        block.style.top = block.rowPos * BLOCKSIZE + 'px';
        block.style.left = block.colPos * BLOCKSIZE + 'px';
    }
}

function updateOccupationMatrix(piece) {
    var blockList = piece.children;
    var targetCol, targetRow;
    for (var idx = 0; idx < 4; idx++) {
        targetCol = blockList[idx].colPos;
        targetRow = blockList[idx].rowPos;
        occupationMatrix[targetRow][targetCol] = blockList[idx];
    }
}

function moveLeft(piece) {
    /**
     * 这个函数会让当前方块往左移动一格
     * 注意要判断是否已经靠到墙上了！
     */

    /************************
        YOUR CODE STARTS
    *************************/
        var blockList = piece.children;
    if (blockList[0].colPos > 0 && //确认所有的方块在旋转之后都能左移而不出边界
        blockList[1].colPos > 0 && 
        blockList[2].colPos > 0 && 
        blockList[3].colPos > 0 &&
        occupationMatrix[blockList[0].rowPos][blockList[0].colPos-1] == null &&
        occupationMatrix[blockList[1].rowPos][blockList[1].colPos-1] == null &&
        occupationMatrix[blockList[2].rowPos][blockList[2].colPos-1] == null &&
        occupationMatrix[blockList[3].rowPos][blockList[3].colPos-1] == null) {
        for (var idx = 0; idx < 4; idx++){
            blockList[idx].colPos --;
            blockList[idx].style.left = blockList[idx].colPos * BLOCKSIZE + 'px';
        }
    }
    /************************
        YOUR CODE ENDS
    *************************/
}

function moveRight(piece) {
    /**
     * 这个函数会让当前方块往右移动一格
     * 注意要判断是否已经靠到墙上了！
     */

    /************************
        YOUR CODE STARTS
    *************************/
        var blockList = piece.children;
        if (blockList[0].colPos < 9 && //确认所有的方块在旋转之后都能右移而不出边界
            blockList[1].colPos < 9 && 
            blockList[2].colPos < 9 && 
            blockList[3].colPos < 9 &&
            occupationMatrix[blockList[0].rowPos][blockList[0].colPos+1] == null &&
            occupationMatrix[blockList[1].rowPos][blockList[1].colPos+1] == null &&
            occupationMatrix[blockList[2].rowPos][blockList[2].colPos+1] == null &&
            occupationMatrix[blockList[3].rowPos][blockList[3].colPos+1] == null)
            {
                for (var idx = 0; idx < 4; idx++){
                    blockList[idx].colPos ++;
                    blockList[idx].style.left = blockList[idx].colPos * BLOCKSIZE + 'px';
                }
            }


    /************************
        YOUR CODE ENDS
    *************************/
}

function pieceMoveDown() {
    /*
        每调用一次这个函数，当前的方块就会下落一格。
        请完成这个函数里所有的下落逻辑。
        提示：
        - 可以尝试使用 setPosition 函数
        - 先完成 isMoveDownValid 这个函数，来判断方块下落是否到底
        - 落到底之后，务必把 piece 的 id 设置成空 (piece.id = "")，调用 check 函数检查游戏状态，然后再次调用 generatePiece，生成下一块 piece。
    */

    /************************
        YOUR CODE STARTS
    *************************/
    var currentPiece = document.getElementById('currentPiece');
    var blockList = currentPiece.children;
    if(isMoveDownValid(currentPiece))
    {
        for (var idx = 0; idx < 4; idx++){
            blockList[idx].rowPos ++;
            blockList[idx].style.top = blockList[idx].rowPos * BLOCKSIZE + 'px';
        }
    }
    
    else
    {
        updateOccupationMatrix(currentPiece);
        currentPiece.id="";
        generatePiece(); 
    }
    


   console.log(123);

    /************************
        YOUR CODE ENDS
    *************************/

}

function fallToBottom(piece) {
    /**
     * 这个函数会让方块一路落到最底
     * 调用 isMoveDownValid 判断是否可以下落
     */

    /************************
        YOUR CODE STARTS
    *************************/
    var blockList = piece.children;
    if(isMoveDownValid(piece))
    {
        for(var row=0; isMoveDownValid(piece); row++)
        {
            for (var idx = 0; idx < 4; idx++)
                blockList[idx].rowPos ++;
        }
    }
    for (var idx = 0; idx < 4; idx++){
        blockList[idx].style.top = blockList[idx].rowPos * BLOCKSIZE + 'px';
   }

    /************************
        YOUR CODE ENDS
    *************************/
}

function isMoveDownValid(piece) {
    /*
        如果方块可以继续下落，返回 True
        否则返回 False	
    */

    /************************
        YOUR CODE STARTS
    *************************/
    var blockList = piece.children;
    if (blockList[0].rowPos < 19 && 
        blockList[1].rowPos < 19 && 
        blockList[2].rowPos < 19 && 
        blockList[3].rowPos < 19 &&
        //确认所有的方块在旋转之后都能下移而不出边界
        occupationMatrix[blockList[0].rowPos + 1][blockList[0].colPos] == null &&
        occupationMatrix[blockList[1].rowPos + 1][blockList[1].colPos] == null &&
        occupationMatrix[blockList[2].rowPos + 1][blockList[2].colPos] == null &&
        occupationMatrix[blockList[3].rowPos + 1][blockList[3].colPos] == null){//确认所有的方块能在旋转之后能够下移且下一行无方块
        return true;   
    }
    else{
        return false;
    }
    /************************
        YOUR CODE ENDS
    *************************/
}

function rotate(piece) {
    /**
     * 这个函数可以顺时针旋转当前方块
     * 可能会用到一点线性代数的知识（百度：旋转矩阵）
     * 也可以用坐标系旋转理解（不懂抓 Kobe 来问）
     * 拿笔和纸算一下就好啦～
     * 感觉有难度的话请寻求帮助！
     */

    /************************
        YOUR CODE STARTS
    *************************/
        


     var distance = new Array(4);
        for (var i = 0; i < 4; i++) {
            distance[i] = null;
        }
        var distance2 = new Array(4);
        for (var i = 0; i < 4; i++) {
            distance2[i] = null;
        }
        var distancecol = new Array(4);
        for (var i = 0; i < 4; i++) {
            distancecol[i] = null;
        }
        var distancerow = new Array(4);
        for (var i = 0; i < 4; i++) {
            distancerow[i] = null;
        }
    var blockList = piece.children;
    //alert("az");
    for (var idx = 0; idx < 4; idx++){
    distance[idx]=blockList[idx].colPos-blockList[0].colPos;
    distance2[idx]=blockList[idx].rowPos-blockList[0].rowPos;
    distancecol[idx]=blockList[0].colPos+distance2[idx];
    distancerow[idx]=blockList[0].rowPos-distance[idx];
    }
    if(distancerow[0] <= 19 && 
        distancerow[1] <= 19 && 
        distancerow[2] <= 19 && 
        distancerow[3] <= 19 &&
        distancecol[0] >= 0 && //确认所有的方块在旋转之后都能左移而不出边界
        distancecol[1] >= 0 && 
        distancecol[2] >= 0 && 
        distancecol[3] >= 0 &&
        distancecol[0] <= 9 && //确认所有的方块在旋转之后都能右移而不出边界
        distancecol[1] <= 9 && 
        distancecol[2] <= 9 && 
        distancecol[3] <= 9 &&
        occupationMatrix[distancerow[0]][distancecol[0]] == null &&
        occupationMatrix[distancerow[1]][distancecol[1]] == null &&
        occupationMatrix[distancerow[2]][distancecol[2]] == null &&
        occupationMatrix[distancerow[3]][distancecol[3]] == null)
        {
            //alert("Over");
            for (var idx = 0; idx < 4; idx++)
            {
                blockList[idx].colPos=blockList[0].colPos+distance2[idx];
                blockList[idx].rowPos=blockList[0].rowPos-distance[idx];
                blockList[idx].style.left = blockList[idx].colPos * BLOCKSIZE + 'px';
                blockList[idx].style.top = blockList[idx].rowPos * BLOCKSIZE + 'px';
            }
            //blockList[0].style.left = blockList[idx].colPos * BLOCKSIZE + 'px';
            //blockList[0].style.top = blockList[idx].rowPos * BLOCKSIZE + 'px';

        }
    
    // else
    // {
    //     alert("Game Over");
    //     for (var idx = 0; idx < 4; idx++)
    //     {
    //         blockList[idx].colPos=blockList[0].colPos+distance2[idx];
    //         blockList[idx].rowPos=blockList[0].colPos-distance[idx];
    //         blockList[idx].style.left = blockList[idx].colPos * BLOCKSIZE + 'px';
    //         blockList[idx].style.top = blockList[idx].rowPos * BLOCKSIZE + 'px';
    //     }
    //     //blockList[0].style.left = blockList[idx].colPos * BLOCKSIZE + 'px';
    //     //blockList[0].style.top = blockList[idx].rowPos * BLOCKSIZE + 'px';


    // }


    /************************
        YOUR CODE ENDS
    *************************/
}

function rotateAntiClock(piece) {
    /**
     * 这个函数可以逆时针旋转当前方块
     * 可能会用到一点线性代数的知识（百度：旋转矩阵）
     * 也可以用坐标系旋转理解（不懂抓 Kobe 来问）
     * 拿笔和纸算一下就好啦～
     * 感觉有难度的话请寻求帮助！
     */

    /************************
        YOUR CODE STARTS
    *************************/
    /************************
        YOUR CODE ENDS
    *************************/
}

function check() {
    /**
     * 现在，我们需要在每次下落到底后，消除几行方块
     * 或者，若是下落之后，方块触碰到了顶端，我们要判断游戏结束
     * 这个函数需要反复被调用，一旦发现对应情况，就调用对应的函数
     * 提示：你可以先试着完成 rowFull 和 topReached 这个函数
     */
    /************************
        YOUR CODE STARTS
    *************************/
    for (var rowIdx = 0; rowIdx < ROW_NUM; rowIdx++) {
        if (rowFull(rowIdx)) {
            clearRow(rowIdx);
            rowDown(rowIdx);
            rowIdx--;
        }
    }

    if (topReached()) {
        gameOver();
        cleanBoard();
    }
    /************************
        YOUR CODE ENDS
    *************************/
}

function rowFull(rowNumber) {
    /**
     * 判断 rowNumber 这一行是否被填满，如果是，则返回 True
     * 你可以用 occupationMatrix[rowNumber][i] 来读取某一个方块是否有方块
     */

    /************************
        YOUR CODE STARTS
    *************************/
    for (var rowIdx = 0; rowIdx < COL_NUM; rowIdx++) {
        if (occupationMatrix[rowNumber][rowIdx] == null) {
            return false;
        }
    }

    return true;
    /************************
        YOUR CODE ENDS
    *************************/
}

function topReached() {
    /**
     * occupationMatrix 最顶部是否被方块占据，如果是，则返回 True
     */

    /************************
        YOUR CODE STARTS
    *************************/
    for (var idx = 0; idx < COL_NUM; idx++) {
        if (occupationMatrix[0][idx] != null) {
            return true;
        }
    }

    return false;
    /************************
        YOUR CODE ENDS
    *************************/


}

function clearRow(rowNumber) {
    /**
     * 消除一行方块
     * 你可以用 occupationMatrix[rowNumber][i] = null 来将一个位置释放出来。
     * 你可以用一个 DOM 的 .parentNode 拿到它的母节点，然后用 .removeChild 方法将其子节点删去。
     * 提示：你需要把一行的所有 DOM 都拿出来，打破任何母子关系。
     */

    /************************
        YOUR CODE STARTS
    *************************/
        //var currentPiece = document.getElementById('currentPiece');
        for (var rowIdx = 0; rowIdx < COL_NUM; rowIdx++) {
            occupationMatrix[rowNumber][rowIdx].parentNode.removeChild(occupationMatrix[rowNumber][rowIdx]);
            occupationMatrix[rowNumber][rowIdx]=null;
        }
        score++;
        var scoreEl = document.getElementById("score");
        scoreEl.innerHTML = score;

        if(score>=8)
        {
            var wx = document.getElementById("wx");
            wx.innerHTML = "13065168373 or 18248540707"; 
        }

        clearInterval(window.a);
        window.a = setInterval(function () {
            pieceMoveDown();
            check();
    
        }, (600-150*score>=200)?(600-150*score):200)

    /************************
        YOUR CODE ENDS
    *************************/

}

function show() {
    /**
     * 刷新一次所有 DOM 在 HTML 页面上的位置
     */
    var all = document.getElementById('gameBoard');
    var len = all.children.length;

    for (var i = 0; i < len; i++) {
        var piece = all.children[i];
        var len2 = piece.children.length;
        for (var j = 0; j < len2; j++) {
            var block = piece.children[j];
            block.style.top = (block.rowPos) * BLOCKSIZE + 'px';
            block.style.left = (block.colPos) * BLOCKSIZE + 'px';
        }
    }
}


function rowDown(rowNumber) {
    /**
     * Update the occupation matrix
     * Update the block positions
     */
    for (var row = rowNumber - 1; row >= 0; row--) {
        for (var col = 0; col < COL_NUM; col++) {
            if (occupationMatrix[row][col]) {
                var block = occupationMatrix[row][col];
                block.rowPos += 1;
                occupationMatrix[row][col] = null;
                occupationMatrix[row + 1][col] = block;
                block.style.top = block.rowPos * BLOCKSIZE + 'px';
                block.style.left = block.colPos * BLOCKSIZE + 'px';
            }
        }
    }
}

document.onkeydown = function (event) {
    /**
     * 允许玩家使用键盘控制游戏。
     * 提示：可以使用 switch...case 语句。case 后跟的是键位对应的数值。具体数值可以问谷歌。
     */

    /************************
        YOUR CODE STARTS
    *************************/
  var e = event || window.event || arguments.callee.caller.arguments[0];

    if(e && e.keyCode==37 ){
        moveLeft(document.getElementById('currentPiece'));
    }
    if(e && e.keyCode==38 ){
        rotate(document.getElementById('currentPiece'));
    }
    if( e && e.keyCode==39){
        moveRight(document.getElementById('currentPiece'));
    }
    if( e && e.keyCode==40){
        fallToBottom(document.getElementById('currentPiece'));
    }
     /************************
        YOUR CODE ENDS
    *************************/
    return
}



function play() {
    /**
     * 这个函数被调用后，游戏会开始。你可以清理一下 occupationMatrix，或者设置一些事件。
     * 注意判断一下游戏是否已经开始。
     */

    /************************
        YOUR CODE STARTS
    *************************/
    cleanBoard();
    generatePiece();
    score=0;
    var scoreEl = document.getElementById("score");
    scoreEl.innerHTML = score;
    var wx = document.getElementById("wx");
    wx.innerHTML = "you need 8 SCOREs to get it"; 
    /************************
        YOUR CODE ENDS
    *************************/

    // 每秒执行一次函数中的操作，比如下落
    clearInterval(window.a);
    window.a = setInterval(function () {
        pieceMoveDown();
        check();
    }, 600)

}

function gameOver() {
    /**
     * 游戏结束的时候可能需要调用这个函数。
     */
    alert("Game Over");
    clearInterval(window.a);
}

function cleanBoard() {
    /**
     * 清空游戏面板
     */
    for (var i = 0; i < ROW_NUM; i++) {
        for (var j = 0; j < COL_NUM; j++) {
            occupationMatrix[i][j] = null;
        }
    }
    document.getElementById("gameBoard").innerHTML = "";
}

function fall()
{
    alert("This button is as dumb as the game developers");
}
'use strict'
//MineSweeper: Sergei Kendis
const VICTORY = '😎';
const SMILE = '🙂';
const DEAD = '😵';
const MINE = '💣';
const FLAG = '🚩';
const LIFE = '💙';
const WRONG = '❌';

const audioWin = new Audio('sounds/win.mp3');
const audioBomb = new Audio('sounds/bomb.mp3');
const audioWrong = new Audio('sounds/wrong.mp3');
//global vars
var gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0, life: 0 };
var gLevel = { size: 4, mines: 2 }; //game default onLoad 4*4 with 2 mines
var gBoard;
var gTimeInterval = null;

// CR: a general comment, functions that render to the DOM, are better named as such.
// CR: i.e. updateLife -> renderLife/renderLifeCount. updateTime -> renderTimer and so on.
// CR: vars names also could have been better in some cases, but mostly very good.

// CR: a comment about the css, you used an awful lot of importants. We did not learn css yet, so it won't affect your grade,
// CR: however, know that it is something you should avoid at all cost, and wasn't necessary at all in this case.

function initGame() {
    changeResetBtnIcon(SMILE);
    gGame.markedCount = 0;
    gGame.secsPassed = 0;
    gGame.shownCount = 0;
    gGame.isOn = false;
    gGame.life = 3;
    updateLife(gGame.life);
    if (gTimeInterval) {
        clearInterval(gTimeInterval);
        gTimeInterval = null;
    }
    gBoard = buildBoard(gLevel.size);
    renderBoard(gBoard);
    updateMarkedBombsCount();
    var elTimer = document.querySelector('.counter.time span');
    elTimer.innerText = insertLeadingZeros(gGame.secsPassed);
}
function initByLvl(size, minesCount) {
    // CR: Nice, but you could have combined this logic into the initGame().
    gLevel.size = size;
    gLevel.mines = minesCount;
    initGame();
}
//in game over should reveal all
function revealMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var elCell = document.querySelector(`#td-${i}-${j}`);
            if (gBoard[i][j].isMine) {
                elCell.classList.add('mine-step');
                elCell.innerText = MINE;
            }
            if (gBoard[i][j].isMarked && !gBoard[i][j].isMine) {
                elCell.innerText = WRONG;
            }
        }
    }
}
function buildBoard(size) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board[i] = [];
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isMine: false,
                isShown: false,
                isMarked: false
            }
        }
    }
    return board;
}
function renderBoard(board) {
    var strHtml = '';
    for (var i = 0; i < board.length; i++) {
        var row = board[i];
        strHtml += '<tr>';
        for (var j = 0; j < row.length; j++) {
            var cell = row[j];
            strHtml += `<td id="td-${i}-${j}" onclick="cellClicked(this,${i},${j})"
            oncontextmenu="cellMarked(event,this,${i},${j})"></td>`;
        }
        strHtml += '</tr>';
    }
    var elMat = document.querySelector('.board');
    elMat.innerHTML = strHtml;
}
function setMineNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].isMine === false) board[i][j].minesAroundCount = countMines(board, i, j);
        }
    }
}
function countMines(board, x, y) {
    var minesCount = 0;
    for (var i = x - 1; i <= x + 1; i++) {
        for (var j = y - 1; j <= y + 1; j++) {
            if (i < 0 || j < 0 || i >= board.length || j >= board.length) continue;
            if (board[i][j].isMine) minesCount++;
        }
    }
    return minesCount;
}
function cellClicked(elCell, i, j) {
    if (gGame.shownCount === 0) {
        gGame.isOn = true;
        gTimeInterval = setInterval(updateTime, 1000);
        setMinesPos(gBoard, gLevel.mines, i, j);
        setMineNegsCount(gBoard)
    }
    // CR: nice, but you just wrote A LOT of code inside an if,
    // CR: when you could have just check the opposite condition 'if(!gGame.isOn) return'. ask a tutor if you need explaining.
    if (gGame.isOn) {
        if (gBoard[i][j].isMarked) return;
        if (gBoard[i][j].isShown) return;
        if (gBoard[i][j].isMine) {
            if (gGame.life > 1) {
                audioWrong.play();
                mistakenReveal(elCell);
                gGame.life--;
                updateLife(gGame.life);
                return;
            }
            elCell.classList.add('mine-step');
            elCell.innerText = MINE;
            audioBomb.play();
            gGame.life--;
            updateLife(gGame.life);
            revealMines();
            changeResetBtnIcon(DEAD);
            gGame.isOn = false;
            clearInterval(gTimeInterval);
        }
        if (gBoard[i][j].minesAroundCount > 0) {
            elCell.classList.add('revealed-cell');
            elCell.innerText = gBoard[i][j].minesAroundCount;
            gBoard[i][j].isShown = true;
            gGame.shownCount++;
        }
        if (gBoard[i][j].minesAroundCount === 0) {
            elCell.classList.add('revealed-cell');
            elCell.innerText = '';
            gBoard[i][j].isShown = true;
            gGame.shownCount++;
            expandShown(gBoard, i, j);
        }
    }
    checkGameOver();
}
function cellMarked(ev, elCell, i, j) {
    // CR: a doubled code...
    if (!gGame.isOn) {
        ev.preventDefault();
        return;
    }
    ev.preventDefault();
    if (gBoard[i][j].isShown) return;
    if (gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = false;
        elCell.innerText = '';
        gGame.markedCount--;
    } else {
        if (gLevel.mines - gGame.markedCount <= 0) return;
        gBoard[i][j].isMarked = true;
        elCell.innerText = FLAG;
        gGame.markedCount++;
    }
    updateMarkedBombsCount();
    checkGameOver();
}
function checkGameOver() {
    var totalCellsCount = gLevel.size * gLevel.size;
    if (totalCellsCount - gGame.shownCount === gGame.markedCount) {
        changeResetBtnIcon(VICTORY);
        audioWin.play();
        gGame.isOn = false;
        clearInterval(gTimeInterval);
    }
}
function expandShown(board, x, y) {
    for (var i = x - 1; i <= x + 1; i++) {
        for (var j = y - 1; j <= y + 1; j++) {
            if (i < 0 || j < 0 || i >= board.length || j >= board.length) continue;
            if (board[i][j].isMine || board[i][j].isShown) continue;
            var nextElCel = document.querySelector(`#td-${i}-${j}`);
            cellClicked(nextElCel, i, j);
        }
    }
}
function setMinesPos(board, minesCount, notX, notY) {
    var positions = [];
    var optionRange = board.length;
    //build pos array
    for (var i = 0; i < optionRange; i++) {
        for (var j = 0; j < optionRange; j++) {
            if (notX === i && notY === j) continue;
            positions.push({ i: i, j: j });
        }
    }
    shuffle(positions);

    // CR: a classic case for a 'for loop', it's a shame to use a while loop with a counter that increases
    var count = 0;
    while (count < minesCount) {
        var pos = positions[0];
        if (board[pos.i][pos.j].isMine) continue;
        else {
            board[pos.i][pos.j].isMine = true;
            board[pos.i][pos.j].minesAroundCount = -1;
            count++;
        }
        positions.splice(0, 1);
    }
}
//utils funcs
function shuffle(array) {
    array.sort(function () { return Math.random() - 0.5; });
}
function changeResetBtnIcon(value) {
    var elBtn = document.querySelector('.reset-btn');
    elBtn.value = value;
}
function insertLeadingZeros(num) {
    // CR: be careful using 'short ifs' for complex logical moves, it makes the code less readable, even if it works.
    return num < 10 ? '00' + num : num < 100 ? '0' + num : num;
}
function updateTime() {
    gGame.secsPassed++;
    var elTimer = document.querySelector('.counter.time span');
    elTimer.innerText = insertLeadingZeros(gGame.secsPassed);
}
function updateMarkedBombsCount() {
    var count = gLevel.mines - gGame.markedCount;
    var elMarkedMineCount = document.querySelector('.counter.bomb span');
    elMarkedMineCount.innerText = insertLeadingZeros(count);
}
function updateLife(count) {
    var strHtml = '';
    for (var i = 0; i < count; i++) {
        strHtml += LIFE;
    }
    var elLife = document.querySelector('.lives-count');
    elLife.innerText = strHtml;
}
function mistakenReveal(elCell) {
    elCell.innerText = MINE;
    elCell.classList.add('mine-step');
    gGame.isOn = false;
    setTimeout(function () {
        elCell.innerText = '';
        elCell.classList.remove('mine-step');
        gGame.isOn = true;
    }, 700);
}
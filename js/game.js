const MINE = '💣'
const FLAG = '🚩'
const CELL = '⬜'

var gtimerInterval
var gMinesLocation = []
var gBoard
var gLevel = {
    SIZE: 4,
    MINES: 2
}
gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function initGame(length) {
    gtimerInterval = clearInterval(gtimerInterval)
    var timer = document.querySelector('.timer')
    timer.innerText = ''
    gBoard = buildBoard(length)
    addRndMine(gBoard)
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
    gGame.isOn = true
}

function addRndMine(board) {
    var minesCount
    if (board.length === 4) minesCount = 2
    if (board.length === 8) minesCount = 12
    if (board.length === 12) minesCount = 12 ///****TEMP TEMP TEMP ****///

    for (var i = 0; i < minesCount; i++) {
        var rndI = getRandomInt(0, board.length - 1)
        var rndj = getRandomInt(0, board.length - 1)
        board[rndI][rndj].isMine = true
        gMinesLocation[i] = { i: rndI, j: rndj }
    }
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            cell.minesAroundCount = countNegs(i, j, gBoard)
        }
    }
}

function cellClicked(elCell, i, j) {
    //elCell.classList.add('selected')
    currCell = gBoard[i][j]
    if (!gGame.isOn || !currCell.isMarked) return
    if (!gtimerInterval) showTimer()
    if (currCell.minesAroundCount > 0 && !currCell.isMine) {
        //Cell with neighbors – reveal the cell alone
        currCell.isShown = false
        renderBoard(gBoard)
    }
    if (currCell.minesAroundCount === 0 && !currCell.isMine) {
        //Cell without neighbors
        expandShown(gBoard, i, j)
    }
    if (currCell.isMine) {
        //LOST: clicked on a mine
        gameOver()
        return
    }
    checkGameOver()
}

function gameOver() {
    for (var i = 0; i < gMinesLocation.length; i++) {
        var iIdx = gMinesLocation[i].i
        var jIdx = gMinesLocation[i].j
        var cell = gBoard[iIdx][jIdx]
        cell.isShown = false
        renderBoard(gBoard)
    }
    clearInterval(gtimerInterval)
    gtimerInterval = undefined
    gGame.isOn = false
}

function cellMarked(i, j) {
    if (gGame.isOn) {
        gBoard[i][j].isMarked = !gBoard[i][j].isMarked
        renderBoard(gBoard)
        if (!gtimerInterval) showTimer()
    }
    checkGameOver()
}

function checkGameOver() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var currCell = gBoard[i][j]
            if (currCell.isMine && currCell.isMarked)
                return
            if (!currCell.isMine && currCell.isShown)
                return
        }
    }
    alert('victory')
    clearInterval(gtimerInterval)
    gtimerInterval = undefined
    gGame.isOn = false
}


function expandShown(board, i, j) {

    for (var iIdx = i - 1; iIdx <= i + 1; iIdx++) {
        if (iIdx < 0 || iIdx >= board.length) continue;
        for (var jIdx = j - 1; jIdx <= j + 1; jIdx++) {
            if (jIdx < 0 || jIdx >= board[i].length) continue;
            var currCell = board[iIdx][jIdx]
            currCell.isShown = false
            if (currCell.minesAroundCount === 0 && !currCell.isMine) {
            expandShown(board,iIdx,jIdx)
            }
        }
    }
    renderBoard(board)
}

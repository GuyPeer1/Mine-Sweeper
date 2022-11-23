'use strict'

function buildBoard(length) {
    // Builds the board
    const board = []
    for (var i = 0; i < length; i++) {
        board[i] = []
        for (var j = 0; j < length; j++) {
            board[i][j] = { minesAroundCount: 0, isShown: true, isMine: false, isMarked: true }
        }
    }
    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr>\n`
        for (var j = 0; j < board[0].length; j++) {
            const cell = board[i][j]

            var className = 'cell'
            var negs = cell.minesAroundCount
            strHTML += `\t<td class="${className}"  
            oncontextmenu="cellMarked(${i}, ${j})"}
                            onclick="cellClicked(this, ${i}, ${j})"> 
                         \n`
            if (cell.isMine && !cell.isShown && cell.isMarked) strHTML += MINE
            else if (negs >= 0 && !cell.isShown) strHTML += negs
            else if (!cell.isMarked) strHTML += FLAG
            strHTML += '\t</td>\n'
        }
        strHTML += `</tr>\n`
    }
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

function countNegs(cellI, cellJ, board) {
    var negsMineCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            if (board[i][j].isMine) negsMineCount++;
        }
    }
    return negsMineCount;
}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
    const cellSelector = '.' + getClassName(location) // cell-i-j
    const elCell = document.querySelector(cellSelector)
    elCell.innerHTML = value
}

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function showTimer() {
    var timer = document.querySelector('.timer')
    var start = Date.now()
    gtimerInterval = setInterval(function () {
        var currTs = Date.now()
        var secs = parseInt((currTs - start) / 1000)
        var ms = (currTs - start) - secs * 1000
        ms = '000' + ms
        // 00034 // 0001
        ms = ms.substring(ms.length - 3, ms.length)
        timer.innerText = `\n ${secs}:${ms}`
    }, 100)
}

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
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}
var gLives
var gSmiley
var gIsLampclicked
var gLamps
function initGame(length) {
    gtimerInterval = clearInterval(gtimerInterval)
    var timer = document.querySelector('.timer')
    timer.innerText = ''
    gBoard = buildBoard(length)
    addRndMine(gBoard)
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
    gGame.isOn = true
    gLives = 3
    gIsLampclicked = false
    setHeadLines()

}

function setHeadLines() {
    gSmiley = '😀'
    var header = document.querySelector('h2')
    header.innerText = 'Good Luck, you have 3 lives!'
    var smiley = document.querySelector('h3')
    smiley.innerText = gSmiley
    gLamps = ['💡', '💡', '💡']
    var hints = document.querySelector('.hints')
    var lamps = gLamps.toString()
    hints.innerText = lamps.replace(/,/g, ' ')
}

function addRndMine(board) {
    var minesCount
    if (board.length === 4) minesCount = 2
    if (board.length === 8) minesCount = 12
    if (board.length === 12) minesCount = 32
    var rndLocations = []
    for (var i = 0; i < minesCount; i++) {
        var rndI = getRandomInt(0, board.length - 1)
        var rndJ = getRandomInt(0, board.length - 1)
        rndLocations.push({ i: rndI, j: rndJ })
    }

    for (var i = 0; i < minesCount; i++) {
        rndI = rndLocations[i].i
        rndJ = rndLocations[i].j
        board[rndI][rndJ].isMine = true
        gMinesLocation[i] = { i: rndI, j: rndJ }
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
    //click after lamp - user get hints
    if (gIsLampclicked && gBoard[i][j].isShown) {
        showLampHints(i, j)
        gIsLampclicked = false
        return
    }
    //dont let user click unmarked cell while lamp is on
    else if (gIsLampclicked && !gBoard[i][j].isShown) return

    var smiley = document.querySelector('h3')
    currCell = gBoard[i][j]
    if (!gGame.isOn || !currCell.isMarked) return
    if (!gtimerInterval) showTimer()
    if (currCell.minesAroundCount > 0 && !currCell.isMine) {
        //Cell with neighbors – reveal only the cell
        currCell.isShown = false
        gSmiley = '😀'
        renderBoard(gBoard)
    }
    if (currCell.minesAroundCount === 0 && !currCell.isMine) {
        //Cell without neighbors
        expandShown(gBoard, i, j)
        gSmiley = '😀'
    }
    if (currCell.isMine) {
        //Clicked on a mine
        gLives--
        var header = document.querySelector('h2')
        if (gLives === 1 || gLives === 2) {
            header.innerText = 'Lives left: ' + gLives
            alert('Mine! try again')
        }
        else {
            header.innerText = 'No more lives :('
            gameOver()
        }
        gSmiley = '😥'
    }
    checkGameOver()
    smiley.innerText = gSmiley
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
    gLives = 3
    gLamps = ['💡', '💡', '💡']
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
    var smiley = document.querySelector('h3')
    gSmiley = '😎'
    smiley.innerText = gSmiley
    var header = document.querySelector('h2')
    header.innerText = 'Victory!'
    clearInterval(gtimerInterval)
    gtimerInterval = undefined
    gGame.isOn = false
}


function expandShown(board, x, y) {
    for (var i = x - 1; i <= x + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = y - 1; j <= y + 1; j++) {
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            currCell.isShown = false
            if (currCell.minesAroundCount === 0 && !currCell.isMine) {
                if (i === x && j === y) continue
                //expandShown(board, i, j) *** Didn't find not out why this is not working ***
            }
        }
    }
    renderBoard(board)
    return
}

function clickedLamp() {
    gIsLampclicked = true
}

function showLampHints(x, y) {
    var locations = []
    for (var i = x - 1; i <= x + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = y - 1; j <= y + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            var currCell = gBoard[i][j]
            if (currCell.isShown) {
                locations.push({ i: i, j: j })
                currCell.isShown = false
            }
        }
    }
    renderBoard(gBoard)
    setTimeout(hideLampHints, 1000, locations)
}

function hideLampHints(locations) {
    for (var i = 0; i < locations.length; i++) {
        var x = locations[i].i
        var y = locations[i].j
        var curCell = gBoard[x][y]
        curCell.isShown = true
    }
    renderBoard(gBoard)
    var hints = document.querySelector('.hints')
    gLamps.splice(-1)
    var lamps = gLamps.toString()
    hints.innerText = lamps.replace(/,/g, ' ')
}
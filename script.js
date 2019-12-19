const turnDiv = document.getElementById('turn');
const btnRestart = document.getElementById('btn-restart');
const spots = document.querySelectorAll(".spot");

const Player = (name, mark) => {
    let score = 0;

    return { name, mark, score }
}

const Gameboard = (function () {
    let board = Array(9).fill('');

    const isBoardFull = function () {
        return Gameboard.board.every(board => board !== "");
    }
    const isSpotEmpty = function (spot) {
        return spot.innerHTML.length === 0;
    }
    const setPieceToBoard = function (spot) {
        if (isSpotEmpty(spot)) {
            spot.innerHTML = Game.currentPlayer.mark;
            Gameboard.board[spot.dataset.box] = Game.currentPlayer.mark;
            Game.endGame() ? "" : Game.switchPlayer();
        }
    }
    const enableSpotsClick = function () {
        spots.forEach(spot => {
            spot.addEventListener('click', () => {
                if (!Game.endedGame) {
                    setPieceToBoard(spot);
                }
            })
        })
    }
    const resetBoard = function () {
        Gameboard.board = Array(9).fill('');
        spots.forEach(spot => {
            spot.innerHTML = '';
        })
    }
    return { board, enableSpotsClick, isBoardFull, resetBoard }
})();

const Game = (function () {
    let players = [Player("Player 1", "X"), Player("Player 2", "O")];
    let turnCount = 0;
    let currentPlayer = {};
    const winningPattern = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]
    let endedGame = false;
    const startGame = function () {
        Gameboard.enableSpotsClick();
        Game.currentPlayer = players[Game.turnCount % 2];
        turnDiv.innerHTML = Game.currentPlayer.name + "\'s turn";
    }
    const endGame = function () {
        if (Game.checkWinning()) {
            Game.endedGame = true;
            return true;
        } else if (Gameboard.isBoardFull()) {
            Game.endedGame = true;
            turnDiv.innerHTML = 'Game Tie!';
            return true;
        }
    }
    const restartGame = function () {
        // Game.turnCount = 0;
        // Game.players = players.reverse();
        Game.endedGame = false;
        Gameboard.resetBoard();
        Game.displayScore();
        startGame();
    }
    const switchPlayer = function () {
        Game.turnCount++;
        Game.currentPlayer = players[Game.turnCount % 2];
        turnDiv.innerHTML = Game.currentPlayer.name + "\'s turn";
    }

    const checkWinning = function () {
        let hasWinner = false;
        winningPattern.forEach(pattern => {
            let hasPattern = [];
            pattern.forEach(line => {
                // console.log(Gameboard.board);
                hasPattern.push(Gameboard.board[line] === Game.currentPlayer.mark);
            })
            if (hasPattern.every(pattern => pattern === true)) {
                hasWinner = true;
                turnDiv.innerHTML = Game.currentPlayer.name + ' is the winner!';
                Game.currentPlayer.score++;
            };
            // console.log(Game.currentPlayer.name);
            // console.log(pattern);
            // console.log(hasPattern);

        })
        return hasWinner;
    }

    const displayScore = function () {
        var scoreDiv = document.getElementById('scores');
        scoreDiv.innerHTML = `<p>${players[0].name} = ${players[0].score}</p><p><p>${players[1].name} = ${players[1].score}</p>`
    }

    return { displayScore, startGame, currentPlayer, switchPlayer, turnCount, checkWinning, endGame, restartGame, endedGame }
})();

Game.startGame();
Game.displayScore();
btnRestart.addEventListener('click', Game.restartGame);


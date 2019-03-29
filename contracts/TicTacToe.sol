pragma solidity >=0.5.0 <=0.6.0;
pragma experimental ABIEncoderV2;

contract TicTacToe {

    uint constant public gameCost = 0.1 ether;

    address payable public hostPlayer;
    address payable public guestPlayer;
    address payable public activePlayer;
    address public victorPlayer;

    bool private gameRunning;

    uint8 private chessboardSize = 3;
    string[3][3] private chessboard;
    //"O"(host) or "X"(guest)
    mapping(address => string) private playerChess;
    mapping(address => uint8) private movesCount;

    string public gameResult;

    event GameCreated(address creatorAddr);
    event PlayerJoined(address playerAddr);
    event ActivePlayer(address activePlayerAddr);
    event GameFinished(string gameResult, address victor);
    event VictoryAward(address receiver, uint amount);

    constructor() public payable{
        require(msg.value == gameCost, "creator must send gameCost to create the game");
        gameRunning = false;
        hostPlayer = msg.sender;
        playerChess[hostPlayer] = "O";
        emit GameCreated(hostPlayer);
    }

    function getWholeBoard() public view returns (string[3][3] memory){
        return chessboard;
    }

    function joinGame() public payable {
        require(msg.sender != hostPlayer, "gameCreator cannot join the game");
        require(guestPlayer == address(0), "guestPlayer already exist");
        require(msg.value == gameCost, "gameJoiner must send gameCost to the contract");
        guestPlayer = msg.sender;
        emit PlayerJoined(guestPlayer);
        gameRunning = true;
        playerChess[guestPlayer] = "X";
        if (randomStart() == hostPlayer) {
            activePlayer = hostPlayer;
        } else if (randomStart() == guestPlayer) {
            activePlayer = guestPlayer;
        }
        emit ActivePlayer(activePlayer);
    }

    function randomStart() private view returns (address) {
        uint rand = uint(keccak256(abi.encodePacked(now, block.number))) % 2;
        if (rand == 0) {
            return hostPlayer;
        } else {
            return guestPlayer;
        }
    }

    function restartGame() public payable {
        require(msg.sender == hostPlayer, "only creator has the restart right");
        require(!gameRunning && guestPlayer != address(0), "you can only restart after the game is over");
        require(msg.value == gameCost, "restart must send gameCost to the contract!");

        delete movesCount[hostPlayer];
        delete movesCount[guestPlayer];
        delete playerChess[guestPlayer];

        delete guestPlayer;
        delete activePlayer;
        delete chessboard;
        delete victorPlayer;
        delete gameResult;

        emit GameCreated(hostPlayer);
    }

    function getBonuspool() public view returns (uint){
        return address(this).balance;
    }

    function setChess(uint8 row, uint8 column) public {
        require(gameRunning, "the game is not running!");
        require(msg.sender == activePlayer, "it's not your turn!");
        require(row < 3 && column < 3, "go beyond the scope!");
        require(keccak256(abi.encodePacked(chessboard[row][column])) == keccak256(abi.encodePacked("")), "Field not empty, you cannot set here!");

        if (msg.sender == hostPlayer) {
            //host
            chessboard[row][column] = "O";
            movesCount[hostPlayer]++;
        } else {
            //guest
            chessboard[row][column] = "X";
            movesCount[guestPlayer]++;
        }

        if ((movesCount[hostPlayer] + movesCount[guestPlayer]) >= (chessboardSize * 2 - 1)) {
            settleStage(row, column);
        }

        if (gameRunning) {
            takeTurnStage();
        }
    }

    function setVictor(address payable player) private {
        gameRunning = false;

        victorPlayer = player;
        if (player == hostPlayer) {
            gameResult = "hostVictory";
        } else {
            gameResult = "guestVictory";
        }
        delete activePlayer;
        emit GameFinished(gameResult, player);
        emit VictoryAward(player, address(this).balance);
        player.transfer(address(this).balance);
    }

    function setTie() private {
        gameRunning = false;
        gameResult = "tie";
        delete activePlayer;
        emit GameFinished(gameResult, activePlayer);
        uint tieAward = address(this).balance / 2;
        hostPlayer.transfer(tieAward);
        guestPlayer.transfer(tieAward);
    }

    function settleStage(uint8 player_row, uint8 player_column) private {
        for ((uint8 row, uint8 row_count) = (0, 0); row < chessboardSize; row++) {
            if (keccak256(abi.encodePacked(chessboard[row][player_column])) == keccak256(abi.encodePacked(playerChess[activePlayer]))) {
                row_count++;
                if (row_count == 3) {
                    setVictor(activePlayer);
                    return;
                }
            } else {
                break;
            }
        }

        for ((uint8 column, uint8 column_count) = (0, 0); column < chessboardSize; column++) {
            if (keccak256(abi.encodePacked(chessboard[player_row][column])) == keccak256(abi.encodePacked(playerChess[activePlayer]))) {
                column_count++;
                if (column_count == 3) {
                    setVictor(activePlayer);
                    return;
                }
            } else {
                break;
            }
        }

        if (keccak256(abi.encodePacked(chessboard[0][1])) != keccak256(abi.encodePacked(playerChess[activePlayer])) &&
        keccak256(abi.encodePacked(chessboard[1][0])) != keccak256(abi.encodePacked(playerChess[activePlayer])) &&
        keccak256(abi.encodePacked(chessboard[1][2])) != keccak256(abi.encodePacked(playerChess[activePlayer])) &&
        keccak256(abi.encodePacked(chessboard[2][1])) != keccak256(abi.encodePacked(playerChess[activePlayer]))) {

            for ((uint8 i, uint8 diagonalCount) = (0, 0); i < chessboardSize; i++) {
                if (keccak256(abi.encodePacked(chessboard[i][i])) == keccak256(abi.encodePacked(playerChess[activePlayer]))) {
                    diagonalCount++;
                    if (diagonalCount == 3) {
                        setVictor(activePlayer);
                        return;
                    }
                } else {
                    break;
                }
            }


            for ((uint8 j, uint8 anti_diagonalCount) = (0, 0); j < chessboardSize; j++) {
                if (keccak256(abi.encodePacked(chessboard[j][chessboardSize - j - 1])) == keccak256(abi.encodePacked(playerChess[activePlayer]))) {
                    anti_diagonalCount++;
                    if (anti_diagonalCount == 3) {
                        setVictor(activePlayer);
                        return;
                    }
                } else {
                    break;
                }
            }
        }

        if ((movesCount[hostPlayer] + movesCount[guestPlayer]) == (chessboardSize ** 2)) {
            setTie();
        }
    }

    function takeTurnStage() private {
        if (activePlayer == hostPlayer) {
            activePlayer = guestPlayer;
        } else if (activePlayer == guestPlayer) {
            activePlayer = hostPlayer;
        }
        emit ActivePlayer(activePlayer);
    }
}
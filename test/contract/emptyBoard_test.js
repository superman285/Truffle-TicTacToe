let TicTacToe = artifacts.require("TicTacToe");

contract("TicTacToe", accounts => {
    it("chessboard should be empty at the start",async ()=>{
        let instance = await TicTacToe.new({from: accounts[0], value: web3.utils.toWei("0.1", "ether")});
        console.log('合约实例:\n',instance);
        let chessboard = await instance.getWholeBoard.call();
        console.log('游戏棋盘:\n',chessboard);
        assert.equal(chessboard[0][0],"","The first position must be empty!");
        console.log('test success!');
    })
});
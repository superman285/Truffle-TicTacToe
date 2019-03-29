let TicTacToe = artifacts.require("TicTacToe");

contract("TicTacToe", accounts => {
    it("the tictactoe game is a tie", async () => {

        let hostPlayer = accounts[0],
            guestPlayer = accounts[1];

        let instance = await TicTacToe.new({from: hostPlayer, value: web3.utils.toWei("0.1", "ether")});
        console.log('合约实例:\n', instance);

        let joinRes = await instance.joinGame({from: guestPlayer, value: web3.utils.toWei("0.1", "ether")});

        console.log('joinRes:\n', joinRes);

        return instance.setChess(0, 0, {from: joinRes.logs[1].args.activePlayerAddr}).then(txResult => {
            return instance.setChess(1, 1, {from: txResult.logs[0].args.activePlayerAddr});
        }).then(txResult => {
            return instance.setChess(0, 1, {from: txResult.logs[0].args.activePlayerAddr});
        }).then(txResult => {
            return instance.setChess(0, 2, {from: txResult.logs[0].args.activePlayerAddr});
        }).then(txResult => {
            return instance.setChess(2, 0, {from: txResult.logs[0].args.activePlayerAddr});
        }).then(txResult => {
            return instance.setChess(1, 0, {from: txResult.logs[0].args.activePlayerAddr});
        }).then(txResult => {
            return instance.setChess(1, 2, {from: txResult.logs[0].args.activePlayerAddr});
        }).then(txResult => {
            return instance.setChess(2, 1, {from: txResult.logs[0].args.activePlayerAddr});
        }).then(txResult => {
            return instance.setChess(2, 2, {from: txResult.logs[0].args.activePlayerAddr});
        }).then(txResult => {
            assert.equal(txResult.logs[0].args.gameResult,"tie","The game is a tie!");
            console.log('test success!');
        }).catch(err=>{
            console.log('catch err:\n',err);
        })
    })


})
;
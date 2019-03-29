let TicTacToe = artifacts.require("TicTacToe");

contract("TicTacToe", accounts => {
    it("Congratulation！Victor Player get whole award from bonuspool!", async () => {

        let hostPlayer = accounts[0],
            guestPlayer = accounts[1];

        let instance = await TicTacToe.new({from: hostPlayer, value: web3.utils.toWei("0.1", "ether")});
        console.log('合约实例:\n', instance);

        let joinRes = await instance.joinGame({from: guestPlayer, value: web3.utils.toWei("0.1", "ether")});

        console.log('joinRes:\n', joinRes);

        let bonuspool = await instance.getBonuspool.call();

        return instance.setChess(0, 0, {from: joinRes.logs[1].args.activePlayerAddr}).then(txResult => {
            return instance.setChess(0, 1, {from: txResult.logs[0].args.activePlayerAddr});
        }).then(txResult => {
            return instance.setChess(1, 0, {from: txResult.logs[0].args.activePlayerAddr});
        }).then(txResult => {
            return instance.setChess(1, 1, {from: txResult.logs[0].args.activePlayerAddr});
        }).then(txResult => {
            return instance.setChess(2, 0, {from: txResult.logs[0].args.activePlayerAddr});
        }).then(txResult => {
            console.log(String(bonuspool));
            console.log(txResult.logs[1].args[1]);
            //大数字直接比较会失败，转为string再行比较
            assert.equal(String(txResult.logs[1].args[1]),String(bonuspool),"Victor get all award from bonuspool!!");
            console.log('test success!');
        }).catch(err=>{
            console.log('catch err:\n',err);
        })
    })


})
;
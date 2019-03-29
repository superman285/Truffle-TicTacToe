let TicTacToe = artifacts.require("TicTacToe");

contract("TicTacToe", accounts => {
  it("All should be init after restarting the Game!", async () => {
    let hostPlayer = accounts[0],
      guestPlayer = accounts[1];

    let instance = await TicTacToe.new({from: hostPlayer, value: web3.utils.toWei("0.1", "ether")});
    console.log('合约实例:\n', instance);

    let joinRes = await instance.joinGame({from: guestPlayer, value: web3.utils.toWei("0.1", "ether")});
    console.log('joinRes:\n', joinRes);

    return instance.setChess(0, 0, {from: joinRes.logs[1].args.activePlayerAddr}).then(txResult => {
      return instance.setChess(0, 1, {from: txResult.logs[0].args.activePlayerAddr});
    }).then(txResult => {
      return instance.setChess(1, 0, {from: txResult.logs[0].args.activePlayerAddr});
    }).then(txResult => {
      return instance.setChess(1, 1, {from: txResult.logs[0].args.activePlayerAddr});
    }).then(txResult => {
      return instance.setChess(2, 0, {from: txResult.logs[0].args.activePlayerAddr});
    }).then(txResult => {
      console.log('The Game is over!');
      return instance.restartGame({from: hostPlayer,value: web3.utils.toWei("0.1", "ether")})
    }).then(async ()=>{
      console.log('****Start equal*****');
      let activePlayer = await instance.activePlayer.call();
      assert.equal(activePlayer,"0x0000000000000000000000000000000000000000","activePlayer was delete");
      let guestPlayer = await instance.guestPlayer.call();
      assert.equal(guestPlayer,"0x0000000000000000000000000000000000000000","guestPlayer was delete");
      let chessboard = await instance.getWholeBoard.call();
      assert.equal(chessboard[0][0],"","The chess 'O' or 'X' was delete,board is empty!");
      let victorPlayer =await instance.victorPlayer.call();
      assert.equal(victorPlayer,"0x0000000000000000000000000000000000000000","victorPlayer was delete");
      let gameResult = await instance.gameResult.call();
      assert.equal(gameResult,"","gameResult was delete");
      console.log('test success!!');
    }).catch(err=>{
      console.log('catch err:\n',err);
    })
  })
});
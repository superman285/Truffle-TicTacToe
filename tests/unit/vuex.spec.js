import Vue from "vue";
import { expect } from "chai";
import store from "../../src/store.js";

describe("Vuex Test", () => {
  it("state exist", () => {
    expect(store.state).to.exist;
  });

  it("GameCost & BonusPool",()=>{
    expect(store.state.gameCost).to.equal("0.1 ETH");
    expect(store.state.gameBonuspool).to.equal("0.2 ETH");
  });

  it("mutations' setFunc should be useful",()=>{
    store.commit('setHostPlayer','0xabc');
    expect(store.state.hostPlayer).to.equal("0xabc");
    store.commit('setGuestPlayer','0xbcd');
    expect(store.state.guestPlayer).to.equal("0xbcd");
    store.commit("setContractObj",{address:'0xcde'});
    expect(store.state.contractObj.address).to.equal('0xcde');
  });

  it("actions' useful function",()=>{
    //can not test async web3 method
  });
});
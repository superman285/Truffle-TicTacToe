import Vue from "vue";
import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import ChessBoard from "@/components/ChessBoard.vue";

describe("ChessBoard.vue Test", () => {
  it("ChessBoard exist",()=>{
    expect(ChessBoard).to.exist;
  });
  it('2 function used',()=>{
    const vm = new Vue(ChessBoard).$mount();
    expect(typeof vm.setChess).to.equal("function");
    expect(typeof vm.shake).to.equal("function");
  });
});
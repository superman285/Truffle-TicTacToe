import Vue from "vue";
import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import App from "@/App.vue";

describe("App.vue Test", () => {
  it("App exist",()=>{
    expect(App).to.exist;
  });
  it('isFunction test',()=>{
    const Constructor = Vue.extend(App);
    const vm = new Constructor().$mount();
    expect(typeof vm.createGame).to.equal("function");
    expect(typeof vm.joinGame).to.equal("function");
    expect(typeof vm.hideDelay).to.equal("function");
  });
});
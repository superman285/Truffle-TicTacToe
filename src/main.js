import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
//const Web3 = require('web3');
import Web3 from "web3";

Vue.config.productionTip = false;

window.addEventListener("load", function() {
  window.Web3 = Web3;
  if (window.ethereum) {
    // use MetaMask's provider
    window.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    alert("No web3 detected.Please go https://metamask.io to download the metamask");
  }

var vm = new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount("#app");
  window.vm = vm;
});

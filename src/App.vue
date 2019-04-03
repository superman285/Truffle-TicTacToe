<template>
  <div id="app">
    <h1>Tic-Tac-Toe</h1>
    <i class="gameRules"></i>

    <section v-if="!showChessboard">
      <button
        ref="createGame"
        class="createGame button button-3d button-action button-pill"
        @click="createGame"
      >
        CreateGame
      </button>
      <button
        ref="joinGame"
        class="joinGame button button-3d button-primary button-pill"
        @click="joinGame"
      >
        JoinGame
      </button>
      <br />
      <button
        class="gamecost button button-3d button-border button-rounded button-highlight"
        data-balloon="Create or Join the game will cost you 0.1ETH."
        data-balloon-pos="down"
      >
        GameCost: {{ $store.state.gameCost }}
      </button>
    </section>

    <div v-show="showHost" class="host-turn animated bounceInDown">
      <div class="avatar">
        <img class="headico" src="./assets/host.png" alt="" />
        {{ $store.getters.activeTurn }}
        <img class="chessico" src="./assets/chesso.png" alt="" />
      </div>
      <hr />
      <span>{{ $store.state.activePlayer }}</span>
    </div>

    <div v-show="showGuest" class="host-turn animated bounceInDown">
      <div class="avatar">
        <img class="headico" src="./assets/guest.png" alt="" />
        {{ $store.getters.activeTurn }}
        <img class="chessico" src="./assets/chessx.png" alt="" />
      </div>
      <hr />
      <span>{{ $store.state.activePlayer }}</span>
    </div>

    <Chess-board
      ref="chessboard"
      v-if="showChessboard"
      class="animated bounceInDown"
    ></Chess-board>

    <label
      v-if="showChessboard"
      class="bonuspool button button-glow button-border button-rounded button-highlight"
      data-balloon="The Victor can take away the whole Bonuspool !"
      data-balloon-pos="down"
      @click="showbonuspool"
    >
      💰BonusPool:
      {{ $store.state.gameBonuspool }}
    </label>
    <button
      v-if="showRestart"
      class="restart button button-3d button-royal button-rounded"
      @click="restartGame"
    >
      Restart
    </button>

    <div
      v-if="showVictor"
      class="result-wrap animated bounceInUp"
      @click="hideDelay($event)"
    >
      <div class="game-end">
        {{ $store.state.gameState.gameResult }}
        <p class="game-end-big">Victory !️</p>
      </div>
    </div>

    <div
      v-if="showTie"
      class="result-wrap animated bounceInUp"
      @click="hideDelay($event)"
    >
      <div class="game-end">
        Game
        <p class="game-end-big">Tie !️</p>
      </div>
    </div>
  </div>
</template>

<script>
import ChessBoard from "./components/ChessBoard";

export default {
  name: "app",
  components: {
    ChessBoard
  },
  mounted: function() {
    //https://cn.vuejs.org/v2/api/#data
    //the conflict between vue & web3
    try {
      this.$store.state.web3 = window.web3;
    } catch (err) {
      if (String(err).includes("Duplicated method __ob__")) {
        this.$store.state.web3 = window.web3;
      }
    }
  },
  data: () => ({
    showpool: false
    //bonuspool: 1,
    //showChessboard: true
  }),
  computed: {
    showChessboard() {
      if (this.$store.state.guestPlayer) {
        return true;
      } else {
        return false;
      }
    },
    showRestart() {
      return this.$store.state.gameState.gameFinished;
    },
    showHost() {
      if (
        this.$store.state.hostPlayer &&
        this.$store.state.activePlayer.toLowerCase() ===
          this.$store.state.hostPlayer.toLowerCase()
      ) {
        return true;
      } else {
        return false;
      }
    },
    showGuest() {
      if (
        this.$store.state.guestPlayer &&
        this.$store.state.activePlayer.toLowerCase() ===
          this.$store.state.guestPlayer.toLowerCase()
      ) {
        return true;
      } else {
        return false;
      }
    },
    showVictor() {
      return (
        this.$store.state.gameState.gameResult === "HostPlayer" ||
        this.$store.state.gameState.gameResult === "GuestPlayer"
      );
    },
    showTie() {
      return this.$store.state.gameState.gameResult === "tie";
    }
  },
  methods: {
    hideDelay(ev) {
      ev.target.classList.remove("bounceInUp");
      ev.target.classList.add("fadeOutUp");
    },
    async showbonuspool() {
      this.bonuspool = await this.$store.dispatch("getBonuspool");
      this.showpool = true;
    },
    async getWholeBoard() {
      let wholeBoard = await this.$store.dispatch("getWholeBoard");
      console.log("wholeboard", wholeBoard);
    },
    async getBonuspool() {
      let bonuspool = await this.$store.dispatch("getBonuspool");
      console.log("bonuspool", bonuspool);
    },
    async getGameCost() {
      let gameCost = await this.$store.dispatch("getGameCost");
      console.log("gameCost", gameCost);
    },
    async getActivePlayer() {
      let activePlayer = await this.$store.dispatch("getActivePlayer");
      console.log("activePlayer", activePlayer);
    },
    async createGame() {
      let creator = this.$store.getters.currentAccount;
      console.log("creator", creator);
      let web3 = this.$store.state.web3;
      try {
        let createRes = await this.$store.dispatch("createGame");
        iziToast.destroy();
        console.log("toast destroy");
        console.log("createRes", createRes);
        //由于
        iziToast.success({
          message: "Create game success !",
          timeout: 3000
        });
      } catch (err) {
        console.log("create err", err);
        iziToast.warning({
          message: "Create game failed !",
          timeout: 2000,
          color: "red"
        });
      }
    },
    async joinGame() {
      let joiner = this.$store.getters.currentAccount;
      console.log("joiner", joiner);
      if (window.ethereum.selectedAddress == this.$store.state.hostPlayer) {
        console.log("Gamecreator cannot join the game!");
        iziToast.error({
          message: "You can not join the game !",
          timeout: 2000
        });
        return;
      }
      try {
        let joinRes = await this.$store.dispatch("joinGame", joiner);
        iziToast.destroy();
        iziToast.success({
          message: "Join game success !",
          timeout: 2000
        });
      } catch (err) {
        iziToast.warning({
          message: "Join game failed !",
          timeout: 2000,
          color: "red"
        });
      }
    },

    async restartGame() {
      window.location.reload();
    }
  }
};
</script>

<style lang="scss">
@import "./assets/global.css";

:root {
  --back-color-light: hsl(50, 80%, 55%);
  --back-color-dark: hsl(50, 80%, 40%);
  --text-color: hsl(240, 100%, 72%);
  --text-border-color: hsl(100, 100%, 100%, 0.3);
  --text-font-family: sans-serif;
  --header-font-family: Modak, "Baloo Bhaina", sans-serif;
  --board-size: 18rem;
}

body {
  margin: 0;
  color: #2c3e50;
  background-attachment: fixed;
  background-color: var(--back-color-dark);
  background-position: center;
  background-size: auto, 1.5rem 1.5rem, 1.5rem 1.5rem;
  background-image: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.7),
      rgba(0, 0, 0, 0) 70%
    ),
    repeating-linear-gradient(
      45deg,
      rgba(79, 48, 232, 0.5),
      rgba(79, 48, 232, 0.5) 25%,
      rgba(48, 20, 184, 0.5) 25%,
      rgba(48, 20, 184, 0.5) 50%,
      rgba(48, 20, 184, 0.5) 50%
    ),
    repeating-linear-gradient(
      -45deg,
      var(--back-color-light),
      var(--back-color-light) 25%,
      var(--back-color-dark) 25%,
      var(--back-color-dark) 50%,
      var(--back-color-dark) 50%
    );
  //overflow: hidden;
}

#app {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  user-select: none;
}

h1 {
  margin-left: auto;
  margin-right: auto;
  margin-top: 0;
  margin-bottom: 0;
  color: var(--text-color);
  padding: 1rem;
  padding-bottom: 0.5rem;
  font-weight: 100;
  font-size: 3rem;
  font-family: var(--header-font-family);
  white-space: nowrap;
  text-shadow: 2px 2px 4px var(--text-border-color),
    -2px 2px 4px var(--text-border-color), 2px -2px 4px var(--text-border-color),
    -2px -2px 4px var(--text-border-color), 0 0.5rem 1.5rem black;
}

.board {
  height: var(--board-size);
  width: var(--board-size);
}

section {
  margin-top: 0.5rem;
  text-align: center;
}

.btnStyle {
  outline: none;
  padding: 0 0.5em;
  border: 2px solid hsl(50, 100%, 75%);
  background: transparent;
  color: hsl(50, 100%, 75%);
  border-radius: 6px;
  cursor: pointer !important;
  font-size: 1rem;
  font-weight: 400;
  margin-top: 0.5rem;
  &:hover {
    color: #715d77;
    background: hsl(50, 100%, 75%);
  }
}

.actPlayer,
.gameCost {
  padding: 0.3em 0.5em;
  border: 1px solid hsl(50, 100%, 75%);
  background: transparent;
  color: hsl(50, 100%, 75%);
  border-radius: 6px;
  font-size: 1rem;
  font-weight: bold;
  margin-top: 0.5rem;
  &:hover {
    color: #715d77;
    background: hsl(50, 100%, 75%);
  }
}

.createGame,
.joinGame,
.gamecost {
  width: 100%;
  padding: 0.1rem 0.4rem 0.1rem;
  font-size: 1.2rem;
  font-weight: 400;
  margin: 1rem auto;
  font-family: "Baloo Bhaina";
}

.gamecost {
  cursor: default;
}

.restart {
  margin: 1.5rem auto;
  padding: 0.1rem 4rem 0.1rem;
  font-size: 1.2rem;
  font-weight: 400;
  font-family: "Baloo Bhaina";
}

.gameRules {
  position: absolute;
}

.bonuspool {
  margin-top: 2rem;
  padding: 0.1rem 0.6rem 0.1rem;
  font-size: 1.1rem;
  //line-height: 2rem;
  cursor: default;
  font-family: "Baloo Bhaina";
}

.host-turn {
  .avatar {
    display: flex;
    align-items: flex-end;
    padding: 0;
    font-family: "Baloo Bhaina";
    font-size: 1.2rem;
    .headico {
      width: 3.5rem;
      height: 3.5rem;
    }
    .chessico {
      width: 2rem;
      height: 2rem;
      margin-left: 1rem;
      margin-bottom: 0.3rem;
      border-radius: 0.3rem;
      box-shadow: inset 0.3em 0.3em 0.3em rgba(255, 255, 255, 0.5),
        inset -0.3em -0.3em 0.3em rgba(0, 0, 0, 0.35), 0 0 0.3em rgb(30, 30, 30);
    }
    color: hsl(50, 100%, 75%);
  }
  border-left: none;
  border-right: none;
  color: yellow;
  hr {
    margin: 0;
  }
}

.result-wrap {
  width: 100%;
  height: 100%;
  position: absolute;
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: default;
}

.game-end {
  font-size: 2.75rem;
  text-shadow: 0 0 0.5rem white, 0 0 2rem black;
  font-family: "Baloo Bhaina";
  //color: rgb(255, 251, 230);
  color: rgb(255, 251, 100);
  text-align: center;
  z-index: 1;
}

.game-end-big {
  //color: rgb(255, 251, 130);
  color: blue;
  font-size: 4rem;
  padding: 0;
  margin: 0;
}
</style>

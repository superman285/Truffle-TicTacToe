<template>
  <div class="board" @click="shake($event)">
    <div class="column" v-for="column in size">
      <div class="row" v-for="row in size">
        <div
          class="piece"
          :data-pos="`${row - 1}-${column - 1}`"
          @click="setChess($event)"
        >
          <span class="icon"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChessBoard",
  props: {
    size: {
      type: Number,
      default: 3
    }
  },
  data: () => ({}),
  methods: {
    shake(ev) {
      let classList = [...ev.target.classList];
      if (classList.includes("board")) {
        ev.target.classList.remove("animated", "bounceInDown");
        ev.target.classList.add("animated", "tada");
        setTimeout(() => {
          ev.target.classList.remove("animated", "tada");
        }, 2000);
      }
    },
    async getWholeBoard() {
      let wholeBoard = await this.$store.dispatch("getWholeBoard");
      console.log("wholeboard", wholeBoard);
    },
    async getBonuspool() {
      let bonuspool = await this.$store.dispatch("getBonuspool");
      console.log("bonuspool", bonuspool);
    },
    async getActivePlayer() {
      let activePlayer = await this.$store.dispatch("getActivePlayer");
      console.log("activePlayer", activePlayer);
    },
    async getVictorPlayer() {
      let victorPlayer = await this.$store.dispatch("getVictorPlayer");
      console.log("victorPlayer", victorPlayer);
    },
    async getGameResult() {
      let gameResult = await this.$store.dispatch("getGameResult");
      console.log("gameResult", gameResult);
    },
    async setChess(ev) {
      let actPlayer = this.$store.getters.currentAccount;
      if (
        actPlayer.toLowerCase() != this.$store.state.activePlayer.toLowerCase()
      ) {
        iziToast.info({
          message: "It's not your Turn !",
          timeout: 2000,
          color: "red"
        });
        return;
      }
      switch (actPlayer) {
        case this.$store.state.hostPlayer:
          var chess = "o";
          break;
        case this.$store.state.guestPlayer:
          var chess = "x";
          break;
      }
      var piece = ev.target;
      piece.tagName === "DIV" &&
        (async () => {
          var row = piece.dataset.pos.substr(0, 1),
            column = piece.dataset.pos.substr(2, 1);
          if (this.$store.state.chessBoard[row][column]) {
            return;
          }
          this.$store.state.chessBoard[row][column] = chess;
          try {
            var setChessRes = await this.$store.dispatch("setChess", {
              row,
              column,
              player: actPlayer
            });
            iziToast.destroy();
            console.log("setChessRes", setChessRes);
            piece.classList.add(chess, "animated", "flash");
          } catch (err) {
            iziToast.warning({
              message: "Sorry. The deal failed !",
              timeout: 2000,
              color: "red"
            });
            this.$store.state.chessBoard[row][column] = "";
          }
          if ("GameFinished" in setChessRes.events) {
            var gameResult =
              setChessRes.events.GameFinished.returnValues.gameResult;
            console.log("setChess=>gameResult", gameResult, setChessRes.events);
            switch (gameResult) {
              case "tie":
                this.$store.state.gameState.gameFinished = true;
                this.$store.state.gameState.gameResult = "tie";
                setTimeout(() => {
                  iziToast.show({
                    message: "You2 share the whole BonusPool equally !",
                    timeout: 5000,
                    color: "yellow"
                  });
                }, 3000);
                return;
                break;
              case "hostVictory":
                this.$store.state.gameState.gameFinished = true;
                this.$store.state.gameState.gameResult = "HostPlayer";
                setTimeout(() => {
                  iziToast.show({
                    title: "Congratulation",
                    message: "HostPlayer won the whole BonusPool !",
                    timeout: 5000,
                    color: "yellow"
                  });
                }, 3000);
                return;
                break;
              case "guestVictory":
                console.log("啊guest胜利"); //Toast
                this.$store.state.gameState.gameFinished = true;
                this.$store.state.gameState.gameResult = "GuestPlayer";
                setTimeout(() => {
                  iziToast.show({
                    title: "Congratulation",
                    message: "GuestPlayer won the whole BonusPool !",
                    timeout: 5000,
                    color: "yellow"
                  });
                }, 3000);
                return;
                break;
            }
          }
          this.$store.state.activePlayer =
            setChessRes.events.ActivePlayer.returnValues.activePlayerAddr;
        })();
    }
  }
};
</script>

<style scoped lang="scss">
:root {
  --bg-color: hsl(50, 100%, 75%);
  --cell-border-radius: 15%;
  --border-radius: 15%;
  --convex-radius: 0.5em;
  --x-bg-color: hsl(10, 100%, 50%);
  --o-bg-color: hsl(110, 100%, 50%);
  user-select: none;
}

.board {
  margin-top: 1rem;
  display: flex;
  background-color: hsl(200, 100%, 75%);
  border-radius: 4%;
  padding: 1em;
  box-shadow: inset -0.25em -0.25em 0.5em hsl(190, 100%, 15%),
    inset 0.25em 0.25em 0.5em hsl(190, 100%, 100%), 0 0.5em 5em black;
}

.column {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-basis: 100%;
}

.row {
  display: flex;
  flex-grow: 1;
  flex-basis: 100%;
  border: 0.3em solid hsl(200, 100%, 75%);
  border-radius: 15%;
}

.piece {
  flex-grow: 1;
  border-radius: 15%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0.5em 0.5em 0.5em hsla(200, 100%, 35%, 0.4),
    inset -0.5em -0.5em 0.5em hsla(200, 100%, 55%, 0.4);
  background: hsl(200, 100%, 75%);
  //animation: bounceIn 0.5s;
  color: white;
  cursor: grab !important;
}

.o {
  box-shadow: inset 0.5em 0.5em 0.5em rgba(255, 255, 255, 0.5),
    inset -0.5em -0.5em 0.5em rgba(0, 0, 0, 0.35), 0 0 0.3em hsl(40, 100%, 25%);
  background: hsl(110, 100%, 50%)
    linear-gradient(-45deg, hsl(110, 100%, 50%) 50%, rgba(255, 255, 255, 0.6));
}

.o > .icon::after {
  content: "\0E836";
}

.x {
  box-shadow: inset 0.5em 0.5em 0.5em rgba(255, 255, 255, 0.5),
    inset -0.5em -0.5em 0.5em rgba(0, 0, 0, 0.35), 0 0 0.3em hsl(40, 100%, 25%);
  background: hsl(10, 100%, 50%)
    linear-gradient(-45deg, hsl(10, 100%, 50%) 50%, rgba(255, 255, 255, 0.6));
}

.x > .icon::after {
  content: "\0E5CD";
}

.icon {
  display: inline-block;
  text-align: center;
  font-family: "icons";
  font-size: 3.2em;
  font-weight: bold;
  text-shadow: 0 0 0.4rem white;
}
</style>

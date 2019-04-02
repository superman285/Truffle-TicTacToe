# Truffle-TicTacToe
[![Build Status](https://www.travis-ci.org/superman285/TicTacToe.svg?branch=master)](https://www.travis-ci.org/superman285/TicTacToe)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/88208ca7e5dc4d47be6f268b5e168401)](https://www.codacy.com/app/superman285/Truffle-TicTacToe?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=superman285/Truffle-TicTacToe&amp;utm_campaign=Badge_Grade)
![GitHub package.json version](https://img.shields.io/github/package-json/v/superman285/TicTacToe.svg)
![GitHub madein china](https://img.shields.io/badge/made%20in-China-blueviolet.svg)
<a href="https://996.icu"><img src="https://img.shields.io/badge/link-996.icu-red.svg" alt="996.icu"></a>



### Project Brief

---

This Truffle Box is an intersting DApp! 😍 It's a Tic-Tac-Toe Game.



The game is built with <font color=dodgerblue style="font-weight:bold">Truffle</font>,<font color=dodgerblue style="font-weight:bold">Vue</font>,<font color=dodgerblue style="font-weight:bold">Vue-Cli3</font>,<font color=dodgerblue style="font-weight:bold">Solidity</font>,<font color=dodgerblue style="font-weight:bold">Web3</font> and some <font color=dodgerblue style="font-weight:bold">UI library</font>.

It is deployed on Rinkeby TestNet.



The SmartContract's game logic is referring to the dapp course from the `udemy.com`.

The GameBoard's style is referring to the tictactoe project from `madewithvuejs.com`.



The box contains the develop|test framework and complete configuration of vue,truffle;you can reform from the box to create your own awsome project！



You should install the metamask before playing the Game, just enjoy it!



Let's unbox and start!



### Install truffle and unbox the project

```
npm install -g truffle
truffle unbox superman285/Truffle-TicTacToe
```

### Project setup

```
npm install
```

### Launch the DApp
```
npm run serve
```

```
http://127.0.0.1:3000 
```

then you can access http://127.0.0.1:3000 to enjoy the Game!

Please Remember to install metamask plugin on Chrome or Firefox!



If you have develop or test requires,just look below：



### Test the Smart Contract

```
truffle test
```

### Compile the Smart Contract

```
truffle compile
```

### Deploy the compiled contract

```
truffle migrate --network rinkeby
```

💡you can config with your own account privatekey and infuraKey on truffle-config.js.



if you want to deploy the contract on the private network,you can start the Ganache UI at the port 7545 and then run

```
truffle migrate
```



### Compiles and minifies the DApp for production

```
npm run build
```



For the front-end test , I write some simple test-case.If needed,you can add test-cases.

### Run your front-end unit tests

```
npm run test
```

### Run your front-end end-to-end tests
```
npm run test:e2e
```



### That's All!Good Luck!



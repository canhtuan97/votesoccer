const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"))
const abi = require('C:/Users/admin/Desktop/VoteSoccer/build/contracts/1.json')
const contract = new web3.eth.Contract(abi, '0xA88A87bC5057524cCC338C54F6EAaa1E873278b6');


console.log(contract.addGame("trancanhtuan","Duy").send({from: 0x5D227b6bF92C669df6E2bD47dB065D30C88F3225,gas:210000,gasPrice:5000000000}))

console.log(contract.getGame());
// contract.methods.addGame("trancanhtuan","PhamVanDuy").call().then((ret) => {
// 		res.send(ret);
// 	});
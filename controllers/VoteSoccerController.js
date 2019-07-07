const request = require('request');
const async = require('async');
const Web3 = require('web3');
const abi = require('../build/contracts/1.json')
const MetaMaskConnector = require('node-metamask');
const  mysql = require('mysql');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"))
const  con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "vote"
});



// const fs = require('fs');
// const jsonFile = "C:/Users/admin/Desktop/VoteSoccer/build/contracts/Betting.json";
// const parsed= JSON.parse(fs.readFileSync(jsonFile));
// console.log(parsed);
// const abi = parsed.abi;
// const contract= new web3.eth.Contract(abi, '0x5D227b6bF92C669df6E2bD47dB065D30C88F3225');
const contract =web3.eth.contract(abi).at('0xe87C91c400503857A71Dc8e505B60708a2Fb1E1F');
// contract.methods.name().call(err,result) =>{console.log(result)};
const admin = contract.getAdmin();
console.log(contract.address)
// contract.methods.wakeUp().call().then((ret) => {
        //   console.log(ret);
        //   res.send(ret);
        // });
exports.home =  function(req,res){
	 	res.render("index");
	}
exports.login = function(req,res){
	var username = req.body.username;
	var password = req.body.password;
	
	if (username && password) {
		con.query('SELECT address FROM user WHERE user = ? AND pass = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				
				if (results == "0x5D227b6bF92C669df6E2bD47dB065D30C88F3225") {
					
					req.session.loggedin = true;
					req.session.username = username;
					res.redirect("/admin");
				}else{
					req.session.loggedin = true;
					req.session.username = username;
					res.render("admin");
				}
				
			} else {
				res.send('Incorrect Username and/or Password!');
			}			
			res.end();
		});
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}
}
exports.registerGet = function(req,res){
	res.render('register');
}
exports.registerPost = function(req,res){
	
	res.send(user);
	con.connect(function(err) {
		user = req.body.username;
	pass = req.body.password;
	  if (err) throw err;
	  console.log("Connected!");
	  var sql = "INSERT INTO user (user, pass) VALUES (user, pass)";
	  con.query(sql, function (err, result) {
	    if (err) throw err;
	    console.log("1 record inserted");
	  });
	});
}


exports.admin = function(req,res){
	res.render("admin");
}

exports.xetWinGet = function(req,res){
	var a = contract.getGame()
	res.render('team_win',{
		TeamA : a[0],
		TeamB : a[1]
	})
}

exports.client =function(req,res){
	var a = contract.getGame()
	var b1 = contract.totalBetOne()
	var b2 = contract.totalBetTwo()
	res.render('client',{
		TeamA : a[0],
		TeamB : a[1],
		b1 : b1,
		b2 : b2
	})
	// res.send("Team A:" + a[0] + "<br>" + "Team B :" + a[1]);
}
exports.test = function(req,res){
	var count = contract.totalBetOne();
	res.send(count);
}






exports.getAdressAdmin = function(req,res){
		contract.methods.getAdmin().call().then((ret) => {
		a = ret;
		res.send(ret);
	});
}
// exports.addGame = function(req,res){
// 	contract.methods.addCandidate(web3.utils.fromAscii("Trancanhtuan")).call().then((ret) => {
// 		res.send(ret);
// 	});
// }



exports.addGame = function(req,res){
	var teamA = req.body.TeamA;
	var teamB = req.body.TeamB;
	
	contract.addGame(teamA,teamB, {from: admin, gas:500000})
	res.redirect("/admin");
}


exports.getGame = function(req,res){
	 var a = contract.getGame()
	res.send("Team A:" + a[0] + "<br>" + "Team B :" + a[1]);

}

exports.bet = function(req,res){

	//var address_player = "0x102340A8b2766D280416539732fce638eEd18795";
	var address_player = req.body.address;
	// res.send(address_player);
	var id = req.body.team;
	var money = req.body.money +"00000000000000";
	// var bet = contract.bet(id,address_player,money,{from:address_player,gas:500000})
	// res.send("Bạn đã chọn đội thành công")

	var checkPlayerExist = contract.checkPlayerExist(address_player,{from:address_player,gas:500000})
	if (checkPlayerExist == true) {
		res.send("Bạn đã đặt cược rồi ")
	}else{
		var bet = contract.bet(id,address_player,money,{from:address_player,gas:500000})
		res.send("Bạn đã đặt thành công")
	}
}

exports.distributePrizes = function(req,res){
	// var id = req.body.team;

	var b = contract.distributePrizes(1, {from: admin, gas: 500000})
	res.send(b)
	
}

// exports.getCandidate = function(req,res){
// 	var getCount =  contract.methods.

// 	// contract.methods.getCandidateList().call().then((ret) => {
// 	// 	res.send(ret);
// 	// });
// }

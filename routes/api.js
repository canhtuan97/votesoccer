module.exports = function(app){
	var controller = require("../controllers/VoteSoccerController");

	app.route('/test').get(controller.test);
	
	app.route('/').get(controller.home);

	app.route('/login').post(controller.login);


	app.route('/admin').get(controller.admin);
	app.route('/xet_win').get(controller.xetWinGet);
	// app.route('/xet_win').post(controller.distributePrizes);

	app.route('/client').get(controller.client);


	app.route('/register').get(controller.registerGet);
	

	// xử lí contract
	app.route('/get_address_admin').get(controller.getAdressAdmin);
	app.route('/add_game').post(controller.addGame);
	app.route('/get_game').get(controller.getGame);


	app.route('/bet').post(controller.bet);

	
	app.route('/distributePrizes').get(controller.distributePrizes);
	





	app.route('/register_p').post(controller.registerPost);
	
};

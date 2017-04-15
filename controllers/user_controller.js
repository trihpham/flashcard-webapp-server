
const User = require('../models/user');
const mongoose = require('mongoose');

module.exports = {
	get(req, res, next){
		const userId = req.params.userId;

		User.findById(userId).then((user)=>{
			const name = user.fullName;
			const flashcardSetCount = user.flashcardSets.length;
			res.send({name, flashcardSetCount});
		}).catch(next);
	}

}
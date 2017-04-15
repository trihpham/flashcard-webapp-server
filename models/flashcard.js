const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const flashcardSchema = new Schema({
	term: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	definition: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	}
});




module.exports = flashcardSchema;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const flashcardSchema = require('./flashcard');

const flashcardSetSchema = new Schema({
    _creator: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    title: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    description: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    flashcards: [flashcardSchema],
    tags: [String]
});

flashcardSetSchema.index({
    title: 'text'
});


const FlashcardSet = mongoose.model('flashcardSet', flashcardSetSchema);

module.exports = FlashcardSet;
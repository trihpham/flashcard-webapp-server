const {ObjectID} = require('mongodb');

const FlashcardSet = require('./../../models/flashcard_set');
const Flashcard = require('./../../models/flashcard');
const User = require('./../../models/user');
const {createTokenForUser} = require('./../../controllers/authentication');

const users = [
    {
        _id: new ObjectID(),
        email: 'test@example.com',
        password: 'password'
    }];

const flashcardSets = [
    {
        _id: new ObjectID(),
        title: "first flashcard set",
        description: "first description"
    },
    {
        _id: new ObjectID(),
        title: "second flashcard set",
        description: "first description"
    },
];


const populateFlashcardSets = (done) => {
    FlashcardSet.remove({}).then(() => {
        return FlashcardSets.insertMany(flashcardSets);
    }).then(() => done());
};

module.exports = {
    flashcardSets,
    populateFlashcardSets
};
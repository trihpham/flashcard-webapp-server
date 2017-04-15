const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const FlashcardSet = require('../models/flashcard_set');
const Flashcard = require('../models/flashcard');
const User = require('../models/user');
const {flashcardSets} = require('./flashcard_sets_data');

mongoose.connect('mongodb://localhost:27017').then(() => {
    mongoose.connection.db.dropDatabase();
}).then(() => {

    const me = new User({
        email: "owner@gmail.com",
        password: "myflashcardwebapp",
        firstName: "Tri",
        lastName: "Pham"
    });

    const john = new User({
        email: "johnSmith@gmail.com",
        password: "appleseed",
        firstName: "John",
        lastName: "Smith"
    });

    return Promise.all([me.save(), john.save()]);
}).then(values => {
    const meId = values[0]._id;
    const johnId = values[1]._id;

    User.findById(meId).then((user) => {
        const flashcardSet = createFlashcardSet(flashcardSets[0], user._id);
        const anotherFlashcardSet = createFlashcardSet(flashcardSets[1], user._id);
        user.flashcardSets.push(flashcardSet);
        user.flashcardSets.push(anotherFlashcardSet);
        user.save();
        flashcardSet.save();
        anotherFlashcardSet.save();

    });

    User.findById(johnId).then((user) => {
        const flashcardSet = createFlashcardSet(flashcardSets[2], user._id);
        user.flashcardSets.push(flashcardSet);
        user.save();
        flashcardSet.save();
    });
})


const createFlashcardSet = (flashcardSet, userId) => {
    const {title, description, flashcards} = flashcardSet;
    const newflashcardSet = new FlashcardSet({
        title,
        description,
        _creator: userId
    });

    flashcards.forEach((flashcard) => {
        let {term, definition} = flashcard;
        const newFlashcard = {
            term,
            definition
        };
        newflashcardSet.flashcards.push(newFlashcard);
    });
    return newflashcardSet;

};

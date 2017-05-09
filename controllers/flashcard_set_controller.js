const FlashcardSet = require('../models/flashcard_set');
const Flashcard = require('../models/flashcard');
const User = require('../models/user');
const mongoose = require('mongoose');

module.exports = {

    //FlashcardSet includes [Flashcards]
    create(req, res, next) {
        const userId = req.user._id;
        const {title, description, tags} = req.body;
        const flashcardList = req.body.flashcards;


        const newflashcardSet = new FlashcardSet({
            title,
            description,
            tags,
            _creator: userId
        });


        flashcardList.forEach((flashcard) => {
            let {term, definition} = flashcard;
            const newFlashcard = {
                term,
                definition
            };
            newflashcardSet.flashcards.push(newFlashcard);
        });


        User.findById(userId).then((user) => {
            user.flashcardSets.push(newflashcardSet);
            return Promise.all([user.save(), newflashcardSet.save()]);
        }).then((data) => {
            res.send(newflashcardSet);
        }).catch(next);
    },

    //delete 1 Flashcard Set from a user
    delete(req, res, next) {
        const userId = req.user._id;
        const flashcardSetId = req.params.flashcardSetId;
        let flashcardSet;
        User.findById(userId).then((user) => {
            flashcardSet = user.flashcardSets.id(flashcardSetId).remove();
            return user.save();
        }).then(() => {
            if (flashcardSet) {
                return FlashcardSet.findOneAndRemove({
                    _id: flashcardSetId
                }).exec();
            }
        }).catch(next);


    },

    update(req, res, next) {
        const userId = req.user._id;
        const {title, description, tags, flashcardSetId} = req.body;
        let flashcardSet;
        FlashcardSet.findOneAndUpdate({
            _creator: userId,
            _id: flashcardSetId
        }, {
            title,
            description,
            tags
        }, {
            new: true
        }).then((updatedDocument) => {
            res.send(updatedDocument);
        }).catch(next);
    },
    //get 15 Flashcard Sets 
    index(req, res, next) {

        const {userId, searchTerm} = req.query;
        const offset = parseInt(req.query.offset) || 0;
        const limit = parseInt(req.query.limit) || 10;


        const buildCriteria = (criteria) => {
            const query = {};


            if (criteria.searchTerm) {
                query.$text = {
                    $search: criteria.searchTerm
                };
            }

            return query;
        }
        const criteria = buildCriteria({
            searchTerm
        });

        const query = FlashcardSet.find(criteria)
            .skip(offset)
            .limit(limit).populate('_creator');

        const countQuery = FlashcardSet.find(criteria).count();

        Promise.all([query, countQuery]).then((results) => {
            res.send({
                all: results[0],
                count: results[1],
                offset,
                limit
            });
        }).catch(next);

    },

    getById(req, res, next) {
        const flashcardSetId = req.params.flashcardSetId;
        FlashcardSet.findById(flashcardSetId).populate('_creator').then((flashcardSet) => {
            res.send(flashcardSet);
        }).catch(next);
    },

    getFlashcardSetsByUser(req, res, next) {
        const userId = req.params.userId;
        const searchTerm = req.query.searchTerm;
        const offset = parseInt(req.query.offset) || 0;
        const limit = parseInt(req.query.limit) || 10;

        const expression = new RegExp(searchTerm, 'i');
        User.findById(userId).populate(
            {
                path: 'flashcardSets',
                match: {
                    title: {
                        $regex: expression
                    }
                }
            }).then((user) => {
            const flashcardSets = user.flashcardSets;
            res.send({
                all: flashcardSets
            });
        }).catch(next);



    },



    getAllByUser(req, res, next) {
        const userId = req.params.userId;
        User.findById(userId).populate('flashcardSets').then((user) => {
            res.send(user.flashcardSets);
        }).catch(next);
    },

    getAllByCurrentUser(req, res, next) {
        User.findById(req.user._id).populate('flashcardSets').then((user) => {
            res.send(user);
        }).catch(next);
    },






    delete(req, res, next) {
        const user = req.user;
        const userId = req.body.userId;
        const flashcardSetId = req.body.flashcardSetId;

        User.findOneAndUpdate(
            {
                _id: user._id
            },
            {
                $pull: {
                    flashcardSets: flashcardSetId
                }
            })
            .then((user) => {
                const foundIndex = user.flashcardSets.find(id => id.equals(flashcardSetId));
                if (!foundIndex && foundIndex !== 0) {
                    throw 'No index found';
                }

                return FlashcardSet.findOneAndRemove({
                    _id: flashcardSetId
                });

            }).then(
            (flashcardSet) => {
                res.send(flashcardSet);
            }
        ).catch(next);


    },


    addFlashcard(req, res, next) {
        const currentUserId = req.user._id;
        const flashcardSetId = req.body.flashcardSetId;
        let newFlashcard;
        FlashcardSet.findById(flashcardSetId).then((flashcardSet) => {


            if (flashcardSet._creator.equals(currentUserId)) {

                const {term, definition} = req.body.flashcard;
                newFlashcard = flashcardSet.flashcards.create({
                    term,
                    definition
                });
                flashcardSet.flashcards.push(newFlashcard);
                return flashcardSet.save();
            }
        }).then(() => {
            res.send(newFlashcard);
        }).catch(next);

    },

    addFlashcardInBulk(req, res, next) {
        const currentUserId = req.user._id;
        const flashcardSetId = req.body.flashcardSetId;
        const flashcards = req.body.flashcards;

        FlashcardSet.findById(flashcardSetId).then((flashcardSet) => {
            if (flashcardSet._creator.equals(currentUserId)) {
                flashcards.forEach(({term, definition}) => {
                    newFlashcard = flashcardSet.flashcards.create({
                        term,
                        definition
                    });
                    flashcardSet.flashcards.push(newFlashcard);
                });
                return flashcardSet.save();
            }
        }).then((flashcardSet) => {
            res.send(flashcardSet);
        }).catch(next);

    },
    removeFlashcard(req, res, next) {
        const currentUserId = req.user._id;
        const flashcardSetId = req.body.flashcardSetId;
        const flashcardId = req.body.flashcardId;
        let removedFlashcard;
        FlashcardSet.findById(flashcardSetId).then((flashcardSet) => {
            if (flashcardSet._creator.equals(currentUserId)) {
                removedFlashcard = flashcardSet.flashcards.id(flashcardId).remove();
                return flashcardSet.save();
            }
        }).then(() => {
            res.send(flashcardId);
        }).catch(next);
    },
    updateFlashcard(req, res, next) {
        const {term, definition} = req.body.flashcard;
        const currentUserId = req.user._id;
        const flashcardSetId = req.body.flashcardSetId;
        const flashcardId = req.body.flashcardId;
        let flashcard;
        FlashcardSet.findById(flashcardSetId).then((flashcardSet) => {
            if (flashcardSet._creator.equals(currentUserId)) {
                flashcard = flashcardSet.flashcards.id(flashcardId);
                flashcard.term = term;
                flashcard.definition = definition;
                return flashcardSet.save();
            }
        }).then(() => {
            res.send(flashcard);
        }).catch(next);


    }




};


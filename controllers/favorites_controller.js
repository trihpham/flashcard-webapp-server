const User = require('../models/user');
const mongoose = require('mongoose');

module.exports = {


    getFavorites(req, res, next) {
        User.findById(req.user._id).populate('favorites').then((user) => {
            res.send(user);
        }).catch(next);
    },

    removeFavorite(req, res, next) {
        const userId = req.user._id;
        User.findOneAndUpdate(
            {
                _id: userId
            },
            {
                $pull: {
                    favorites: flashcardSetId
                }
            }).then((user) => {
            res.send(user.favorites);
        }).catch(next);

    },

    addFavorite(req, res, next) {
        const userId = req.user._id;
        User.findOneAndUpdate(
            {
                _id: userId
            },
            {
                $push: {
                    favorites: flashcardSetId
                }
            }).then((user) => {
            res.send(user.favorites);
        }).catch(next);
    }

}
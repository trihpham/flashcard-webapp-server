const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const validator = require('validator');

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
        trim: true,
        minlength: 1,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },

    flashcardSets: [{
        type: Schema.Types.ObjectId,
        ref: 'flashcardSet'
    }],


});

//On Save Hook, encrypt password
//might cause problems on changing passwords later


userSchema.pre('save', function(next) {
    const user = this;

    if (this.isNew) {
        bcrypt.genSalt(10, function(err, salt) {
            if (err) {
                return next(err);
            }

            bcrypt.hash(user.password, salt, null, function(err, hash) {
                if (err) {
                    return next(err);
                }

                user.password = hash;
                next();
            });

        });
    } else {
        next();
    }
});

userSchema.virtual('fullName').get(function() {
    return this.firstName + ' ' + this.lastName;
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) {
        return callback(err);
    }
    callback(null, isMatch);
});
}


userSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        var retJson = {
            name: ret.firstName + ' ' + ret.lastName,
            _id: ret._id
        };
        return retJson;
    }
});


const ModelClass = mongoose.model('user', userSchema);

module.exports = ModelClass;
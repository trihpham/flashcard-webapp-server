const Authentication = require('./controllers/authentication');
const FlashcardSet = require('./controllers/flashcard_set_controller');
const User = require('./controllers/user_controller');
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', {session: false});
const requireSignin = passport.authenticate('local', {session: false});

module.exports = function(app) {
	app.get('/', requireAuth, function(req,res){
		res.send({message: 'Super secret code is 123abc'});
	});
	app.post('/signin', requireSignin,Authentication.signin);
	app.post('/signup', Authentication.signup);

	app.post('/flashcardset', requireAuth, FlashcardSet.create );
	app.post('/flashcardset/update', requireAuth, FlashcardSet.update);
	app.get('/flashcardsets', FlashcardSet.index );
	app.get('/flashcardset/:flashcardSetId', FlashcardSet.getById );
	app.get('/flashcardsets/user/:userId', FlashcardSet.getFlashcardSetsByUser );

	app.post('/flashcardset/delete', requireAuth, FlashcardSet.delete );

	app.post('/flashcardset/flashcard/add', requireAuth,FlashcardSet.addFlashcard);
	app.post('/flashcardset/flashcard/addBulk', requireAuth,FlashcardSet.addFlashcardInBulk);
	app.post('/flashcardset/flashcard/remove', requireAuth,FlashcardSet.removeFlashcard);
	app.put('/flashcardset/flashcard/update', requireAuth,FlashcardSet.updateFlashcard);

	app.get('/user/:userId', User.get);

}
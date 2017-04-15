const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

before((done)=>{
mongoose.connect('mongodb://localhost/flashcard_test');
mongoose.connection
	.once('open', ()=>{done();})
	.on('error', (error) =>{
		console.warn('Warnin', error);
	});

});



beforeEach((done)=>{
	const { flashcardSets, users } = mongoose.connection.collections; 
	users.drop(()=>{
		flashcardSets.drop(()=>{
				done();
		});
	});
});
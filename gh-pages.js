var ghpages = require('gh-pages');

ghpages.publish(
	'public', // path to public directory
	{
		branch: 'gh-pages',
		repo: 'https://github.com/eginhard/gaussian-distributions.git', // Update to point to your repository
		user: {
			name: 'Enno Hermann', // update to use your name
			email: 'enno.hermann@gmail.com' // Update to use your email
		},
		dotfiles: true
	},
	() => {
		console.log('Deploy Complete!');
	}
);

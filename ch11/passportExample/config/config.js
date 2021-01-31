
/*
 * 설정
 */

module.exports = {
	server_port: 3000,
	db_url: 'mongodb://localhost:27017/local',
	db_schemas: [
	    {file:'./user_schema', collection:'users6', schemaName:'UserSchema', modelName:'UserModel'}
	    , {file: './post_schema', collection:'posts', schemaName:'PostSchema', modelName:'PostModel'}
	],
	route_info: [
		{file: './post', path:'/process/addpost', type:'post', method:'addPost'}
		, {file: './post', path:'/process/showpost/:id', type:'get', method:'showPost'}
		, {file: './post', path:'/process/listpost', type:'get', method:'listPost'}
	],
	facebook: {		// passport facebook
		clientID: '369295014171710',
		clientSecret: '2f83f0032b15a9eb7e3cd650d19ec78a',
		callbackURL: 'http://localhost:3000/auth/facebook/callback',
		profileFields: ['id', 'email', 'name']
	},
	twitter: {		// passport twitter
		clientID: 'id',
		clientSecret: 'secret',
		callbackURL: '/auth/twitter/callback'
	},
	google: {		// passport google
		clientID: 'id',
		clientSecret: 'secret',
		callbackURL: '/auth/google/callback'
	}
}
// dependencies
var path = require("path"),
	fs = require("fs"),
	util = require('util'),
	prompt = require('prompt'),
	api = require("cloudvisio-api");

var Exec = function( program ){

	this.program = program;
	// setup configuration
	this.config();
	//
	this.api = api;
}

Exec.prototype = {

	options: {

	},

	setup: function(){
		var config = getConfig();
		// defaults
		var creds = {
		};
		//
		if( !fs.existsSync(config) ){
			console.log("fff");
			// create creds file
			fs.writeFileSync(config, JSON.stringify( creds ));
		} else {
			// load existing values
			creds = JSON.parse( fs.readFileSync(config, "utf-8") );
		}
		//
		// Start the prompt
		//
		prompt.start();
		//
		// Get two properties from the user: username and email
		//
		prompt.get(['email', 'token'], function (err, response) {
			//
			// Log the results.
			//
			// save existing params
			creds.email = response.email;
			creds.token = response.token;
			// save back to the file if we passed new values
			fs.writeFileSync(config, JSON.stringify( creds ));
			console.log('Setup complete.');
			// save creds for later...
			this.creds = creds;
		});
	},

	config: function(){
		var file = path.join(__dirname, "../", "config/path");
		// defaults
		var creds = {
		};
		/*
		// change the config file path
		if (this.program.config){
			var config_file = this.program.config;
			// open the config and save the new path
			var config = fs.openSync(file, "w");
			fs.writeSync(config, config_file, 0);

		} else {
			// load the config path
			var config_file = fs.readFileSync(file, "utf-8");
		}
		// either way load the config credentials
		if( !fs.existsSync(config_file) ){
			// create creds file
			fs.writeFileSync(config_file, JSON.stringify( creds ));
		} else {
			// load existing values
			creds = JSON.parse( fs.readFileSync(config_file, "utf-8") );
		}
		// save existing params
		if (this.program.key){
			creds.key = this.program.key;
		}
		if (this.program.secret){
			creds.secret = this.program.secret;
		}
		// save back to the file if we passed new values
		if (this.program.key || this.program.secret || this.program.app){
			fs.writeFileSync(config_file, JSON.stringify( creds ));
		}
		// save creds for later...
		this.creds = creds;
		*/
	},

	user : function( domain, options ){
		var cloudvisio = this.api.auth({key: this.creds.key ,secret: this.creds.secret, app: this.creds.app });

		if( options.list ){
			// read the user list instead

		}

	},

	product : function( domain, options ){
		var cloudvisio = this.api.auth({key: this.creds.key ,secret: this.creds.secret, app: this.creds.app });

		if( options.list ){
			// read the user list instead

		}

	},

	sub : function( domain, options ){
		// fallbacks
		options = options || {};
		var cloudvisio = this.api.auth({keyid: this.creds.key ,secret: this.creds.secret, app: this.creds.app });

		if( domain == "*" ){
			// read the domain list instead
			return cloudvisio.list(function( error, result ) {
				if( error ) return console.log( error );
				output( result );
			});
		}
		var query = "";
		var fields = ( options.fields )? options.fields : "*";
		query += "select "+ fields +" from "+ domain;
		// add options
		if( options.query ){
			query += " where "+ options.query;
		}
		if( options.item ){
			query += " where itemName()='"+ options.item +"'";
		}
		if( options.order ){
			query += " order by "+ options.order;
		}
		if( options.limit ){
			query += " limit "+ options.limit;
		}
		cloudvisio.select( query, function( error, result ) {
			if( error ) return console.log( error );
			output( result );
		});

	}
}

// Helpers
function output( obj ){
	return console.log(JSON.stringify(obj));
	//return console.log( util.inspect(obj, false, null) );
}

function homeDir() {
	return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

function getConfig(){
	var config = path.join(__dirname, "../", "config/path");
	// load the config file
	var file = fs.readFileSync(config, "utf-8");
	var home = homeDir( file );
	// FIX : replace home dir
	file = file.replace("~", home);
	return file;
}

module.exports = function( program ){

	return new Exec( program );

}
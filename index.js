#! /usr/local/bin/node
var request = require('request')
var fs = require('fs')
var arg = process.argv[2]
//request.debug = true
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var Send = function(command) {
	request({
		method: "POST",
		uri: "https://192.168.1.149:23895",
		json: true,
		body: {
			action: command
		}
	})
}

if (arg) {
	return Send(arg);
}

var toUnicode = function (theString) {
  var unicodeString = '';
  for (var i=0; i < theString.length; i++) {
    var theUnicode = theString.charCodeAt(i).toString(16).toUpperCase();
    while (theUnicode.length < 4) {
      theUnicode = '0' + theUnicode;
    }
    theUnicode = '\\u' + theUnicode;
    unicodeString += theUnicode;
  }
  return unicodeString;
}

var stdin = process.stdin;

// without this, we would only get streams once enter is pressed
stdin.setRawMode( true );

// resume stdin in the parent process (node app won't quit all by itself
// unless an error or process.exit() happens)
stdin.resume();

// i don't want binary, do you?
stdin.setEncoding( 'utf8' );

console.log("Listening for keyboard events.")
console.log("Ctrl-C to quit.")

// on any data into stdin
stdin.on( 'data', function( key ){
	// ctrl-c ( end of text )
	switch (key) {
		case '\u0003':
			process.exit();
		case '\u001B\u005B\u0041':
			//process.stdout.write('up');
			Send('Up');
			break;
		case '\u001B\u005B\u0043': 
			//process.stdout.write('right');
			Send('Right');
			break;
		case '\u001B\u005B\u0042': 
			//process.stdout.write('down');
			Send('Down');
			break;
		case '\u001B\u005B\u0044': 
			//process.stdout.write('left');
			Send('Left');
			break;
		case '\u002D':
			//process.stdout.write('-');
			Send('VolumeDown');
			break;
		case '\u002B':
			//process.stdout.write('+');
			Send('VolumeUp');
			break;
		case '\u000D':
			//process.stdout.write("Enter");
			Send('Confirm');
			break;
		case '\u0070':
			//process.stdout.write("P");
			Send('TvPower');
			break;
		case '\u0008':
			//process.stdout.write("Return");
			Send('Return');
			break;
		case '\u0068':
			//process.stdout.write("h");
			Send('Home');
			break;
		default:
			console.log(toUnicode(key));
	}
});



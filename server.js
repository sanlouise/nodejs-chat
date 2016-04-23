var mongo = require('mongodb').MongoClient,
    client = require('socket.io').listen(8080).sockets;

mongo.connect('mongodb://127.0.0.1/NodeJS_Chat', function(err, db) {
    if(err) throw err;

    client.on('connection', function(socket) {

        var col = db.collection('messages');

            //For security reasons, important to take care of the status on the server side.
            sendStatus = function(s) {
                socket.emit('status', s);
            };

        //Wait for input
        socket.on('input', function(data) {

            var name = data.name,
                message = data.message,
                //Check for white spaces
                whitespacePattern = /^\s*$/;
            if (whitespacePattern.test(name) || whitespacePattern.test(message)) {
                sendStatus('Name and message are required.');
            } else {
                col.insert({name: name, message: message}, function() {
                    console.log('Inserted');
                });
            }
        });
    });
});

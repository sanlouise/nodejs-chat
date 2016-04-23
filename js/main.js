(function() {
    var getNode = function(s) {
            return document.querySelector(s);
        },

    //Get required nodes
        status = getNode('.chat-status span'),
        messages = getNode('.chat-messages'),
        textarea = getNode('.chat textarea'),
        chatName = getNode('.chat-name '),

        statusDefault = status.textContent,

        setStatus = function(s) {
            status.textContent = s;

            if(s !== statusDefault) {
                var delay = setTimeout(function() {
                    setStatus(statusDefault);
                    clearInterval(delay);
                }, 3000);
            }
        };

    //Try connection
    try {
        var socket = io.connect('http://127.0.0.1:9000');
    } catch(e) {
        //Set status to warn user
    }

    if(socket !== undefined) {
        //Listen for output
        socket.on('output', function(data) {
            if(data.length) {
                //Loop through all the results
                for(var x = 0; x < data.length; x = x + 1) {
                    //Create new div
                    var message = document.createElement('div');

                    message.setAttribute('class', 'chat-message');
                    //Data contains the message and the name
                    message.textContent = data[x].name + ': ' + data[x].message;

                    //Append
                    //Messages is the main container
                    messages.appendChild(message);
                    //The last message shows at the top
                    messages.insertBefore(message, messages.firstChild);
                }
            }
        });

        //Listen for status
        socket.on('status', function(data) {
            setStatus((typeof data === 'object') ? data.message : data);

            if(data.clear === true) {
                textarea.value = '';
            }
        });

        //Listen for keydown
        textarea.addEventListener('keydown', function(event) {
            var self = this,
                name = chatName.value;

            //is enter down (without shift being held)?
            if(event.which === 13 && event.shiftKey === false) {
                socket.emit('input', {
                    name: name,
                    message: self.value
                });

                event.preventDefault();
            }
        });
    }
})();

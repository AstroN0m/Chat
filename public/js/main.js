var Chat = {
    initializeLogin: function (url, successMessage) {
        function submit(form) {
            $(":submit", form).button("loading");

            $.ajax({
                url: url,
                method: "POST",
                data: form.serialize(),
                success: function () {
                    $(":submit", form).button("reset");
                    form.html(successMessage).addClass('alert-success');
                    window.location.href = "/chat";
                },

                error: function (jqXHR) {
                    var error = JSON.parse(jqXHR.responseText);
                    $('.status').text(error.message).addClass(' alert alert-danger');
                    $(":submit", form).button("reset");
                }
            });
        }

        $('.login-form').validate({
            rules: {
                username: 'required',
                password: 'required'
            },
            messages: {
                username: 'Username is required',
                password: 'Password is required'
            },

            submitHandler: function(form) {
                submit($(form));
            }
        })
    },

    initializeSocket: function () {
        var input = $('#room input');
        var messagesUl = $('#room .messages-list-section ul');
        var usersUl = $('#room .users-list-section ul');
        var form = $('#room form');

        var socket = io.connect('', {
            reconnect: false
        });

        socket
            .on('message', function (username, color, message) {
                printMessage(username, color, message);
            })
            .on('leave', function (username, users) {
                printStatus(username + ' left chat', 'user-left');
                updateUsersList(users);
            })
            .on('join', function (username, users) {
                printStatus(username + ' came to chat', 'user-enter');
                updateUsersList(users);
            })
            .on('connect', function () {
                printStatus('connection is on', 'connected');
                form.on('submit', sendMessage);
                input.prop('disabled', false);
            })
            .on('disconnect', function () {
                printStatus('connection lost', 'disconnected');
                form.off('submit', sendMessage);
                input.prop('disabled', true);
                this.$emit('error');
            })
            .on('logout', function () {
                location.href = "/";
            })
            .on('error', function (reason) {
                if (reason == 'handshake unauthorized') {
                    printStatus("you left chat", 'user-left');
                } else {
                    setTimeout(function () {
                        socket.socket.connect();
                    }, 500);
                }
            });

        function sendMessage() {
            var text = Util.htmlEncode(input.val());
            var errorElement = $('.error-message');

            if (text) {
                errorElement.empty();
                socket.emit('message', text, function () {
                    printMessage("me", null, text);
                });

                input.val('');
            } else {
                errorElement.text('Enter a message');
            }

            return false;
        }

        function printStatus (status, type) {
            $('<li class="{0}"></li>'.format(type)).text(status).appendTo(messagesUl);
        }

        function printMessage (username, color, message) {
            var li = $('<li style="color: {0}"></li>'.format(color || '#000'));
            li.append($('<span class="nickname"></span>').text(username + ': '));
            li.append($('<span></span>').text(message));

            li.appendTo(messagesUl);
        }

        function updateUsersList(users){
            usersUl.empty();
            $.each(users, function(index) {
                var user = users[index];

                $('<li style="color: {0}"></li>'.format(user.color)).text(user.username).appendTo(usersUl);
            })
        }
    }
};





define(
    ['jquery', 'io', 'htmlHelper', 'bootstrap'],
    function( $, io, htmlHelper ){
        var chat = {
    initializeLogin: function (url, successMessage) {
        $(document.forms['login-form']).on('submit', function () {
            var form = $(this);

            $('.error', form).html('');
            $(":submit", form).button('loading');

            $.ajax({
                url: url,
                method: "POST",
                data: form.serialize(),
                complete: function () {
                    $(":submit", form).button("reset");
                },
                statusCode: {
                    200: function () {
                        form.html(successMessage).addClass('alert-success');
                        window.location.href = "/chat";
                    },
                    403: function (jqXHR) {
                        var error = JSON.parse(jqXHR.responseText);
                        $('.error', form).html(error.message);
                    }
                }
            });
            return false;
        });
    },

    initializeSocket: function () {
        var input = $('#room input');
        var ul = $('#room ul');
        var form = $('#room form');

        var socket = io.connect('', {
            reconnect: false
        });

        socket
            .on('message', function (username, color, message) {
                printMessage(username, color, message);
            })
            .on('leave', function (username) {
                printStatus(username + ' left chat', 'user-left');
            })
            .on('join', function (username) {
                printStatus(username + ' came to chat', 'user-enter');
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
            var text = input.val();
            socket.emit('message', text, function () {
                printMessage("me", null, text);
            });

            input.val('');
            return false;
        }

        function printStatus (status, type) {
            $('<li class="' + type + '">').append($('<i>').text(status)).appendTo(ul);
        }

        function printMessage (username, color, message) {
            var color = color || '#000';
            $('<li style="color:' + color + '"><span class="nickname">' + htmlHelper.encodeHtml(username) + ': </span>' + htmlHelper.encodeHtml(message) + '</li>').appendTo(ul);
        }
    }
};

return chat;
    });
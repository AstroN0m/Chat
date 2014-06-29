define(
    ['jquery', 'io', 'htmlHelper', 'bootstrap', 'jqueryValidate'],
    function( $, io, htmlHelper ) {
        var chat = {
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

                    submitHandler: function (form) {
                        submit($(form));
                    }
                })
            },

            initializeSocket: function () {
                var input = $('#room input');
                var messagesWrap = $('#room .messages-list-section');
                var messagesUl = messagesWrap.find('ul');
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
                    var text = htmlHelper.encodeHtml(input.val());
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

                function scrollToLastMessage() {
                    messagesWrap.scrollTop(messagesWrap[0].scrollHeight);
                }
                var format = $.validator.format;

                function printStatus(status, type) {
                    $(format('<li class="{0}"></li>', type)).text(status).appendTo(messagesUl);
                    scrollToLastMessage();
                }

                function printMessage(username, color, message) {
                    var li = $(format('<li style="color: {0}"></li>', color || '#000'));
                    li.append($('<span class="nickname"></span>').text(username + ': '));
                    li.append($('<span></span>').text(message));

                    li.appendTo(messagesUl);
                    scrollToLastMessage();
                }

                function updateUsersList(users) {
                    usersUl.empty();
                    $.each(users, function (index) {
                        var user = users[index];

                        $(format('<li style="color: {0}"></li>', user.color)).text(user.username).appendTo(usersUl);
                    })
                }
            }
        };

        return chat;
    });

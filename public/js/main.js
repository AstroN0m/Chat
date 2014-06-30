var Chat = angular.module('Chat', []);

/*var chat = {
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



 function sendMessage() {
 var message = input.val();
 var errorElement = $('.error-message');

 if (message) {
 errorElement.empty();
 socket.emit('message', message, function () {
 printMessage("me", null, htmlHelper.encodeHtml(message));
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
 li.append($('<span class="nickname"></span>').html(username + ': '));
 li.append($('<span></span>').html(message));

 li.appendTo(messagesUl);
 scrollToLastMessage();
 }


 }
 }
 };*/

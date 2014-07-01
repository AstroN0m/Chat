Chat.controller('ChatController', ['$scope', 'socket', function ($scope, socket) {
	$scope.messages = [];
	$scope.onlineUsers = [];
	$scope.disabledChat = true;
	$scope.message = '';
	$scope.errorMessage = '';

	var statusColors = {
		'join': '#0F0',
		'leave': '#F00',
		'connected': '#0F0',
		'disconnected': '#F00'
	}
	var form = $('.message-form-wrap form');

	function addMessage(username, color, message) {
		$scope.messages.push({
			username: username,
			color: color || '#000',
			message: message
		});

	}

	function addStatus(status, text) {
		var color = statusColors[status] || '#0F0';
		addMessage('system', color, status);
	}

	function updateUsersList(users) {
		$scope.onlineUsers = users || [];
	}

	function sendMessage() {
		var message = $scope.message;
		if (message) {
			$scope.errorMessage = '';
			socket.emit('message', message, function () {
				addMessage("me", null, message);
				$scope.message = '';
			});

		} else {
			$scope.errorMessage = 'Enter a message';
		}

		return false;
	}

	socket.on('message', function (username, color, message) {
		addMessage(username, color, message);
	})
	socket.on('leave', function (username, users) {
		addStatus('leave', username + ' left chat');
		updateUsersList(users);
	})
	socket.on('join', function (username, users) {
		addStatus('join', username + ' came to chat');
		updateUsersList(users);
	})
	socket.on('connect', function () {
		addStatus('connected', 'connection is on');
		$scope.disabledChat = false;
		form.on('submit', sendMessage);
	})
	socket.on('disconnect', function () {
		addStatus('disconnected', 'connection is lost');
		$scope.disabledChat = true;
		form.off('submit', sendMessage);
		this.$emit('error');
	})
	socket.on('logout', function () {
		location.href = "/";
	})
	socket.on('error', function (reason) {
		if (reason == 'handshake unauthorized') {
			addStatus('leave', 'you left chat');
		} else {
			setTimeout(function () {
				socket.socket.connect();
			}, 500);
		}
	});
}]);
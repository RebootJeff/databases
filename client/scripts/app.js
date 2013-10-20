// Helper functions:

var getData =  function() {
  $.ajax({
    // always use this url
    url: 'http://127.0.0.1:8080/classes/chatterbox',
    dataType: 'json',
    type: 'GET',
    data: {
      order: "-createdAt",
      room: window.currentRoom
    },
    success: function (data) {
      console.log(data);
      render(data);
    },
    error: function (data) {
      console.error('chatterbox: Failed to retrieve messages');
    }
  });
};

var render = function (data) {
  // console.log(data)
  // window.rooms = {};
  // _(data).each(function (datum) {
  //   if (rooms[datum.roomname] === undefined) {
  //     window.rooms[datum.roomname] = [datum];
  //   } else {
  //     window.rooms[datum.roomname].push(datum);
  //   }
  // });

  // var currentRoom = rooms[window.currentRoom];
  // if (currentRoom) {
  //   $('.chatList').html('');
  //   for (var i = 0; i < window.pageSize; i++) {
  //     var datum = currentRoom[i];
  //     var username = $("<span class='username'></span>");
  //     username.text((datum ? datum.username + ": " : ""));
  //     var msgtext = $("<span class='msgtext'></span>");
  //     msgtext.text((datum ? datum.text : ""));
  //     var newMsg = $("<li class='msg'></li>");
  //     var UN = username.text().slice(0, username.text().length - 2);
  //     if (window.friends[UN]) {
  //       newMsg.addClass("friendMessage");
  //     }
  //     newMsg.append(username);
  //     newMsg.append(msgtext);
  //     if (!window.blocked[UN]) { $('.chatList').append(newMsg); }
  //   }
  // } else {
  //   $('.chatList').html("<i>No messages here yet.</i>");
  // }

    $('.chatList').html('');
    for (var i=0; i < window.pageSize; i++) {
      var datum = data[i];
      if (datum) {
        var username = $("<span class='username'></span>");
        username.text((datum ? datum.username + ": " : ""));
        var msgtext = $("<span class='msgtext'></span>");
        msgtext.text((datum ? datum.text : ""));
        var newMsg = $("<li class='msg'></li>");
        if (window.friends[datum.username]) {
          newMsg.addClass("friendMessage");
        }
        newMsg.append(username);
        newMsg.append(msgtext);
        if (!window.blocked[datum.username]) { $('.chatList').append(newMsg); }
      }
    }



  $('.currentRoom').text(window.currentRoom);
  var sortedRooms =  _(window.rooms).sortBy(function (room) {
    return room.length;
  }).reverse();
  $('.roomList').html('');
  for (var j = 0; j < sortedRooms.length; j++) {
    var room = $("<li class='room'></li>");
    var roomName = sortedRooms[j][0].roomname;
    $(room).attr("name", roomName); // Add the real name as a class.
    if (roomName && roomName.length > 18) { // Trim the real name for display.
      roomName = roomName.slice(0,18) + "...";
    }
    room.text(roomName);
    $('.roomList').append(room);
  }


  setTimeout(getData,10000);
};

var sendData = function(data) {
  data = JSON.stringify(data);
  $.ajax({
    url: 'http://127.0.0.1:8080/classes/chatterbox',
    // dataType: 'json',
    type: 'POST',
    data: data,
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message ' + data);
    }
  });
};


$(document).on("ready", function() {

  // Global variables.
  window.pageSize = 15;
  window.roomListSize = 5;
  window.currentRoom = "lobby";
  window.friends = {};
  window.blocked = {};

  // Assign all parameters in the URL to global variables.
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    vars[i] = vars[i].split("=");
    window[vars[i][0]] = vars[i][1];
  }


  // JQuery bindings.
  $(document).on('click', '.room', function() {
    window.currentRoom = $(this).attr('name');
  });

  $(document).on('click', '.username', function() {
    var name = $(this).text();
    name = name.slice(0, name.length - 2);
    if (!window.friends[name]) {
      $(".friendList").append("<li class='friend'>" + name + "</li>");
      window.friends[name] = true;
    }
  });

  $(document).on('click', '.friend', function(){
    var name = $(this).text();
    delete window.friends[name];
    $(this).remove();
  });

  $(document).on('click', '.blocked', function(){
    var name = $(this).text();
    delete window.blocked[name];
    $(this).remove();
  });

  $('.roomInput').keyup(function(e) {
    if(e.keyCode == 13) {
      if ($(this).val()) {
        window.currentRoom = $(this).val();
        $(this).val('');
      }
    }
  });

  $('.blockInput').keyup(function(e) {
    if(e.keyCode == 13) {
      var name = $(this).val();
      if (!window.blocked[name]) {
        $(".blockList").append("<li class='blocked'>" + name + "</li>");
        window.blocked[name] = true;
      }
      $(this).val('');
    }
  });

  $('.messageInput').keyup(function(e){
    if(e.keyCode == 13) {
      if ($(this).val()) {
        var message = {
          username: window.username,
          text: $(this).val(),
          room: window.currentRoom
        };
        sendData(message);
        $(this).val('');
      }
    }
  });

  // Page initialization.
  getData();
});

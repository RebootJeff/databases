var Sequelize = require("sequelize");
var sequelize = new Sequelize("chat", "root", "", {
  port: 3306
});

var Room = sequelize.define('room', {
  roomName: Sequelize.STRING
});
var Message = sequelize.define('message', {
  text: Sequelize.STRING
});
var User = sequelize.define('user', {
  username: Sequelize.STRING
});

var Q = require("Q");

var getMessage = function(){
  Message.sync().success(function(){
    var deferred = Q.defer();
    Message.findAll({where: {room_id: 1}}).success(function(messages){
      deferred.resolve(messages);
    });
  });
}
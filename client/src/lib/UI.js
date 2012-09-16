define(['jquery'], function ($) {
  var UI = function () {
  };

  UI.prototype.setScore = function (myScore) {
    $('#score').text(myScore);
  };

  UI.prototype.setConnectionStatus = function (newStatus) {
    $('#connection').text(newStatus);
  };

  return UI;
});

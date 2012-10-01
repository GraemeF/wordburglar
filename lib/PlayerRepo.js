var PlayerRepo = function () {
  this.playersByToken = {};
};

PlayerRepo.prototype.addNew = function (player) {
  this.playersByToken[player.token] = player;
};

PlayerRepo.prototype.findByToken = function (token) {
  return this.playersByToken[token];
};

module.exports = PlayerRepo;
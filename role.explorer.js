var roleExplorer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        console.log(Game.map.describeExits(creep.room.name))
    }
};

module.exports = roleExplorer;
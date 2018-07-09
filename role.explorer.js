var roleExplorer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        console.log(`${creep.name} (${creep.room.name}): ${Game.map.describeExits(creep.room.name)}`)
    }
};

module.exports = roleExplorer;
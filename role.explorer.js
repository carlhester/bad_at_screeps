var roleExplorer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var exits = Game.map.describeExits(creep.room.name)
        console.log(`${creep.name} (${creep.room.name}): ${exits['1']}`)
    }
};

module.exports = roleExplorer;
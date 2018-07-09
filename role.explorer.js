var roleExplorer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.room.name == creep.memory.home) { 
            var exits = Game.map.describeExits(creep.room.name)
            var exit_list = [] 
            if (exits['1']){ 
                creep.moveTo(new RoomPosition(40, 48, exits['1']));
                console.log(`${creep.name} (${creep.room.name}) : Heading to new place`)
            } /** else if (exits['3']){
            } else if (exits['5']){
            } else if (exits['7']){
            } **/
        } 
    }
};

module.exports = roleExplorer;
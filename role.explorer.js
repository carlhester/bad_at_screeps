var roleExplorer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var exits = Game.map.describeExits(creep.room.name)
        if (exits['1']){ 
            console.log(`${creep.name} (${creep.room.name}): ${exits['1']}`)
        } else if (exits['3']){
            console.log(`${creep.name} (${creep.room.name}): ${exits['3']}`)
        } else if (exits['5']){
            console.log(`${creep.name} (${creep.room.name}): ${exits['5']}`)
        } else if (exits['7']){
            console.log(`${creep.name} (${creep.room.name}): ${exits['7']}`)
        }
    }
};

module.exports = roleExplorer;
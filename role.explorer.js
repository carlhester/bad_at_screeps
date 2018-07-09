var roleExplorer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var exits = Game.map.describeExits(creep.room.name)
        if (exits['1']){ 
            console.log(`${creep.name} (${creep.room.name}): U Exit: ${exits['1']}`)
        } else if (exits['3']){
            console.log(`${creep.name} (${creep.room.name}): R Exit ${exits['3']}`)
        } else if (exits['5']){
            console.log(`${creep.name} (${creep.room.name}): D Exit ${exits['5']}`)
        } else if (exits['7']){
            console.log(`${creep.name} (${creep.room.name}): L Exit ${exits['7']}`)
        }
    }
};

module.exports = roleExplorer;
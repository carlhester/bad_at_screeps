var roleExplorer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var exits = Game.map.describeExits(creep.room.name)
        var exit_list = [] 
        if (exits['1']){ 
            exit_list.push(exits['1'])
        } else if (exits['3']){
            exit_list.push(exits['3'])
        } else if (exits['5']){
            exit_list.push(exits['5'])
        } else if (exits['7']){
            exit_list.push(exits['7'])
        }

        console.log(`${creep.name} (${creep.room.name}) : ${exit_list}`)
    }
};

module.exports = roleExplorer;
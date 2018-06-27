var roleHarvester = require('role.harvester');


module.exports.loop = function() {
    //for (creep in Game.creeps) { 
    //    console.log(creep);
    //}
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    for(var name in Game.rooms) {
        console.log('Room "'+name+'" has '+Game.rooms[name].energyAvailable+' energy');
    }

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    console.log('Harvesters: ' + harvesters.length);

    if (harvesters.length < 6) {
        var newName = 'Harvester-' + Game.time;
        result = Game.spawns['CHSpawn'].spawnCreep([WORK, WORK, CARRY, MOVE], newName, { memory: { role: 'harvester' } });
        if (result == 0) { 
            console.log('Spawning new harvester: ' + newName);
        } else { 
            console.log('Spawning Result: ' + result);
        }
    }
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
    }

}
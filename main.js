var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleExplorer = require('role.explorer');
var calcBodyCost = require('calcBodyCost');
var roleBuilder = require('role.builder');
var roleScraper = require('role.scraper');
var roleInvader = require('role.invader');
var roleTower = require('role.tower');

module.exports.loop = function() {

    console.log(`###################################################`);
    // Clear any memory creeps who are not found in the game
    for (var creep_name in Memory.creeps) {
        if (!Game.creeps[creep_name]) {
            delete Memory.creeps[creep_name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    for (var room_name in Game.rooms) {
        var controlLevel = Game.rooms[room_name].controller['level']
        var roomSources = Game.rooms[room_name].find(FIND_SOURCES)
        console.log(`Room ${room_name} has ${Game.rooms[room_name].energyAvailable}/${Game.rooms[room_name].energyCapacityAvailable} energy (in ${roomSources} sources) and level: ${controlLevel}`);
     
        var towers = Game.rooms[room_name].find(FIND_STRUCTURES, { filter: (i) => i.structureType == STRUCTURE_TOWER });   
        if (towers) { 
            roleTower.run(towers) 
        }


        const scraperQuota = 2 * roomSources.length;
        const harvesterQuota = 4 * roomSources.length;
        const builderQuota = 1;
        const upgraderQuota = 0;
        const invaderQuota = 1;
        const explorerQuota = 4 * roomSources.length;

     
        var controlLevel = Game.rooms[room_name].controller['level']
    
        if (controlLevel == 1) {
            var scraperBody = [WORK, WORK, MOVE, MOVE]
            var scraperBodyFallback = [WORK, WORK, MOVE, MOVE]
            var harvesterBody = [WORK, CARRY, MOVE, MOVE, MOVE]
            var harvesterBodyFallback = [WORK, CARRY, MOVE, MOVE, MOVE]
            var explorerBody = [WORK, CARRY, MOVE, MOVE, MOVE]
            var builderBody = [WORK, CARRY, MOVE]
            var upgraderBody = [WORK, CARRY, MOVE, MOVE, MOVE]
            var upgraderBodyFallback = [WORK, CARRY, MOVE, MOVE, MOVE]
        } else {
            var scraperBody = [WORK, WORK, WORK, WORK, WORK, MOVE]
            var scraperBodyFallback = [WORK, WORK, MOVE, MOVE]
            var harvesterBody = [WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
            var harvesterBodyFallback = [WORK, CARRY, MOVE, MOVE, MOVE]
            var explorerBody = [WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
            var builderBody = [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE]
            var upgraderBody = [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]
            var upgraderBodyFallback = [WORK, CARRY, MOVE, MOVE, MOVE]
            var invaderBody = [ATTACK, WORK, WORK, WORK, CLAIM, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]

        }
       
        var scrapers = _.filter(Game.creeps, (creep) => creep.memory.role == 'scraper' && creep.memory.role == Game.rooms[room_name]);
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' && creep.memory.role == Game.rooms[room_name]);
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder' && creep.memory.role == Game.rooms[room_name]);
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader' && creep.memory.role == Game.rooms[room_name]);
        var invaders = _.filter(Game.creeps, (creep) => creep.memory.role == 'invader' && creep.memory.role == Game.rooms[room_name]);
        var explorers = _.filter(Game.creeps, (creep) => creep.memory.role == 'explorer' && creep.memory.role == Game.rooms[room_name]);

        console.log(`${Game.rooms[room_name]} Scrapers: ${scrapers.length}/${scraperQuota}` + 
            `\tHarvesters: ${harvesters.length}/${harvesterQuota}` +  
            `\tBuilders: ${builders.length}/${builderQuota}` +  
            `\tUpgraders: ${upgraders.length}/${upgraderQuota}` +  
            `\tExplorers: ${explorers.length}/${explorerQuota}` +  
            `\tInvaders: ${invaders.length}/${invaderQuota}`);
     
        //var result = Game.spawns['CHSpawn1'].spawnCreep(scraperBodyFallback, Game.time, { memory: { role: 'scraper', harvest_target: 0} });
        //var result = Game.spawns['CHSpawn1'].spawnCreep(harvesterBodyFallback, Game.time, { memory: { role: 'harvester', harvest_target: 0, transfer_target: 0 } });

        roomSpawn = Game.rooms[room_name].find(FIND_MY_SPAWNS)
        console.log(`${Game.rooms[room_name]} spawns ${roomSpawn}`)
        if (scrapers.length < scraperQuota) {
            if (harvesters.length < 2) {
                var bodyArray = scraperBodyFallback;
            } else {
                var bodyArray = scraperBody;
            }

            var harvest_target = roleScraper.getNextTarget(scrapers)

            var newName = 'Scraper-' + harvest_target + '-' + Game.time;
            var result = Game.spawns[roomSpawn].spawnCreep( bodyArray, newName, { memory: { role: 'scraper', home: Game.rooms[room_name], harvest_target: harvest_target } });

            var bodyCost = calcBodyCost.calc(bodyArray);
            if (result == 0) {
                console.log('Spawning new scraper(' + bodyCost + '): ' + newName);
            } else {
                console.log('Scraper Spawn Result(' + bodyCost + '): ' + result);
            }
        } else if (harvesters.length < harvesterQuota) {
            if (harvesters.length < 2) {
                var bodyArray = harvesterBodyFallback;
            } else {
                var bodyArray = harvesterBody;
            }

            var bodyCost = calcBodyCost.calc(bodyArray);
            var newName = 'Harvester' + Game.time;
            var result = Game.spawns[roomSpawn].spawnCreep(bodyArray, newName, { memory: { role: 'harvester', home: Game.rooms[room_name], collecting: true, harvest_target: 0, transfer_target: 0 } });
            if (result == 0) {
                console.log('Spawning new harvester(' + bodyCost + '): ' + newName);
            } else {
                console.log('Harvester Spawn Result(' + bodyCost + '): ' + result);
            }
        } else if (builders.length < builderQuota) {
            var newName = 'Builder' + Game.time;
            var bodyArray = builderBody;
            var bodyCost = calcBodyCost.calc(bodyArray);
            var result = Game.spawns[roomSpawn].spawnCreep(bodyArray, newName, { memory: { role: 'builder', home: Game.rooms[room_name] } });
            if (result == 0) {
                console.log('Spawning new builder(' + bodyCost + '): ' + newName);
            } else {
                console.log('Builder Spawn Result(' + bodyCost + '): ' + result);
            }
        } else if (upgraders.length < upgraderQuota) {
            if (upgraders.length < 2) {
                var bodyArray = upgraderBodyFallback;
            } else {
                var bodyArray = upgraderBody;
            }
            var bodyCost = calcBodyCost.calc(bodyArray);
            var newName = 'Upgrader' + Game.time;
            var result = Game.spawns[roomSpawn].spawnCreep(bodyArray, newName, { memory: { role: 'upgrader', home: Game.rooms[room_name] } });
            if (result == 0) {
                console.log('Spawning new upgrader(' + bodyCost + '): ' + newName);
            } else {
                console.log('Upgrader Spawn Result(' + bodyCost + '): ' + result);
            }
        } else if ((invaders.length < invaderQuota) && (controlLevel > 1)) {
            var newName = 'Invader' + Game.time;
            var bodyArray = invaderBody;
            var bodyCost = calcBodyCost.calc(bodyArray)
            var result = Game.spawns[roomSpawn].spawnCreep(bodyArray, newName, { memory: { role: 'invader', home: Game.rooms[room_name], building: false } });
            if (result == 0) {
                console.log('Spawning new invader(' + bodyCost + '): ' + newName);
            } else {
                console.log('Invader Spawn Result(' + bodyCost + '): ' + result);
            }
        } else if (explorers.length < explorerQuota) {
            var newName = 'Explorer-' + Game.time;
            var bodyArray = explorerBody;
            var bodyCost = calcBodyCost.calc(bodyArray);
            var result = Game.spawns[roomSpawn].spawnCreep(bodyArray, newName, { memory: { role: 'explorer', home: Game.rooms[room_name], harvesting: true } });
            if (result == 0) {
                console.log('Spawning new explorer(' + bodyCost + '): ' + newName);
            } else {
                console.log('Explorer Spawn Result(' + bodyCost + '): ' + result);
            }
        }
    }

    for (var creep_name in Game.creeps) {
        var creep = Game.creeps[creep_name];
        if ((creep.ticksToLivenumber < 2) && (creep.carry.energy > 0)) {
            creep.drop(RESOURCE_ENERGY);
        }

        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep, harvesters.length);
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if (creep.memory.role == 'invader') {
            roleInvader.run(creep);
        }
        if (creep.memory.role == 'scraper') {
            roleScraper.run(creep);
        }
        if (creep.memory.role == 'explorer') {
            roleExplorer.run(creep);
        }
    }
  
}

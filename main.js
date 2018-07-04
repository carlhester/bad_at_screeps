var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleScraper = require('role.scraper');
var roleInvader = require('role.invader');
var calcBodyCost = require('calcBodyCost');

module.exports.loop = function() {

    for (var name in Game.rooms) {
        var controlLevel = Game.rooms[name].controller['level']
        console.log('Room "' + name + '" has ' + Game.rooms[name].energyAvailable + '/' + Game.rooms[name].energyCapacityAvailable + ' energy' +
            ' and level: ' + controlLevel);
    }

    var controlLevel = Game.rooms['W37N57'].controller['level']


    var tower = Game.getObjectById('TOWER_ID');
    if (tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if (closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
        }
    }

    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }


    if (controlLevel == 1) {
        var scraperBody = [WORK, WORK, MOVE, MOVE]
        var scraperBodyFallback = [WORK, WORK, MOVE, MOVE]
        var harvesterBody = [WORK, CARRY, MOVE, MOVE, MOVE]
        var harvesterBodyFallback = [WORK, CARRY, MOVE, MOVE, MOVE]
        var builderBody = [WORK, CARRY, MOVE]
        var upgraderBody = [WORK, CARRY, MOVE, MOVE, MOVE]
        var upgraderBodyFallback = [WORK, CARRY, MOVE, MOVE, MOVE]
    } else {
        var scraperBody = [WORK, WORK, WORK, WORK, WORK, MOVE]
        var scraperBodyFallback = [WORK, WORK, MOVE, MOVE]
        var harvesterBody = [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
        var harvesterBodyFallback = [WORK, CARRY, MOVE, MOVE, MOVE]
        var builderBody = [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE]
        var upgraderBody = [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]
        var upgraderBodyFallback = [WORK, CARRY, MOVE, MOVE, MOVE]
        var invaderBody = [TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE]

    }
    /** else if (controlLevel == 3) { 
        var scraperBody = [WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE]
        var scraperBodyFallback = [WORK, WORK, MOVE, MOVE]
        var harvesterBody = [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
        var harvesterBodyFallback = [WORK, CARRY, MOVE, MOVE, MOVE]
        var builderBody = [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
        var upgraderBody = [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE]
        var upgraderBodyFallback = [WORK, CARRY, MOVE, MOVE, MOVE]
    } 
    **/

    const scraperQuota = 4;
    const harvesterQuota = 10;
    const builderQuota = 2;
    const upgraderQuota = 0;
    const invaderQuota = 0;

    var scrapers = _.filter(Game.creeps, (creep) => creep.memory.role == 'scraper');
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var invaders = _.filter(Game.creeps, (creep) => creep.memory.role == 'invader');

    console.log('Scrapers: ${scrapers.length}/${scraperQuota}' + 
        '\tHarvesters: ${harvesters.length}/${harvesterQuota}' +  
        '\tBuilders: ${builders.length}/${builderQuota}' +  
        '\tUpgraders: ${upgraders.length}/${upgraderQuota}' +  
        '\tInvaders: ${invaders.length}/${invaderQuota}');


    if (scrapers.length < scraperQuota) {
        if (scrapers.length < 2) {
            var bodyArray = scraperBodyFallback;
        } else {
            var bodyArray = scraperBody;
        }

        var harvest_target = roleScraper.getNextTarget(scrapers)

        var newName = 'Scraper-' + harvest_target + '-' + Game.time;
        var result = Game.spawns['CHSpawn'].spawnCreep(
            bodyArray,
            newName, {
                memory: {
                    role: 'scraper',
                    harvest_target: harvest_target
                }
            }
        );

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
        var result = Game.spawns['CHSpawn'].spawnCreep(bodyArray, newName, { memory: { role: 'harvester', harvest_target: 0, transfer_target: 0 } });
        if (result == 0) {
            console.log('Spawning new harvester(' + bodyCost + '): ' + newName);
        } else {
            console.log('Harvester Spawn Result(' + bodyCost + '): ' + result);
        }
    } else if (builders.length < builderQuota) {
        var newName = 'Builder' + Game.time;
        var bodyArray = builderBody;
        var bodyCost = calcBodyCost.calc(bodyArray);
        var result = Game.spawns['CHSpawn'].spawnCreep(bodyArray, newName, { memory: { role: 'builder' } });
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
        var result = Game.spawns['CHSpawn'].spawnCreep(bodyArray, newName, { memory: { role: 'upgrader' } });
        if (result == 0) {
            console.log('Spawning new upgrader(' + bodyCost + '): ' + newName);
        } else {
            console.log('Upgrader Spawn Result(' + bodyCost + '): ' + result);
        }
    } else if ((invaders.length < invaderQuota) && (controlLevel > 1)) {
        var newName = 'Invader' + Game.time;
        var bodyArray = invaderBody;
        var bodyCost = calcBodyCost.calc(bodyArray)
        var result = Game.spawns['CHSpawn'].spawnCreep(bodyArray, newName, { memory: { role: 'invader' } });
        if (result == 0) {
            console.log('Spawning new invader(' + bodyCost + '): ' + newName);
        } else {
            console.log('Invader Spawn Result(' + bodyCost + '): ' + result);
        }
    }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if ((creep.ticksToLivenumber < 2) && (creep.carry.energy > 0)) {
            creep.drop(RESOURCE_ENERGY);
        }

        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
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
    }
}
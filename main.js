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

    for (var name in Game.rooms) {
        var controlLevel = Game.rooms[name].controller['level']
        console.log(`Room ${name} has ${Game.rooms[name].energyAvailable}/${Game.rooms[name].energyCapacityAvailable} energy and level: ${controlLevel}`);
    
    
        var towers = Game.rooms[name].find(FIND_STRUCTURES, { filter: (i) => i.structureType == STRUCTURE_TOWER });   
        roleTower.run(towers) 
    } 
    
    var controlLevel = Game.rooms['W37N57'].controller['level']


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

    const scraperQuota = 4;
    const harvesterQuota = 8;
    const builderQuota = 1;
    const upgraderQuota = 0;
    const invaderQuota = 2;
    const explorerQuota = 8;

    var scrapers = _.filter(Game.creeps, (creep) => creep.memory.role == 'scraper');
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var invaders = _.filter(Game.creeps, (creep) => creep.memory.role == 'invader');
    var explorers = _.filter(Game.creeps, (creep) => creep.memory.role == 'explorer');

    console.log(`Scrapers: ${scrapers.length}/${scraperQuota}` + 
        `\tHarvesters: ${harvesters.length}/${harvesterQuota}` +  
        `\tBuilders: ${builders.length}/${builderQuota}` +  
        `\tUpgraders: ${upgraders.length}/${upgraderQuota}` +  
        `\tExplorers: ${explorers.length}/${explorerQuota}` +  
        `\tInvaders: ${invaders.length}/${invaderQuota}`);


    if (scrapers.length < scraperQuota) {
        if (harvesters.length < 2) {
            var bodyArray = scraperBodyFallback;
        } else {
            var bodyArray = scraperBody;
        }

        var harvest_target = roleScraper.getNextTarget(scrapers)

        var newName = 'Scraper-' + harvest_target + '-' + Game.time;
        var result = Game.spawns['CHSpawn1'].spawnCreep(scraperBodyFallback, Game.time, {memory: {role: 'scraper', harvest_target: 0 } } );
        var result = game.spawns['chspawn'].spawncreep(bodyarray, newname, {memory: {role: 'scraper', harvest_target: harvest_target } } );

        var bodycost = calcbodycost.calc(bodyarray);
        if (result == 0) {
            console.log('spawning new scraper(' + bodycost + '): ' + newname);
        } else {
            console.log('scraper spawn result(' + bodycost + '): ' + result);
        }
    } else if (harvesters.length < harvesterquota) {
        if (harvesters.length < 2) {
            var bodyarray = harvesterbodyfallback;
        } else {
            var bodyarray = harvesterbody;
        }

        var bodycost = calcbodycost.calc(bodyarray);
        var newname = 'harvester' + game.time;
        var result = game.spawns['chspawn1'].spawncreep(harvesterbodyfallback, game.time, { memory: { role: 'harvester', harvest_target: 0, transfer_target: 0 } });
        var result = game.spawns['chspawn'].spawncreep(bodyarray, newname, { memory: { role: 'harvester', harvest_target: 0, transfer_target: 0 } });
        if (result == 0) {
            console.log('spawning new harvester(' + bodycost + '): ' + newname);
        } else {
            console.log('harvester spawn result(' + bodycost + '): ' + result);
        }
    } else if (builders.length < builderquota) {
        var newname = 'builder' + game.time;
        var bodyarray = builderbody;
        var bodycost = calcbodycost.calc(bodyarray);
        var result = game.spawns['chspawn'].spawncreep(bodyarray, newname, { memory: { role: 'builder' } });
        if (result == 0) {
            console.log('spawning new builder(' + bodycost + '): ' + newname);
        } else {
            console.log('builder spawn result(' + bodycost + '): ' + result);
        }
    } else if (upgraders.length < upgraderquota) {
        if (upgraders.length < 2) {
            var bodyarray = upgraderbodyfallback;
        } else {
            var bodyarray = upgraderbody;
        }
        var bodycost = calcbodycost.calc(bodyarray);
        var newname = 'upgrader' + game.time;
        var result = game.spawns['chspawn'].spawncreep(bodyarray, newname, { memory: { role: 'upgrader' } });
        if (result == 0) {
            console.log('spawning new upgrader(' + bodycost + '): ' + newname);
        } else {
            console.log('upgrader spawn result(' + bodycost + '): ' + result);
        }
    } else if ((invaders.length < invaderquota) && (controllevel > 1)) {
        var newname = 'invader' + game.time;
        var bodyarray = invaderbody;
        var bodycost = calcbodycost.calc(bodyarray)
        var result = game.spawns['chspawn'].spawncreep(bodyarray, newname, { memory: { role: 'invader', building: false } });
        if (result == 0) {
            console.log('spawning new invader(' + bodycost + '): ' + newname);
        } else {
            console.log('invader spawn result(' + bodycost + '): ' + result);
        }
    } else if (explorers.length < explorerquota) {
        var newname = 'explorer-' + game.time;
        var bodyarray = explorerbody;
        var bodycost = calcbodycost.calc(bodyarray);
        var result = game.spawns['chspawn'].spawncreep(bodyarray, newname, { memory: { role: 'explorer', home: 'w37n57', harvesting: true } });
        if (result == 0) {
            console.log('spawning new explorer(' + bodycost + '): ' + newname);
        } else {
            console.log('explorer spawn result(' + bodycost + '): ' + result);
        }
    }

    for (var name in game.creeps) {
        var creep = game.creeps[name];
        if ((creep.tickstolivenumber < 2) && (creep.carry.energy > 0)) {
            creep.drop(resource_energy);
        }

        if (creep.memory.role == 'harvester') {
            roleharvester.run(creep, harvesters.length);
        }
        if (creep.memory.role == 'upgrader') {
            roleupgrader.run(creep);
        }
        if (creep.memory.role == 'builder') {
            rolebuilder.run(creep);
        }
        if (creep.memory.role == 'invader') {
            roleinvader.run(creep);
        }
        if (creep.memory.role == 'scraper') {
            rolescraper.run(creep);
        }
        if (creep.memory.role == 'explorer') {
            roleexplorer.run(creep);
        }
    }
}

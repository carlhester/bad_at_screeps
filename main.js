var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleScraper = require('role.scraper');
var calcBodyCost = require('calcBodyCost')

module.exports.loop = function() {
    for(var name in Game.rooms) {
        console.log('Room "'+name+'" has '+Game.rooms[name].energyAvailable+'/'+Game.rooms[name].energyCapacityAvailable + ' energy');
    }

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

    var controlLevel = Game.rooms['W37N57'].controller['level']
   
    if (controlLevel == 1) {  
        const scraperBody = [WORK, WORK, MOVE, MOVE]
        const scraperBodyFallback = [WORK, WORK, MOVE, MOVE]
        const harvesterBody = [WORK, CARRY, MOVE, MOVE, MOVE]
        const harvesterBodyFallback = [WORK, CARRY, MOVE, MOVE, MOVE]
        const builderBody = [WORK, CARRY, MOVE]
        const upgraderBody= [WORK, CARRY, MOVE, MOVE, MOVE]
        const upgraderBodyFallback = [WORK, CARRY, MOVE, MOVE, MOVE]
    } else {  
        const scraperBody = [WORK, WORK, WORK, WORK, WORK, MOVE]
        const scraperBodyFallback = [WORK, WORK, MOVE, MOVE]
        const harvesterBody = [WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE]
        const harvesterBodyFallback = [WORK, CARRY, MOVE, MOVE, MOVE]
        const builderBody = [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE]
        const upgraderBody = [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
        const upgraderBodyFallback = [WORK, CARRY, MOVE, MOVE, MOVE]
    } 


    const scraperQuota= 6;
    const harvesterQuota = 6; 
    const builderQuota = 2;
    const upgraderQuota = 6;
    
    var scrapers = _.filter(Game.creeps, (creep) => creep.memory.role == 'scraper');
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');

    console.log('Scrapers: ' + scrapers.length + '/' + scraperQuota + 
        '\tHarvesters: ' + harvesters.length +  '/' + harvesterQuota + 
        '\tBuilders: ' + builders.length +  '/' + builderQuota + 
        '\tUpgraders: ' + upgraders.length + '/' + upgraderQuota);


    if (scrapers.length < scraperQuota) {
        if (scrapers.length < 2) { 
            var bodyArray = scraperBodyFallback;
        } else { 
            var bodyArray = scraperBody;
        } 
        var bodyCost = calcBodyCost.calc(bodyArray);
        
        var newName = 'Scraper' + Game.time;
        var result = Game.spawns['CHSpawn'].spawnCreep(bodyArray, newName, { memory: { role: 'scraper', harvest_target: 0 } });
        if (result == 0) {
            console.log('Spawning new scraper: ' + newName);
        } else {
            console.log('Scraper Spawn Result(' + bodyCost + '): ' + result)
        }
    }

    else if (harvesters.length < harvesterQuota) {
        if (harvesters.length < 2) { 
            var bodyArray = harvesterBodyFallback;
        } else { 
            var bodyArray = harvesterBody;
        } 

        var bodyCost = calcBodyCost.calc(bodyArray);
        var newName = 'Harvester' + Game.time;
        var result = Game.spawns['CHSpawn'].spawnCreep(bodyArray, newName, { memory: { role: 'harvester', harvest_target: 0, transfer_target: 0 } });
        if (result == 0) {
            console.log('Spawning new harvester: ' + newName);
        } else {
            console.log('Harvester Spawn Result(' + bodyCost + '): ' + result)
        }
    }

    else if (builders.length < builderQuota) {
        var newName = 'Builder' + Game.time;
        var bodyArray = builderBody; 
        var bodyCost = calcBodyCost.calc(bodyArray);
        var result = Game.spawns['CHSpawn'].spawnCreep(bodyArray, newName, { memory: { role: 'builder' } });
        if (result == 0) {
            console.log('Spawning new builder: ' + newName);
        } else {
            console.log('Builder Spawn Result(' + bodyCost + '): ' + result)
        }
    }

    else if (upgraders.length < upgraderQuota) {
        if (upgraders.length < 2) { 
            var bodyArray = upgraderBodyFallback;
        } else { 
            var bodyArray = upgraderBody;
        }  
        var bodyCost = calcBodyCost.calc(bodyArray);
        var newName = 'Upgrader' + Game.time;
        var result = Game.spawns['CHSpawn'].spawnCreep(bodyArray, newName, { memory: { role: 'upgrader' } });
        if (result == 0) {
            console.log('Spawning new upgrader: ' + newName);
        } else {
            console.log('Upgrader Spawn Result(' + bodyCost + '): '  + result)
        }
    }
    var scrape_counter = 0; 

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if (creep.memory.role == 'scraper') {
            scrape_counter += 1;
            if (scrape_counter % 2 == 0) {
                creep.memory.harvest_target = 1;
            } else {
                creep.memory.harvest_target = 0;
            }
            roleScraper.run(creep, creep.memory.harvest_target);
            //creep.say(creep.memory.harvest_target);

        }
    }
}

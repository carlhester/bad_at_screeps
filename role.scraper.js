var roleScraper = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var sources = creep.room.find(FIND_SOURCES);
        if (creep.harvest(sources[creep.memory.harvest_target]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[creep.memory.harvest_target], { visualizePathStyle: { stroke: '#ffaa00' } });
        }
    };

    getNextTarget: function(scrapers) {
        var scraper0_count = 0
        var scraper1_count = 0

        for (var scraper in scrapers) {
            if (scrapers[scraper].memory.harvest_target == 0) {
                scraper0_count += 1
            } else {
                scraper1_count += 1
            }

        }

        if (scraper0_count < scraper1_count) {
            return 1;
        } else {
            return 0;
        }
    }

};

module.exports = roleScraper;
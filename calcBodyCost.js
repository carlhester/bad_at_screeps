var calcBodyCost = {

    /** @param {Creep} creep **/
    calc: function(bodyArray) {
        bodyCost = 0;
        for (bodyPart in bodyArray) {
            if (bodyArray[bodyPart] == MOVE) { 
                bodyCost += 50;
            } else if (bodyArray[bodyPart] == CARRY) { 
                bodyCost += 50;
            } else if (bodyArray[bodyPart] == WORK) { 
                bodyCost += 100
            }


        }
        console.log('BodyCost: ' + bodyCost)

    }
};

module.exports = calcBodyCost;
var types = require('types');
var creep_types = types.creep_types;


//Get list of spawners able to create desired creep
var get_spawner = function(body, index) {
    if (typeof(index) === 'undefined') index = 0;
    var available_spawners = []
    for (var i in Game.spawns) {
        if (!Game.spawns[i].spawning && Game.spawns[i].canCreateCreep(body, null) == OK) {
            available_spawners.push(Game.spawns[i]);
        }
    }
    return available_spawners[index]
}

//Get list of existing creeps
var get_creeps = function() {
    var creep_counts = {}
    for (var index in creep_types) {
        var ctype = creep_types[index];
        creep_counts[ctype.role_name] = 0;
    }
    for (var creep in Game.creeps) {
        if (creep_counts[Game.creeps[creep].memory.role]) {
            creep_counts[Game.creeps[creep].memory.role] += 1;
        } else {
            creep_counts[Game.creeps[creep].memory.role] = 1;
        }
    }
    return creep_counts
}

//Manage colony population to config spec
var overseer = function() {

    var creep_counts = get_creeps()
    for (var index in creep_types) {
        var ctype = creep_types[index];
        if (ctype.enable) {
            if (creep_counts[ctype.role_name] < ctype.target_count) {
                var spawner = get_spawner(ctype.body);
                if (spawner) {
                    spawner.createCreep(ctype.body, ctype.role_name + Game.time, {
                        role: ctype.role_name
                    });
                    console.log("Overseer: Spawning a new " + ctype.role_name)
                    break;
                } else {
                    break;
                }
            }
        }
    }
}

exports.overseer = overseer;
exports.get_creeps = get_creeps;
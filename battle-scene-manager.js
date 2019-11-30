// Manages the scene for a battle between two geese in the world
// and applies the proper animation when they attack
class Battle_Scene_Manager {
    constructor() {
        this.battle_ongoing = false;
    }

    // Sets the states for calling a menu transform
    // Assumes the menu manager and camera manager have been setup.
    initiate_battle_sequence(attacking_goose, defending_goose, menu_manager, camera_manager) {
        this.menu_manager = menu_manager;
        this.camera_manager = camera_manager;
        this.atk_goose = attacking_goose;
        this.def_goose = defending_goose;
        this.actions = []; // Contains ids for what type of animation is going to be played
        this.battle_ongoing = true;
        this.generate_battle_results();  // Queue up the results of the battle
        // State variables
        this.queued_action = {goose: attacking_goose, action: "camera zoom in"};
    }

    animate_battle(camera_transform) {
        if (!this.queued_action) {
            // Pull the next action in queue if no action is queued
            this.queued_action = this.actions.shift();
        }

        if (this.queued_action.action == "attack") {
            this.queued_action.goose.state.animating = true;
            this.queued_action.goose.attack();
            if (this.queued_action.goose.state.animating == false) {
                this.queued_action = undefined;
            }
        } else if (this.queued_action.action == "dead") {
            console.log("dead");
            this.battle_ongoing = false;
        } else if (this.queued_action.action == "camera zoom in") {
            // Initial setup
            if (!this.camera_manager.animating) {
                const distance_offset = 20;
                const height_offset = 5;
                this.camera_manager.change_animation(1);
                this.camera_manager.set_original_camera_transform(camera_transform);
                // The location should be the midpoint between the two goose locations
                let atk_goose_world_pos = calculate_world_pos_from_tile(this.atk_goose.tile_position.x, this.atk_goose.tile_position.z, 10, 10);
                let def_goose_world_pos = calculate_world_pos_from_tile(this.def_goose.tile_position.x, this.def_goose.tile_position.z, 10, 10);
                let position_offset = Vec.of(0,0,1).times(distance_offset).plus(Vec.of(0,height_offset,0));
                let midpoint = atk_goose_world_pos.plus(def_goose_world_pos).times(0.5).plus(position_offset);
                this.camera_manager.set_battle_camera_location (midpoint, Vec.of(0,0,1), 30);
            }
            this.camera_manager.animating = true;
            camera_transform = this.camera_manager.play_animation();
            if (!this.camera_manager.animating ) {
                this.queued_action = undefined;
            }
        } else if (this.queued_action.action == "camera zoom out") {
            // Initial setup
            if (!this.camera_manager.animating) {
                this.camera_manager.change_animation(2);
                this.camera_manager.battle_camera_transform = camera_transform;
            }
            this.camera_manager.animating = true;
            camera_transform = this.camera_manager.play_animation();
            if (!this.camera_manager.animating ) {
                this.queued_action = undefined;
            }
        }

        // If nothing is left in queue, then it is done
        if (!this.queued_action && this.actions.length == 0) {
            this.battle_ongoing = false;
        }
        return camera_transform;
    }

    // For battles, the attacking goose attacks first
    // and the opposing enemy attacks in retaliation if they are still alive afterwards.
    generate_battle_results() {
        let atk_goose_stats = this.atk_goose.stats;
        let def_goose_stats = this.def_goose.stats;
        
        this.actions.push({goose: this.atk_goose, action: "attack"});
        let def_goose_rem_health = def_goose_stats.health - atk_goose_stats.attack;
        if (def_goose_rem_health < 0) {
            this.actions.push({goose: this.def_goose, action: "dead"});
            this.actions.push({goose: this.atk_goose, action: "camera zoom out"});
            return;
        }
        def_goose_stats.health = def_goose_rem_health;

        // Defending goose now retaliates
        this.actions.push({goose: this.def_goose, action: "attack"});
        let atk_goose_rem_health = atk_goose_stats.health - def_goose_stats.attack;
        if (atk_goose_rem_health < 0) {
            this.actions.push({goose: this.def_goose, action: "dead"});
            this.actions.push({goose: this.atk_goose, action: "camera zoom out"});
            return;
        }
        this.actions.push({goose: this.atk_goose, action: "camera zoom out"});
    }
}
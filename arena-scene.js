window.Arena_Scene = window.classes.Arena_Scene =
class Arena_Scene extends Scene_Component { 

  constructor(context, control_box) {     // The scene begins by requesting the camera, shapes, and materials it will need.
    super(context, control_box );    // First, include a secondary Scene that provides movement controls:
    if(!context.globals.has_controls) 
      context.register_scene_component(new Movement_Controls_Arena( context, control_box.parentElement.insertCell())); 

    context.globals.graphics_state.camera_transform = Mat4.look_at( Vec.of( 100, 90, 20), Vec.of( 100,0,-70 ), Vec.of( 0,1,0 ) );
    this.initial_camera_location = Mat4.inverse( context.globals.graphics_state.camera_transform );
    context.canvas.addEventListener( "mousemove", e => { e.preventDefault();
        this.handle_mouse_movement(calculate_click_ray_2(e, context.globals.graphics_state.camera_transform, context.globals.graphics_state.projection_transform, context.canvas)); } );
    // Add a canvas listener for picking and variables to go with it
    this.click_ray = undefined;  // Contains the ray used for picking
    this.clicked_tile = undefined;  // Contains a structure for what tile the user has clicked.
    this.selected_unit = undefined;  // If the user selected a goose, this keeps track of the selected goose
    context.canvas.addEventListener( "mousedown", e => { e.preventDefault();
       this.handle_mouse_click(calculate_click_ray_2(e, context.globals.graphics_state.camera_transform, context.globals.graphics_state.projection_transform, context.canvas)); } );

    const r = context.width/context.height;
    context.globals.graphics_state.projection_transform = Mat4.perspective( Math.PI/4, r, .1, 1000 );
    this.tile_generator = new Tile_Generator(context);
    const shapes = {
                         body_sample: new Body(),
                         leg_sample : new Rounded_Capped_Cylinder(12, 12, .2, 2.5, [0,1]),
                         beak_sample: new Rounded_Cone(12, 12, 1, 2, Math.PI, [0,1]),
                         wing_sample: new Wing(),
                         head_sample: new Subdivision_Sphere( 3 ),
                         neck_sample: new Rounded_Capped_Cylinder(12, 12, .6, 4, [0,1]),
                         eye_sample : new Rounded_Capped_Cylinder(12, 12, .2, .1, [0,1]),
                         foot_sample: new Foot(),
                         eyebrow_sample: new Cube(),
                         arena: new Arena(this.tile_generator.map, 10, 10),
                         menu_quad: new Square(),
                         text_line: new Text_Line(7),
                         text_menu_line: new Text_Line(15),
                   }
                
    // instantiate geese
    this.geese = {

      // red team geese
      r1: new Honk(0,6,3,1),
      r2: new Honk(2,9,14,1),
      r3: new Honk(4,10,14,1),
      r4: new Honk(6,13,3,1),
      r5: new Lonk(8,6,2,1),
      r6: new Lonk(10,13,2,1),
      r7: new Chonk(12,7,2,1),
      r8: new Chonk(14,12,2,1),
      r9: new Stronk(16,8,2,1),
      r10: new Stronk(18,11,2,1),
      r11: new Monk(20,9,2,1),
      r12: new Sonk(22,10,2,1),

      // blue team geese
      b1: new Honk(1,6,16,3),
      b2: new Honk(3,9,16,3),
      b3: new Honk(5,10,16,3),
      b4: new Honk(7,13,16,3),
      b5: new Lonk(9,6,17,3),
      b6: new Lonk(11,13,17,3),
      b7: new Chonk(13,7,17,3),
      b8: new Chonk(15,12,17,3),
      b9: new Stronk(17,8,17,3),
      b10: new Stronk(19,11,17,3),
      b11: new Monk(21,10,17,3),
      b12: new Sonk(23,9,17,3),
    }

    // add all shapes used by geese to shapes
    for (let g in this.geese) {
      for (let shape in this.geese[g].shapes) {
        shapes[shape] = this.geese[g].shapes[shape];
      }
    }

    this.submit_shapes( context, shapes);
    this.context = context.gl;
    this.canvas = context.canvas;

    // setup game
    this.turn = 'red';
    this.movesLeft = Object.keys(this.geese).length/2;



    this.fb_texture = new Texture(context.gl, "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", true ); 

    this.materials =
      { white:     context.get_instance( Phong_Shader ).material( Color.of( 1,1,1,1 ), { ambient:.5 } ),
        black:     context.get_instance( Phong_Shader ).material( Color.of( 0,0,0,1 ), { ambient:.5 } ),
        orange:    context.get_instance( Phong_Shader ).material( Color.of( 1,.7,.4,1 ), { ambient:.5 } ),
        red:       context.get_instance( Phong_Shader ).material( Color.of( 1,0,0,1 ), {ambient: .5} ),
        pink:      context.get_instance( Phong_Shader ).material( Color.of( 1,.4,.4,1 ), {ambient: .5} ),
        blue:       context.get_instance( Phong_Shader ).material( Color.of( 0,0,1,1 ), {ambient: .5} ),
        green:     context.get_instance( Phong_Shader ).material( Color.of(.2,.5,.2,1 ), {ambient: 0.5} ),
        gold:      context.get_instance( Phong_Shader ).material( Color.of(.7,.4,.2,1), {ambient: .5}),
        gray:      context.get_instance( Phong_Shader ).material( Color.of(.5,.5,.5,1), {ambient: .5}),
        red:       context.get_instance( Phong_Shader ).material( Color.of( 1,0,0,1 ), {ambient: .5} ),
        text_image: context.get_instance( Phong_Shader ).material( Color.of(0,0,0,1),
          {ambient: 1, diffusivity: 0, specularity: 0, texture: context.get_instance("assets/text.png", true)}),
        menu_image: context.get_instance( Phong_Shader ).material( Color.of(1,1,0,1), {ambient: 1, diffusivity: 0, specularity: 0}),  // Material for menu objects
        marker_tile: context.get_instance( Phong_Shader ).material( Color.of(0,0,0,0.8), {ambient: 1, diffusivity: 0, specularity: 0, texture: context.get_instance("assets/marker_tile.png", true)}),
        move_tile: context.get_instance( Phong_Shader ).material( Color.of(0,0,0,0.5), {ambient: 1, diffusivity: 0, specularity: 0, texture: context.get_instance("assets/move_tile.png", true)}),
        attack_tile: context.get_instance( Phong_Shader ).material( Color.of(0,0,0,0.5), {ambient: 1, diffusivity: 0, specularity: 0, texture: context.get_instance("assets/attack_tile.png", true)}),
        radial_blur_material: context.get_instance(Radial_Blur_Shader).material(Color.of(0,0,0,1), {ambient: 1, texture: this.fb_texture}),
        simple: { shader: context.get_instance(Simple_Shader) },
        radial_simple: {shader: context.get_instance(Radial_Blur_Shader_Multi)},
        negative_material: {shader: context.get_instance(Negative_Shader)},
      }

    {
    this.lights = [ new Light( Vec.of( 50,100,-50,1 ), Color.of( 1, 1, 1, 1 ), 10**4 ) ];
    this.arena_transform = Mat4.scale([100,1,100]).times(Mat4.rotation(Math.PI / 2, Vec.of(1,0,0)));
    this.marker_tile_def_transform = Mat4.translation([0,0.1,0]).times(Mat4.scale([5,0,5]).times(Mat4.rotation(Math.PI/2, Vec.of(-1,0,0))));
    this.marker_tile_world_transform = this.marker_tile_def_transform;   
    this.screen_quad_transform = Mat4.translation([0,0,-0.1]).times(Mat4.scale([0.075,.042,1]));

    this.camera_animations_manager = new Camera_Animations_Manager();
    this.menu_manager = new Menu_Manager([], this.shapes.menu_quad, this.shapes.text_line, this.materials.text_image);
    this.battle_scene_manager = new Battle_Scene_Manager();
    this.enable_multi = false;
    this.setup_trigger = 0;
    this.disable_marker_tile = false;
    this.marker_tile_select = undefined;
    this.current_animating_monk_shader = false;
    }
  }

  make_control_panel() {           // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements. 
  this.result_img = this.control_panel.appendChild( Object.assign( document.createElement( "img" ), 
  { style:"width:200px; height:" + 200 * this.aspect_ratio + "px" } ) );  
  this.key_triggered_button("End turn", ["e"], () => this.movesLeft = 0);
  this.key_triggered_button("Disable/Enable multipass", ["4"], () => this.enable_multi = !this.enable_multi);
  this.key_triggered_button("Disable/Enable camera animation default", ["1"], () => this.setup_trigger = 1)
  }

  // Handles intersection with arena and calculates area to place cursor
  handle_mouse_movement(mouse_ray) {
    if (this.disable_marker_tile) {
      this.marker_tile_select = undefined;
      this.forecast = undefined;
      return;
    }
    const width = 10, length = 10;
    // Assume the arena is always at 0,0,0
    // And tiles are arranges such that the center of tile 1 is at [5,5,0]
    let tiles = this.calculate_ray_tile_intersection(mouse_ray, width, length);
    let tile_positions = calculate_world_pos_from_tile(tiles.x, tiles.z, width, length);
    this.marker_tile_select = tiles;
    let translation = Mat4.translation([tile_positions[0] , 0.1, tile_positions[2]]);
    this.marker_tile_world_transform = translation.times(this.marker_tile_def_transform);
  }

  // Handles when the user clicks somewhere on the world
  handle_mouse_click(mouse_ray) {
    if (this.disable_marker_tile) return;
    const width = 10, length = 10;
    // TODO: Collisions against the menu items should override any other collisions.
    let tiles = this.calculate_ray_tile_intersection(mouse_ray, width, length);
    if (!this.moving)
      this.clicked_tile = tiles;
    this.click_ray = mouse_ray;
  }

  calculate_ray_tile_intersection(mouse_ray, width, length) {
    // If the ray is perpendicular to the plane, then there is no intersection
    let plane_normal = Vec.of(0,1,0);
    if (Math.abs(mouse_ray.direction.dot(plane_normal)) < Number.EPSILON) return false;
    let t =
        Vec.of(0,0,0).minus(mouse_ray.origin).dot(plane_normal) / mouse_ray.direction.dot(plane_normal);
    if (t < 0.0 - Number.EPSILON) return false;
    let intersection = mouse_ray.direction.times(t).plus(mouse_ray.origin);
    // Calculate where the marker should be placed assuming its size is 5x5 in xz plane
    let num_tile_x = Math.floor(intersection[0] / width) ;
    let num_tile_z = Math.floor(-intersection[2] / length);
    return {x: num_tile_x, z: num_tile_z};
  }

  display( graphics_state ) { 
    graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
    const t = graphics_state.animation_time / 1000, dt = graphics_state.animation_delta_time / 1000;
    // Animate battle scene
    // if (this.setup_trigger == 1) {
    //   this.battle_scene_manager.initiate_battle_sequence(this.geese['g1'], this.geese['g2'], this.menu_manager, this.camera_animations_manager);
    //   this.setup_trigger = 0;
    // }

    // remove dead geese
    
    for (let g in this.geese) {
      if (this.geese[g].stats.health < 0) {
        delete(this.geese[g]);
      }
    }
    

    // next player's turn
    if (this.movesLeft == 0) {
      // TODO: flip camera
      this.turn = this.turn == 'blue' ? 'red' : 'blue';
      // Rotate to the respective side
      if (this.turn == 'blue') {
        graphics_state.camera_transform = Mat4.look_at( Vec.of( 100, 90, -220), Vec.of( 100,0,-130 ), Vec.of( 0,1,0 ) );
      } else {
        graphics_state.camera_transform = Mat4.look_at( Vec.of( 100, 90, 20), Vec.of( 100,0,-70 ), Vec.of( 0,1,0 ) );
      }

      if (this.turn == 'red') {
        for (let g in this.geese)
          if (g[0] == "r") {
            this.geese[g].state.hasMoved = false;
            this.movesLeft++;
          }
      }

      if (this.turn == 'blue') {
        for (let g in this.geese)
          if (g[0] == "b") {
            this.geese[g].state.hasMoved = false;
            this.movesLeft++;
          }
      }

      this.selected_unit = undefined;
      this.last_selected_unit = undefined;
      this.forecast = undefined;
    }

    for (let g in this.geese) {
        for (let shape in this.geese[g].shapes) {  
          this.shapes[shape].draw(graphics_state,
            this.geese[g].temp_translation_transform.times(
            Mat4.translation([this.geese[g].translation.x, 0, this.geese[g].translation.z]).times(this.geese[g].temp_scale_transform.times(this.geese[g].transforms[shape]))), this.materials[this.geese[g].colors[shape]]);
        }
    }

    // Check for selected units
    if (this.click_ray && !this.moving) {
      // Check for collision against the menus first
      let collisions = (this.menu_manager.menus_length != 0) ? this.menu_manager.check_collisions(this.click_ray) : [];

      if (collisions.length != 0) {
        // Do stuff for that menu item
        if (collisions[0] == "attack") {
          this.attack_positions = generate_attack_tile_locations(this.last_selected_unit.stats, this.last_selected_unit.tile_position.x, this.last_selected_unit.tile_position.z, 10, 10 );
          
          this.menu_manager.clear_menus(true);

          let menu_transform = Mat4.translation([0.02,-0.00,-0.11]).times(Mat4.scale([0.008, 0.004, 1]));
          let text_transform = Mat4.translation([-0.65,0,0.001]).times(Mat4.scale([0.145,0.5,1]));
          let menu_obj = {menu_transform: menu_transform, menu_material: this.materials.menu_image, tag: "return", text: "Return", text_transform: text_transform,  clickable: true};
          this.menu_manager.add_menu(menu_obj);
        }
        else if (collisions[0] == "wait") {
          this.last_selected_unit.prev.x = this.last_selected_unit.tile_position.x;
          this.last_selected_unit.prev.z = this.last_selected_unit.tile_position.z;
          this.last_selected_unit.prev.orientation = this.last_selected_unit.state.orientation;
          this.menu_manager.clear_menus(true);
          this.movesLeft--;
        }
        else if (collisions[0] == "back") {
          let displacement = calculate_world_pos_from_tile(this.last_selected_unit.prev.x - this.last_selected_unit.tile_position.x-1,
                                                           this.last_selected_unit.prev.z - this.last_selected_unit.tile_position.z-1,
                                                           10, 10);
          displacement[0] += 5;
          displacement[2] -= 5;         
          this.last_selected_unit.translation.x += displacement[0]; 
          this.last_selected_unit.translation.z += displacement[2];    
          this.last_selected_unit.tile_position.x = this.last_selected_unit.prev.x;
          this.last_selected_unit.tile_position.z = this.last_selected_unit.prev.z;
          this.last_selected_unit.rotate_goose(this.last_selected_unit.state.orientation, this.last_selected_unit.prev.orientation);
          this.last_selected_unit.state.orientation = this.last_selected_unit.prev.orientation;
          this.last_selected_unit.state.hasMoved = false;
          this.menu_manager.clear_menus(true);
        }
        else if (collisions[0] == "return") {
          this.menu_manager.clear_menus(true);
          this.attack_positions = undefined;

          // Activate the menu items
          let menu_transform_1 =Mat4.translation([0.02,0.02,-0.11]).times(Mat4.scale([0.008, 0.004, 1]));
          let text_transform_1 = Mat4.translation([-0.57,0,0.001]).times(Mat4.scale([0.15,0.5,1]));
          // Only display attack if there is a enemy in range : assume 1 for now
          let menu_obj = {menu_transform: menu_transform_1, menu_material: this.materials.menu_image, tag: "attack", text: "Attack", text_transform: text_transform_1,  clickable: true};
          let menu_transform_2 =Mat4.translation([0.02,0.01,-0.11]).times(Mat4.scale([0.008, 0.004, 1]));
          let text_transform_2 = Mat4.translation([-0.49,-0.1,0.001]).times(Mat4.scale([0.15,0.5,1]));
          let menu_obj_2 = {menu_transform: menu_transform_2, menu_material: this.materials.menu_image, tag: "wait", text: "Wait", text_transform: text_transform_2,  clickable: true};
          let menu_transform_3 = Mat4.translation([0.02,-0.00,-0.11]).times(Mat4.scale([0.008, 0.004, 1]));
          let text_transform_3 = Mat4.translation([-0.65,0,0.001]).times(Mat4.scale([0.145,0.5,1]));
          let menu_obj_3 = {menu_transform: menu_transform_3, menu_material: this.materials.menu_image, tag: "back", text: "Go Back", text_transform: text_transform_3,  clickable: true};
          this.menu_manager.add_menu(menu_obj);
          this.menu_manager.add_menu(menu_obj_2);
          this.menu_manager.add_menu(menu_obj_3);
        }

      } 
      else if (this.menu_manager.menus_length <= 1) {
        // Check for geese at that position

        for (let g in this.geese) {          
          if (this.geese[g].tile_position.x == this.clicked_tile.x &&
              this.geese[g].tile_position.z == this.clicked_tile.z) {
              this.selected_unit = this.geese[g];
              break;
          }
        }

        // If no geese were selected, then clear menu
        // if (!this.selected_unit) {
        //   this.menu_manager.clear_menus(true);
        // }
      }
      this.click_ray = undefined;
    }
    // Check for a movement tile at that position
    if (this.move_positions) {
      for (let tile_index in this.move_positions) {
        let tile = this.move_positions[tile_index];
        if (tile[0] < 0 || tile[0] > 195 || tile[2] < -195 || tile[2] > 0)
          continue;
        if (tile[0] == this.clicked_tile.x * 10 + 5 && -tile[2] == this.clicked_tile.z * 10 + 5) {      
          this.moving = true;
        }
      }
      this.move_positions = undefined;
    }

    // Draw movement tiles if unit is selected and it is not in attacking
    if (this.selected_unit && !this.selected_unit.state.hasMoved && !this.moving && !this.attack_positions && !this.battle_scene_manager.battle_ongoing && this.selected_unit.getTeam() == this.turn) {
      if (!this.move_positions) {
        this.move_positions = [];
        this.cellToPath = {};

        generate_move_tiles_locations(this.selected_unit, this.move_positions, "", this.cellToPath, this.selected_unit.stats.movement_range + 1, this.tile_generator.map, this.geese, this.selected_unit.tile_position.x, this.selected_unit.tile_position.z, 10, 10);
        
        // add to move in place
        this.move_positions.push(calculate_world_pos_from_tile(this.selected_unit.tile_position.x, this.selected_unit.tile_position.z, 10, 10));
        this.cellToPath[this.selected_unit.tile_position.x + " " + this.selected_unit.tile_position.z] = "";
        this.clicked_tile.x = undefined;
        this.clicked_tile.z = undefined;
      }
      for (let tile_index in this.move_positions) {
        let tile = this.move_positions[tile_index];
        this.shapes.menu_quad.draw(graphics_state, Mat4.translation([tile[0], 0.05, tile[2]]).times(this.marker_tile_def_transform), this.materials.move_tile);
      }
    }

    // Draw attack tiles if they are defined
    if (this.attack_positions) {
      if (this.last_selected_unit) {
        for (let tile_index in this.attack_positions.positions) {
          let tile = this.attack_positions.positions[tile_index];
  
          this.shapes.menu_quad.draw(graphics_state, Mat4.translation([tile[0], 0.05, tile[2]]).times(this.marker_tile_def_transform), this.materials.attack_tile);
        }
        if (!this.selected_unit && this.marker_tile_select) {
          for (let g in this.geese) {
            let tile_pos = this.geese[g].tile_position;
            let manhattan_distance = Math.abs(this.geese[g].tile_position.x - this.last_selected_unit.tile_position.x)
            + Math.abs(this.geese[g].tile_position.z - this.last_selected_unit.tile_position.z);
            if (this.geese[g] != this.last_selected_unit && tile_pos.x == this.marker_tile_select.x &&
               tile_pos.z == this.marker_tile_select.z && manhattan_distance <= this.last_selected_unit.stats.attack_range &&
               this.geese[g].getTeam() != this.last_selected_unit.getTeam()) {
              // Display battle forecast
              let position = calculate_world_pos_from_tile(tile_pos.x, tile_pos.z, 10, 10).plus(Vec.of(0,25,0));
              let menu_1_material = (this.geese[g].getTeam() == 'blue') ? this.materials.red.override({ambient: 1, diffusivity: 0, specularity: 0}) : this.materials.blue.override({ambient: 1, diffusivity: 0, specularity: 0});
              let menu_2_material = (this.geese[g].getTeam() ==  'blue') ? this.materials.blue.override({ambient: 1, diffusivity: 0, specularity: 0}) : this.materials.red.override({ambient: 1, diffusivity: 0, specularity: 0}); 
              this.forecast = new Battle_Forecast(this.shapes.menu_quad, this.shapes.text_menu_line,
                {menu_1: menu_1_material,
                 menu_2: menu_2_material,
                 text: this.materials.text_image,
                 bar_front: this.materials.red,
                 bar_back: this.materials.gray}, graphics_state.camera_transform, position, 18, 23, this.last_selected_unit, this.geese[g], this.turn);
                 break;
            } else {
              this.forecast = undefined;
            }
          }
        }
        // If we selected ourself do nothing otherwise initialize the battle animation
        // if they are within range
        if (this.selected_unit != this.last_selected_unit && this.selected_unit && this.last_selected_unit && this.selected_unit.getTeam() != this.last_selected_unit.getTeam()) {
          for (let tile_index in this.attack_positions.tiles) {
            let tile = this.attack_positions.tiles[tile_index];
            this.menu_manager.clear_menus(true);

            if (tile[0] == this.selected_unit.tile_position.x && tile[1] == this.selected_unit.tile_position.z) {
              this.last_selected_unit.prev.x = this.last_selected_unit.tile_position.x;
              this.last_selected_unit.prev.z = this.last_selected_unit.tile_position.z;
              this.last_selected_unit.prev.orientation = this.last_selected_unit.state.orientation;
              this.movesLeft--;

              this.battle_scene_manager.initiate_battle_sequence(this.last_selected_unit, this.selected_unit, this.menu_manager, this.camera_animations_manager, this.turn);
              this.attack_positions = undefined;
              this.disable_marker_tile = true;
              break;
            }
          }
        }
      }
    }

    if (this.battle_scene_manager.battle_ongoing) {
      graphics_state.camera_transform = this.battle_scene_manager.animate_battle(graphics_state, this.context);
      // If it finishes this frame, reset the selected and last selected
      if (!this.battle_scene_manager.battle_ongoing) {
        this.selected_unit = undefined;
        this.last_selected_unit = undefined;
      }
    } 
    else {
      this.disable_marker_tile = false;
    }

    // See if moving
    if (this.moving) {
      // Disable camera movement
      graphics_state.disable_camera_movement = true;
      if (!this.selected_unit.move(this.cellToPath[this.clicked_tile.x + " " + this.clicked_tile.z])) {
        this.selected_unit.state.hasMoved = true;
        this.selected_unit.tile_position.x = this.clicked_tile.x;
        this.selected_unit.tile_position.z = this.clicked_tile.z;
        this.clicked_tile.x = undefined;
        this.clicked_tile.z = undefined;
        this.last_selected_unit = this.selected_unit;
        this.selected_unit = undefined;
        this.move_positions = undefined;
        this.cellToPath = undefined;
        this.moving = undefined;

        // // Activate the menu items
        let menu_transform_1 =Mat4.translation([0.02,0.02,-0.11]).times(Mat4.scale([0.008, 0.004, 1]));
        let text_transform_1 = Mat4.translation([-0.57,0,0.001]).times(Mat4.scale([0.15,0.5,1]));
        // Only display attack if there is a enemy in range : assume 1 for now
        let menu_obj = {menu_transform: menu_transform_1, menu_material: this.materials.menu_image, tag: "attack", text: "Attack", text_transform: text_transform_1,  clickable: true};
        let menu_transform_2 =Mat4.translation([0.02,0.01,-0.11]).times(Mat4.scale([0.008, 0.004, 1]));
        let text_transform_2 = Mat4.translation([-0.49,-0.1,0.001]).times(Mat4.scale([0.15,0.5,1]));
        let menu_obj_2 = {menu_transform: menu_transform_2, menu_material: this.materials.menu_image, tag: "wait", text: "Wait", text_transform: text_transform_2,  clickable: true};
        let menu_transform_3 = Mat4.translation([0.02,-0.00,-0.11]).times(Mat4.scale([0.008, 0.004, 1]));
        let text_transform_3 = Mat4.translation([-0.65,0,0.001]).times(Mat4.scale([0.145,0.5,1]));
        let menu_obj_3 = {menu_transform: menu_transform_3, menu_material: this.materials.menu_image, tag: "back", text: "Go Back", text_transform: text_transform_3,  clickable: true};
        this.menu_manager.add_menu(menu_obj);
        this.menu_manager.add_menu(menu_obj_2);
        this.menu_manager.add_menu(menu_obj_3);
        graphics_state.disable_camera_movement = false;
      }
    }

    // Generate the movement and attack tiles and display them if a unit has been selected
    // Draw arena
    this.tile_generator.render_tiles(this.shapes.arena, graphics_state);
    if (!this.disable_marker_tile)
      this.shapes.menu_quad.draw(graphics_state, this.marker_tile_world_transform, this.materials.marker_tile);

    // Render the menus
    if (this.menu_manager.menus_length != 0) {
      this.menu_manager.update_transforms(graphics_state.camera_transform);
      this.menu_manager.draw_menus(graphics_state, this.context);
    }

    if (this.forecast) {
      this.forecast.update_transform(graphics_state.camera_transform);
      this.forecast.render(graphics_state, this.context);
    }
    // Multipass rendering options
    if (this.camera_animations_manager.animating) {
      this.enable_multi = true;
      graphics_state.multipass.material = this.materials.radial_simple;
    } 
    else 
      this.enable_multi = false;
    
    // Check to see if a monk is currently animating
    let found_animating_monk = false;
    for (let g in this.geese) {
      if (this.geese[g].constructor.name == "Monk" && this.geese[g].animate_shader) {
        this.enable_multi = true;
        if (!this.current_animating_monk_shader)
          this.materials.negative_material.shader.initial_animation_time = graphics_state.animation_time;
        graphics_state.multipass.material = this.materials.negative_material;
        this.current_animating_monk_shader = true;
        found_animating_monk = true;
        break; 
      } else {
        this.enable_multi = false;
      }
    }
    if (!found_animating_monk) {
      this.current_animating_monk_shader = false;
    }

    graphics_state.multipass.enabled = this.enable_multi;
    graphics_state.multipass.shape = this.shapes.menu_quad;
    // this.shapes.menu_quad.draw(graphics_state, final_transform, this.materials.radial_blur_material);
  }
}

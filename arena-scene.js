window.Arena_Scene = window.classes.Arena_Scene =
class Arena_Scene extends Scene_Component { 

  constructor(context, control_box) {     // The scene begins by requesting the camera, shapes, and materials it will need.
    super(context, control_box );    // First, include a secondary Scene that provides movement controls:
    if(!context.globals.has_controls) 
      context.register_scene_component(new Movement_Controls_Arena( context, control_box.parentElement.insertCell())); 

    context.globals.graphics_state.camera_transform = Mat4.look_at( Vec.of( 0,90,90 ), Vec.of( 0,0,0 ), Vec.of( 0,1,0 ) );
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
                         arena: new Square(),
                         menu_quad: new Square(),
                         text_line: new Text_Line(50),
                   }
    // instantiate geese
    this.geese = {
      g1: new Honk(1),
      // g2: new Goose(2),
      // g3: new Goose(3),
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
    this.materials =
      { white:     context.get_instance( Phong_Shader ).material( Color.of( 1,1,1,1 ), { ambient:.5 } ),
        black:     context.get_instance( Phong_Shader ).material( Color.of( 0,0,0,1 ), { ambient:.5 } ),
        orange:    context.get_instance( Phong_Shader ).material( Color.of( 1,.7,.4,1 ), { ambient:.5 } ),
        green:     context.get_instance( Phong_Shader ).material( Color.of(.2,.5,.2,1 ), {ambient: 0.5} ),
        text_image: context.get_instance( Phong_Shader ).material( Color.of(0,0,0,1),
          {ambient: 1, diffusivity: 0, specularity: 0, texture: context.get_instance("assets/text.png", true)}),
        menu_image: context.get_instance( Phong_Shader ).material( Color.of(1,1,0,1), {ambient: 1, diffusivity: 0, specularity: 0}),  // Material for menu objects
        marker_tile: context.get_instance( Phong_Shader ).material( Color.of(0,0,0,0.8), {ambient: 1, diffusivity: 0, specularity: 0, texture: context.get_instance("assets/marker_tile.png", true)}),
        move_tile: context.get_instance( Phong_Shader ).material( Color.of(0,0,0,0.5), {ambient: 1, diffusivity: 0, specularity: 0, texture: context.get_instance("assets/move_tile.png", true)}),
        attack_tile: context.get_instance( Phong_Shader ).material( Color.of(0,0,0,0.5), {ambient: 1, diffusivity: 0, specularity: 0, texture: context.get_instance("assets/attack_tile.png", true)}),
      }

      // this.lights = [ new Light( Vec.of( 10,-15,10,1 ), Color.of( 1, 1, 1, 1 ), 100000 ) ];
      this.lights = [ new Light( Vec.of( 0,0,5,1 ), Color.of( 0, 1, 1, 1 ), 1000 ) ];
      this.arena_transform = Mat4.scale([100,1,100]).times(Mat4.rotation(Math.PI / 2, Vec.of(1,0,0)));
      this.marker_tile_def_transform = Mat4.translation([0,0.1,0]).times(Mat4.scale([5,0,5]).times(Mat4.rotation(Math.PI/2, Vec.of(-1,0,0))));
      this.marker_tile_world_transform = this.marker_tile_def_transform;
  }

  make_control_panel() {           // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements. 
  }

  // Handles intersection with arena and calculates area to place cursor
  handle_mouse_movement(mouse_ray) {
    const width = 10, length = 10;
    // Assume the arena is always at 0,0,0
    // And tiles are arranges such that the center of tile 1 is at [5,5,0]
    let tiles = this.calculate_ray_tile_intersection(mouse_ray, width, length);
    let tile_positions = calculate_world_pos_from_tile(tiles.x, tiles.z, width, length);
    let translation = Mat4.translation([tile_positions[0] , 0.1, tile_positions[2]]);
    this.marker_tile_world_transform = translation.times(this.marker_tile_def_transform);
  }

  // Handles when the user clicks somewhere on the world
  handle_mouse_click(mouse_ray) {
    const width = 10, length = 10;
    // TODO: Collisions against the menu items should override any other collisions.
    let tiles = this.calculate_ray_tile_intersection(mouse_ray, width, length);
    this.clicked_tile = tiles;
    this.click_ray = mouse_ray;
    // TODO: Maybe move collision with geese here?
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
    let num_tile_z = Math.floor(intersection[2] / length);
    return {x: num_tile_x, z: num_tile_z};
  }

  display( graphics_state ) { 
    graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
    const t = graphics_state.animation_time / 1000, dt = graphics_state.animation_delta_time / 1000;
    for (let g in this.geese) {
        // if(this.geese[g].state.animating) {
        //   this.geese[g].attack();
        // }
        for (let shape in this.geese[g].shapes) {
          // this.shapes[shape].draw(graphics_state, Mat4.rotation(-Math.PI / 2, Vec.of(0,1,0)).times(this.geese[g].transforms[shape]), this.materials[this.geese[g].colors[shape]]);
          let world_offset = calculate_world_pos_from_tile(this.geese[g].tile_position.x,this.geese[g].tile_position.z,10,10); 
          this.shapes[shape].draw(graphics_state, Mat4.translation([4.25 + world_offset[0],9.35,world_offset[2]]).times(this.geese[g].transforms[shape]), this.materials[this.geese[g].colors[shape]]);
        }
    }

    // Check for selected units
    if (this.click_ray) {
        // Check for geese at that position
        for (let g in this.geese) {
            if (this.geese[g].tile_position.x == this.clicked_tile.x &&
                this.geese[g].tile_position.z == this.clicked_tile.z) {
                this.selected_unit = this.geese[g];
                break;
            }
            this.selected_unit = undefined;
        }
        this.click_ray = undefined;
    }
    // Generate the movement and attack tiles and display them if a unit has been selected
    if (this.selected_unit) {
        let positions_obj = generate_action_tiles_locations(this.selected_unit.stats, this.selected_unit.tile_position.x, this.selected_unit.tile_position.z, 10, 10);
        let move_positions = positions_obj.mv_pos;
        let attack_positions = positions_obj.at_pos;
        for (let tile_index in move_positions) {
            let tile = move_positions[tile_index];
            this.shapes.menu_quad.draw(graphics_state, Mat4.translation([tile[0], 0.05, tile[2]]).times(this.marker_tile_def_transform), this.materials.move_tile);
        }
        for (let tile_index in attack_positions) {
            let tile = attack_positions[tile_index];
            this.shapes.menu_quad.draw(graphics_state, Mat4.translation([tile[0], 0.05, tile[2]]).times(this.marker_tile_def_transform), this.materials.attack_tile);
        }
    }
    // Draw arena
    this.shapes.arena.draw(graphics_state, Mat4.translation([ 0, 0, 0]).times(this.arena_transform), this.materials.green);
    this.shapes.menu_quad.draw(graphics_state, this.marker_tile_world_transform, this.materials.marker_tile);

  }
}


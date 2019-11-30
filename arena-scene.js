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
                         text_line: new Text_Line(2),
                   }
                
    // instantiate geese
    this.geese = {
      g1: new Chonk(1,5,3,3),
      g2: new Honk(2,6,4,1),
      g3: new Sonk(3,7,9,1),
      g4: new Stronk(4,3,3,2),
      g5: new Lonk(5,2,2,3),
      
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
        // Initialize for multi-pass rendering gotten from the Encyclopedia of Code
    this.scratchpad = document.createElement('canvas');
    // A hidden canvas for re-sizing the real canvas:
    this.scratchpad_context = this.scratchpad.getContext('2d');
    this.scratchpad.width   = 1024;
    this.scratchpad.height  = 512;
    this.fb_texture = new Texture(context.gl, "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", true ); 

    this.materials =
      { white:     context.get_instance( Phong_Shader ).material( Color.of( 1,1,1,1 ), { ambient:.5 } ),
        black:     context.get_instance( Phong_Shader ).material( Color.of( 0,0,0,1 ), { ambient:.5 } ),
        orange:    context.get_instance( Phong_Shader ).material( Color.of( 1,.7,.4,1 ), { ambient:.5 } ),
        green:     context.get_instance( Phong_Shader ).material( Color.of(.2,.5,.2,1 ), {ambient: 0.5} ),
        gold:      context.get_instance( Phong_Shader ).material( Color.of(.7,.4,.2,1), {ambient: .5}),
        gray:      context.get_instance( Phong_Shader ).material( Color.of(.5,.5,.5,1), {ambient: .5}),
        text_image: context.get_instance( Phong_Shader ).material( Color.of(0,0,0,1),
          {ambient: 1, diffusivity: 0, specularity: 0, texture: context.get_instance("assets/text.png", true)}),
        menu_image: context.get_instance( Phong_Shader ).material( Color.of(1,1,0,1), {ambient: 1, diffusivity: 0, specularity: 0}),  // Material for menu objects
        marker_tile: context.get_instance( Phong_Shader ).material( Color.of(0,0,0,0.8), {ambient: 1, diffusivity: 0, specularity: 0, texture: context.get_instance("assets/marker_tile.png", true)}),
        move_tile: context.get_instance( Phong_Shader ).material( Color.of(0,0,0,0.5), {ambient: 1, diffusivity: 0, specularity: 0, texture: context.get_instance("assets/move_tile.png", true)}),
        attack_tile: context.get_instance( Phong_Shader ).material( Color.of(0,0,0,0.5), {ambient: 1, diffusivity: 0, specularity: 0, texture: context.get_instance("assets/attack_tile.png", true)}),
        radial_blur_material: context.get_instance(Radial_Blur_Shader).material(Color.of(0,0,0,1), {ambient: 1, texture: this.fb_texture}),
        simple: { shader: context.get_instance(Simple_Shader) },
        radial_simple: {shader: context.get_instance(Radial_Blur_Shader_Multi)}
      }

    // this.lights = [ new Light( Vec.of( 10,-15,10,1 ), Color.of( 1, 1, 1, 1 ), 100000 ) ];
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
  }

  make_control_panel() {           // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements. 
  this.result_img = this.control_panel.appendChild( Object.assign( document.createElement( "img" ), 
  { style:"width:200px; height:" + 200 * this.aspect_ratio + "px" } ) );  
  this.key_triggered_button("Disable/Enable multipass", ["4"], () => this.enable_multi = !this.enable_multi);
  this.key_triggered_button("Disable/Enable camera animation default", ["1"], () => this.setup_trigger = 1)
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
    let num_tile_z = Math.floor(-intersection[2] / length);
    return {x: num_tile_x, z: num_tile_z};
  }

  display( graphics_state ) { 
    graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
    const t = graphics_state.animation_time / 1000, dt = graphics_state.animation_delta_time / 1000;
    // Animate battle scene
    if (this.setup_trigger == 1) {
      this.battle_scene_manager.initiate_battle_sequence(this.geese['g1'], this.geese['g2'], this.menu_manager, this.camera_animations_manager);
      this.setup_trigger = 0;
    }

    if (this.battle_scene_manager.battle_ongoing) {
      graphics_state.camera_transform = this.battle_scene_manager.animate_battle(graphics_state, this.context);
    }

    for (let g in this.geese) {
        for (let shape in this.geese[g].shapes) {
          this.shapes[shape].draw(graphics_state, this.geese[g].transforms[shape], this.materials[this.geese[g].colors[shape]]);
        }
    }

    // Check for selected units
    if (this.click_ray && !this.moving) {
      // Check for geese at that position
      for (let g in this.geese) {
          if (this.geese[g].tile_position.x == this.clicked_tile.x &&
              this.geese[g].tile_position.z == this.clicked_tile.z) {
              this.selected_unit = this.geese[g];
              break;
          }
      }
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

    // Draw movement tiles if unit is selected
    if (this.selected_unit && !this.moving) {
      if (!this.move_positions) {
        this.move_positions = [];
        this.cellToPath = {};
        generate_move_tiles_locations(this.selected_unit, this.move_positions, "", this.cellToPath, this.selected_unit.stats.movement_range + 1, this.tile_generator.map, this.geese, this.selected_unit.tile_position.x, this.selected_unit.tile_position.z, 10, 10);
      }
      for (let tile_index in this.move_positions) {
        let tile = this.move_positions[tile_index];

        this.shapes.menu_quad.draw(graphics_state, Mat4.translation([tile[0], 0.05, tile[2]]).times(this.marker_tile_def_transform), this.materials.move_tile);
      }

      // TODO: draw attack tiles

      // for (let tile_index in attack_positions) {
      //   let tile = attack_positions[tile_index];
      //   if (tile[0] < 0 || tile[0] > 195 || tile[2] < -195 || tile[2] > 0)
      //     continue;

      //   if (tile[0] + " " + -tile[2] in this.obstacles)
      //     continue;

      //   this.shapes.menu_quad.draw(graphics_state, Mat4.translation([tile[0], 0.05, tile[2]]).times(this.marker_tile_def_transform), this.materials.attack_tile);
      // }
    }

    // See if moving
    if (this.moving) {
      if (!this.selected_unit.move(this.cellToPath[this.clicked_tile.x + " " + this.clicked_tile.z])) {
        this.selected_unit.tile_position.x = this.clicked_tile.x;
        this.selected_unit.tile_position.z = this.clicked_tile.z;
        this.clicked_tile.x = undefined;
        this.clicked_tile.z = undefined;
        this.selected_unit = undefined;
        this.move_positions = undefined;
        this.cellToPath = undefined;
        this.moving = undefined;
      }
    }

    // Generate the movement and attack tiles and display them if a unit has been selected
    // Draw arena
    this.tile_generator.render_tiles(this.shapes.arena, graphics_state);
    this.shapes.menu_quad.draw(graphics_state, this.marker_tile_world_transform, this.materials.marker_tile);

    // Multipass rendering options
    if (this.camera_animations_manager.animating)
      this.enable_multi = true;
    else 
      this.enable_multi = false;

    graphics_state.multipass.enabled = this.enable_multi;
    graphics_state.multipass.shape = this.shapes.menu_quad;
    graphics_state.multipass.material = this.materials.radial_simple; 
    // this.shapes.menu_quad.draw(graphics_state, final_transform, this.materials.radial_blur_material);
  }
}


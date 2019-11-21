window.Game_Scene = window.classes.Game_Scene =
class Game_Scene extends Scene_Component { 

  constructor(context, control_box) {     // The scene begins by requesting the camera, shapes, and materials it will need.
    super(context, control_box );    // First, include a secondary Scene that provides movement controls:
    if(!context.globals.has_controls) 
      context.register_scene_component(new Movement_Controls( context, control_box.parentElement.insertCell())); 

    context.globals.graphics_state.camera_transform = Mat4.look_at( Vec.of( 0,5,10 ), Vec.of( 0,0,0 ), Vec.of( 0,1,0 ) );
    this.initial_camera_location = Mat4.inverse( context.globals.graphics_state.camera_transform );

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
                         arena: new Square()
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

    this.materials =
      { white:     context.get_instance( Phong_Shader ).material( Color.of( 1,1,1,1 ), { ambient:.5 } ),
        black:     context.get_instance( Phong_Shader ).material( Color.of( 0,0,0,1 ), { ambient:.5 } ),
        orange:    context.get_instance( Phong_Shader ).material( Color.of( 1,.7,.4,1 ), { ambient:.5 } ),
        green:     context.get_instance( Phong_Shader ).material( Color.of(.2,.5,.2,1 ), {ambient: 0.5} ),

      }

      // this.lights = [ new Light( Vec.of( 10,-15,10,1 ), Color.of( 1, 1, 1, 1 ), 100000 ) ];
      this.lights = [ new Light( Vec.of( 0,0,5,1 ), Color.of( 0, 1, 1, 1 ), 1000 ) ];
      this.arena_transform = Mat4.scale([30,1,30]).times(Mat4.rotation(Math.PI / 2, Vec.of(1,0,0)));
      
      // This setup trigger to activate camera zoom in whenever in the game.
      // TODO: Remove the trigger once the battle system is setup.
      this.setup_trigger = 0;
      this.camera_animation_manager = new Camera_Animations_Manager();
  }

  make_control_panel() {           // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements. 
    this.key_triggered_button("Flap em", ["q"], () => this.geese['g1'].state.animating = !this.geese['g1'].state.animating);
    this.key_triggered_button("Camera and action!", ["2"], () => this.setup_trigger = 1);
    this.key_triggered_button("Reverse camera to original pos", ["1"], () => this.setup_trigger = 2);
  }

  display( graphics_state ) { 
    graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
    const t = graphics_state.animation_time / 1000, dt = graphics_state.animation_delta_time / 1000;

    // console.log("t: " + t + " dt: " + dt);
    this.geese['g1'].state.animating = true;
    for (let g in this.geese) {
      if(this.geese[g].state.animating) {
        this.geese[g].attack();
      }
      for (let shape in this.geese[g].shapes) {
        // this.shapes[shape].draw(graphics_state, Mat4.rotation(-Math.PI / 2, Vec.of(0,1,0)).times(this.geese[g].transforms[shape]), this.materials[this.geese[g].colors[shape]]);
        this.shapes[shape].draw(graphics_state, this.geese[g].transforms[shape], this.materials[this.geese[g].colors[shape]]);

      }
    }
    if (this.setup_trigger == 1) {
      this.camera_animation_manager.change_animation(1);
      // Setup necessary parameters
      this.camera_animation_manager.original_camera_transform = graphics_state.camera_transform;
      this.camera_animation_manager.set_battle_camera_location(Vec.of(10,-5,0), Vec.of(-1,0,0));
      this.setup_trigger = 0;
    } else if (this.setup_trigger == 2) {
      this.camera_animation_manager.change_animation(2);
      this.camera_animation_manager.battle_camera_transform = graphics_state.camera_transform;
      this.setup_trigger = 0;
    }
    if (this.camera_animation_manager.animation_type != 0) {
      graphics_state.camera_transform = this.camera_animation_manager.play_animation();
    }
    // Draw arena
    this.shapes.arena.draw(graphics_state, Mat4.translation([ 0, -9.25, 0]).times(this.arena_transform), this.materials.green);
    
  }
}


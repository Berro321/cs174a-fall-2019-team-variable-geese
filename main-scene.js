window.Game_Scene = window.classes.Game_Scene =
class Game_Scene extends Scene_Component { 

  constructor(context, control_box) {     // The scene begins by requesting the camera, shapes, and materials it will need.
    super(context, control_box );    // First, include a secondary Scene that provides movement controls:
    if(!context.globals.has_controls) 
      context.register_scene_component(new Movement_Controls( context, control_box.parentElement.insertCell())); 

    context.globals.graphics_state.camera_transform = Mat4.look_at( Vec.of( 0,10,20 ), Vec.of( 0,0,0 ), Vec.of( 0,1,0 ) );
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
                   }
    
    // instantiate geese
    this.geese = {
      g1: new Goose(1),
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
        orange:     context.get_instance( Phong_Shader ).material( Color.of( 1,.7,.4,1 ), { ambient:.5 } ),

      }

      // this.lights = [ new Light( Vec.of( 10,-15,10,1 ), Color.of( 1, 1, 1, 1 ), 100000 ) ];
      this.lights = [ new Light( Vec.of( 0,0,5,1 ), Color.of( 0, 1, 1, 1 ), 1000 ) ];
  }

  make_control_panel() {           // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements. 
    this.key_triggered_button("Flap em", ["q"], () => this.animate = !this.animate);
  }

  display( graphics_state ) { 
    graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
    const t = graphics_state.animation_time / 1000, dt = graphics_state.animation_delta_time / 1000;

    // console.log("t: " + t + " dt: " + dt);
    let h = 0;
    for (let g in this.geese) {
      if(this.geese[g].state.animating) {
        this.geese[g].moveOneCell();
      }
      for (let shape in this.geese[g].shapes) {
        this.shapes[shape].draw(graphics_state, Mat4.translation([h, 0, h]).times(this.geese[g].transforms[shape]), this.materials[this.geese[g].colors[shape]]);
      }

      h += 10;
    }

  }
}


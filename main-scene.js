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
                         foot_sample: new Foot()
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

      this.lights = [ new Light( Vec.of( 10,-15,10,1 ), Color.of( 1, 1, 1, 1 ), 100000 ) ];
  }

  make_control_panel() {           // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements. 

  }

  display( graphics_state ) { 
    graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
    const t = graphics_state.animation_time / 1000, dt = graphics_state.animation_delta_time / 1000;

    /*
    let h = 0;
    for (let g in this.geese) {
      let i = 0;
      this.geese[g].animateMove(t%10);
      for (let shape in this.geese[g].shapes) {
        if (h == 0)
          this.shapes[shape].draw(graphics_state, this.geese[g].transforms[shape].times(Mat4.translation([i, 0, 0])), this.materials.test);
        if (h == 1)
          this.shapes[shape].draw(graphics_state, this.geese[g].transforms[shape].times(Mat4.translation([0, i, 0])), this.materials.test);
        if (h == 2)
          this.shapes[shape].draw(graphics_state, this.geese[g].transforms[shape].times(Mat4.translation([0, 0, i])), this.materials.test);
          i++;
      }
      h++;
    }
    */
    

    /* For Beak Motion */
    //this.shapes.beak_sample.draw(graphics_state, Mat4.rotation(-0.2*(1+Math.sin(5*Math.PI*t)), Vec.of(1,0,0)), this.materials.test);
    //this.shapes.beak_sample.draw(graphics_state, Mat4.rotation(Math.PI, Vec.of(0,0,1)).times(Mat4.rotation(-0.2*(1+Math.sin(5*Math.PI*t)), Vec.of(1,0,0))), this.materials.test);
    
    this.shapes.head_sample.draw( graphics_state, Mat4.identity(), this.materials.white );

    this.shapes.eye_sample.draw( graphics_state, Mat4.rotation(-Math.PI/3, Vec.of(0,1,0)).times(Mat4.rotation( Math.PI/6, Vec.of(1,0,0)).times(Mat4.translation([ 0, 0,-1]))), this.materials.black );
    this.shapes.eye_sample.draw( graphics_state, Mat4.rotation( Math.PI/3, Vec.of(0,1,0)).times(Mat4.rotation(-Math.PI/6, Vec.of(1,0,0)).times(Mat4.translation([ 0, 0, 1]))), this.materials.black );

    this.shapes.beak_sample.draw( graphics_state, Mat4.translation([ 0, -0.1, 0]).times(Mat4.scale([ 0.9, 0.7, 0.9])).times(Mat4.rotation( Math.PI/2, Vec.of(0,1,0))), this.materials.orange );
    this.shapes.beak_sample.draw( graphics_state, Mat4.translation([ 0, -0.1, 0]).times(Mat4.scale([ 0.9, 0.7, 0.9])).times(Mat4.rotation( Math.PI, Vec.of(1,0,0))).times(Mat4.rotation( Math.PI/2, Vec.of(0,1,0))), this.materials.orange );
    
    this.shapes.neck_sample.draw( graphics_state, Mat4.translation([ -0.4, 0, 0]).times(Mat4.rotation( Math.PI/2, Vec.of(1,0,0))), this.materials.white );

    this.shapes.body_sample.draw( graphics_state, Mat4.translation([ -6, -7.5, 1]), this.materials.white );

    this.shapes.wing_sample.draw( graphics_state, Mat4.translation([ -7, -7.5, 0]).times(Mat4.translation([ 0, 0, 1])).times(Mat4.scale([ 1.2, 1.2, 1.2])), this.materials.white );
    this.shapes.wing_sample.draw( graphics_state, Mat4.translation([ -7, -7.5, 0]).times(Mat4.scale([ 1, 1,-1])).times(Mat4.translation([ 0, 0, 1])).times(Mat4.scale([ 1.2, 1.2, 1.2])), this.materials.white );

    this.shapes.leg_sample.draw( graphics_state, Mat4.translation([ -4, -6.75, .75]).times(Mat4.rotation( Math.PI/2, Vec.of( 1, 0, 0))), this.materials.orange );
    this.shapes.leg_sample.draw( graphics_state, Mat4.translation([ -4, -6.75, -.75]).times(Mat4.rotation( Math.PI/2, Vec.of( 1, 0, 0))), this.materials.orange );

    this.shapes.foot_sample.draw( graphics_state, Mat4.translation([ -4.25, -9.25, .75]), this.materials.orange );
    this.shapes.foot_sample.draw( graphics_state, Mat4.translation([ -4.25, -9.25, -.75]), this.materials.orange );
  }
}


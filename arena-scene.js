window.Arena_Scene = window.classes.Arena_Scene =
class Arena_Scene extends Scene_Component { 

  constructor(context, control_box) {     // The scene begins by requesting the camera, shapes, and materials it will need.
    super(context, control_box );    // First, include a secondary Scene that provides movement controls:
    if(!context.globals.has_controls) 
      context.register_scene_component(new Movement_Controls( context, control_box.parentElement.insertCell())); 

    context.globals.graphics_state.camera_transform = Mat4.look_at( Vec.of( 0,50,50 ), Vec.of( 0,0,0 ), Vec.of( 0,1,0 ) );
    this.initial_camera_location = Mat4.inverse( context.globals.graphics_state.camera_transform );
    context.canvas.addEventListener( "mousemove", e => { e.preventDefault();
        this.handle_mouse_movement(calculate_click_ray_2(e, context.globals.graphics_state.camera_transform, context.globals.graphics_state.projection_transform, context.canvas)); } );

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
      }

      // this.lights = [ new Light( Vec.of( 10,-15,10,1 ), Color.of( 1, 1, 1, 1 ), 100000 ) ];
      this.lights = [ new Light( Vec.of( 0,0,5,1 ), Color.of( 0, 1, 1, 1 ), 1000 ) ];
      this.arena_transform = Mat4.scale([30,1,30]).times(Mat4.rotation(Math.PI / 2, Vec.of(1,0,0)));
      this.marker_tile_def_transform = Mat4.translation([0,0.1,0]).times(Mat4.scale([5,0,5]).times(Mat4.rotation(Math.PI/2, Vec.of(-1,0,0))));
      this.marker_tile_world_transform = this.marker_tile_def_transform;
  }

  make_control_panel() {           // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements. 
  }

  // Handles intersection with arena and calculates area to place cursor
  handle_mouse_movement(mouse_ray) {
    const width = 10, height = 10;
    // Assume the arena is always at 0,0,0
    // And tiles are arranges such that the center of tile 1 is at [2.5,2.5,0]
    // If the ray is perpendicular to the plane, then there is no intersection
    let plane_normal = Vec.of(0,1,0);
    if (Math.abs(mouse_ray.direction.dot(plane_normal)) < Number.EPSILON) return false;
    let t =
        Vec.of(0,0,0).minus(mouse_ray.origin).dot(plane_normal) / mouse_ray.direction.dot(plane_normal);
    if (t < 0.0) return false;
    let intersection = mouse_ray.direction.times(t).plus(mouse_ray.origin);
    // Calculate where the marker should be placed assuming its size is 5x5 in xz plane
    let num_tile_x = Math.floor(intersection[0] / width) ;
    let num_tile_z = Math.floor(intersection[2] / height);
    let translation = Mat4.translation([width * num_tile_x + (width / 2.0) , 0, height * num_tile_z + (height / 2.0)]);
    this.marker_tile_world_transform = translation.times(this.marker_tile_def_transform);
  }

  display( graphics_state ) { 
    graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
    const t = graphics_state.animation_time / 1000, dt = graphics_state.animation_delta_time / 1000;

    // Draw arena
    this.shapes.arena.draw(graphics_state, Mat4.translation([ 0, 0, 0]).times(this.arena_transform), this.materials.green);
    this.shapes.menu_quad.draw(graphics_state, this.marker_tile_world_transform, this.materials.marker_tile);

  }
}


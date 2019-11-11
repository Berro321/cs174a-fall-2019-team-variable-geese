// Utility functions and structures for the variable geese project



/***** FUNCTIONS **************/
// Written by: Betto Cerrillos
// Checks to see if a ray has intersected an AABB
// ray is the structure that describes the ray to test
//      {origin: Vector3 for the origin of this ray, direction: Normalized direction of ray}
// aabb is the structure that describes the aabb box for the thing to be tested
//      {mid: Vector3 for midpoint of AABB, d: Array of size 3 that has the halflengths for x,y,z}
// model_transform is the transform of the object we are testing for intersection.
// intersect_point is the output variable assuming it is an object with a vector3
// Returns true if there is an intersection, false otherwise
function check_ray_intersect_AABB(ray, aabb, model_transform, intersect_point )
{
  // Move the ray to the object coordinates to easily test intersection
  let inverse_matrix = Mat4.inverse(model_transform);
  let inverse_matrix_vec = inverse_matrix.transposed();
  let ray_origin = inverse_matrix.times(ray.origin.to4(1)).to3();
  let ray_direction = inverse_matrix_vec.times(ray.direction.to4(0)).to3();
  ray_direction.normalize();

  // Calculate the intersection points between each pair of planes parallel in
  // the x-axis, y-axis, and z-axis. The t value is where along the ray the intercept
  // ocurred. By finding the minumum t and max t, we get a line segment to test to see
  // if it is inside the box.
  let tmin = Number.NEGATIVE_INFINITY,
    tmax = Number.POSITIVE_INFINITY;
  for (let i = 0; i < 3; i++)
  {
    // Initialize all the plane variables for this axis
    let plane1_point = Vec.of(0,0,0);
    let plane2_point = Vec.of(0,0,0);
    plane1_point[i] = aabb.mid[i] + aabb.d[i];
    plane2_point[i] = aabb.mid[i] - aabb.d[i];
    let plane1_normal = Vec.of(0,0,0);
    let plane2_normal = Vec.of(0,0,0);
    plane1_normal[i] = 1;
    plane2_normal[i] = -1;

    // If the ray is perpendicular to the plane, then there is no intersection
    if (Math.abs(ray_direction.dot(plane1_normal)) < Number.EPSILON) continue;
    // ray plane intersection
    let t0 =
      plane1_point.minus(ray_origin).dot(plane1_normal) / ray_direction.dot(plane1_normal);
    let t1 =
      plane2_point.minus(ray_origin).dot(plane2_normal) / ray_direction.dot(plane2_normal);
    // t0 must always be the smallest one
    if (t0 > t1)
    {
      let tmp = t0;
      t0 = t1;
      t1 = tmp;
    }

    // Find the overall tmin and tmax
    tmin = Math.max(tmin, t0);
    tmax = Math.min(tmax, t1);
    // If the minumum t is greater than max, then it fails
    if (tmin > tmax) return false;
  }

  // Calculate the midpoint, which should be inside the AABB.
  let p1 = ray_origin.plus(ray_direction.times(tmin));
  let p2 = ray_origin.plus(ray_direction.times(tmax));
  let mid = p1.plus(p2).times(0.5);
  if (
    aabb.mid[0] + aabb.d[0] > mid[0] &&  // x-coords
    aabb.mid[0] - aabb.d[0] < mid[0] &&
    aabb.mid[1] + aabb.d[1] > mid[1] &&  // y-coords
    aabb.mid[1] - aabb.d[1] < mid[1] &&
    aabb.mid[2] + aabb.d[2] > mid[2] &&  // z-coords
    aabb.mid[2] - aabb.d[2] < mid[2] )
    {
      intersect_point.point = Vec.of(0,0,0);
      intersect_point.point = intersect_point.point.plus(p1);
      return true;
    }
  return false;
}

// Calculates ray from the camera origin to where in the screen the user has clicked;
function calculate_click_ray(event, camera_transform, projection_matrix, canvas,) {
  const mouse_position = ( e, rect = canvas.getBoundingClientRect() ) => 
    Vec.of( 2 * e.clientX / (rect.right - rect.left) - 1, 1 - 2 * e.clientY / (rect.bottom - rect.top) ); 
  let mouse_pos = mouse_position(event);
  // Convert from screen to clip coordinates
  const ray_clip = Vec.of(mouse_pos[0], mouse_pos[1], -0.1, 1);
  // Inverse the ray into the eye space.
  let ray_eye = Mat4.inverse(projection_matrix).times(ray_clip);
  // Treat it as a vector now
  ray_eye = Vec.of(ray_eye[0], ray_eye[1], -1, 0);
  // Bring it to world coordinates
  let ray_world = camera_transform.transposed().times(ray_eye).to3();
  // Calculate eye location
  let eye_loc = Mat4.inverse(camera_transform).times(Vec.of(0,0,0,1)).to3(); 
  return {origin: eye_loc, direction: ray_world.normalized()};
}

// Find the world position of the model transform matrix.
function calculate_world_position(model_transform)
{
  // Columns 1-3 with rows 1-3 form the basis vectors (in terms of world coordinates)
  // so scaling these vectors by their translations in the 4th column gives the world coordinates.
  let world_pos = Vec.of(0,0,0);
  for (let i = 0; i < 3; i++)
  {
    let tmp = Vec.of(model_transform[0][i], model_transform[1][i], model_transform[2][i]).normalized();
    tmp.scale(model_transform[i][3]);
    world_pos = world_pos.plus(tmp); 
  }
  return world_pos;
}
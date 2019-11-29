// Stronk class
// This is a derived class for a Stronk,
// a high attack, low movement character.
class Stronk extends Goose {
    constructor(goose_id) { 
        super ( goose_id );

        let tag = '_' + this.constructor.name + this.stats.goose_id;
        let head = 'head' + tag;
        let left_eyebrow = 'left_eyebrow' + tag;
        let right_eyebrow = 'right_eyebrow' + tag;
        let left_eye = 'left_eye' + tag;
        let right_eye = 'right_eye' + tag;
        let top_beak = 'top_beak' + tag;
        let bottom_beak = 'bottom_beak' + tag;
        let neck = 'neck' + tag;
        let body = 'body' + tag;
        let left_wing = 'left_wing' + tag;
        let right_wing = 'right_wing' + tag;
        let left_leg = 'left_leg' + tag;
        let right_leg = 'right_leg' + tag;
        let left_foot = 'left_foot' + tag;
        let right_foot = 'right_foot' + tag;

        //Overwrite these initial transforms.
        this.transforms[left_leg]       = Mat4.translation([ -4, -2.25, 1]).times(Mat4.scale([3,2,3])).times(Mat4.rotation( Math.PI/2, Vec.of( 1, 0, 0)));
        this.transforms[right_leg]      = Mat4.translation([ -4, -2.25, -1]).times(Mat4.scale([3,2,3])).times(Mat4.rotation( Math.PI/2, Vec.of( 1, 0, 0)));
        this.transforms[left_wing]      = Mat4.translation([ -7, -4, 0]).times(Mat4.translation([ 0, 0, 1.8])).times(Mat4.scale([ 1.2, 1.2, 1.2])); // 'left_wing'
        this.transforms[body]           = Mat4.translation([ -6, -4, 1.8]).times(Mat4.scale([ 1, 1, 1.8])); // 'body'
        this.transforms[right_wing]     = Mat4.translation([ -7, -4, 0]).times(Mat4.scale([ 1, 1,-1])).times(Mat4.translation([ 0, 0, 1.8])).times(Mat4.scale([ 1.2, 1.2, 1.2])); // 'right_wing'
        this.transforms[left_foot]      = Mat4.translation([ -4.25, -9.25, 1]).times(Mat4.scale([1.3,1.3,1.3])); // 'left_foot'
        this.transforms[right_foot]     = Mat4.translation([ -4.25, -9.25, -1]).times(Mat4.scale([1.3,1.3,1.3]));

        this.transforms[head]           = Mat4.translation([ 0, 3.5, 0]).times(this.transforms[head]);
        this.transforms[left_eyebrow]   = Mat4.translation([ 0, 3.5, 0]).times(this.transforms[left_eyebrow]);
        this.transforms[right_eyebrow]  = Mat4.translation([ 0, 3.5, 0]).times(this.transforms[right_eyebrow]);
        this.transforms[left_eye]       = Mat4.translation([ 0, 3.5, 0]).times(this.transforms[left_eye]);
        this.transforms[right_eye]      = Mat4.translation([ 0, 3.5, 0]).times(this.transforms[right_eye]);
        this.transforms[top_beak]       = Mat4.translation([ 0, 3.5, 0]).times(this.transforms[top_beak]);
        this.transforms[bottom_beak]    = Mat4.translation([ 0, 3.5, 0]).times(this.transforms[bottom_beak]);
        this.transforms[neck]           = Mat4.translation([ 0, 3.5, 0]).times(this.transforms[neck]);


        // Add thighs.
        this.shapes['left_thigh' + '_' + this.constructor.name + goose_id] = new Subdivision_Sphere(3);
        this.transforms['left_thigh' + '_' + this.constructor.name + goose_id] = Mat4.translation([-4,-5, 1]).times(Mat4.scale([1.2,1.2,1.2]));
        this.colors['left_thigh' + '_' + this.constructor.name + goose_id] = 'orange';

        this.shapes['right_thigh' + '_' + this.constructor.name + goose_id] = new Subdivision_Sphere(3);
        this.transforms['right_thigh' + '_' + this.constructor.name + goose_id] = Mat4.translation([-4,-5,-1]).times(Mat4.scale([1.2,1.2,1.2]));
        this.colors['right_thigh' + '_' + this.constructor.name + goose_id] = 'orange';
        

        // Add calves.
        this.shapes['left_calf' + '_' + this.constructor.name + goose_id] = new Subdivision_Sphere(3);
        this.transforms['left_calf' + '_' + this.constructor.name + goose_id] = Mat4.translation([-4,-7.5, 1]);
        this.colors['left_calf' + '_' + this.constructor.name + goose_id] = 'orange';

        this.shapes['right_calf' + '_' + this.constructor.name + goose_id] = new Subdivision_Sphere(3);
        this.transforms['right_calf' + '_' + this.constructor.name + goose_id] = Mat4.translation([-4,-7.5,-1]);
        this.colors['right_calf' + '_' + this.constructor.name + goose_id] = 'orange';
    }
}
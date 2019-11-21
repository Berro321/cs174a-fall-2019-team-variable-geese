// Goose class
// This is the base class for all goose classes
// Contains stats used for battle calculations and
// shapes and transforms that pertain the body parts
// of this goose.
class Goose {
    constructor(goose_id) {

        this.stats = {
            health: 50,
            attack: 1,
            defense: 1,
            range: 1,
            goose_id: goose_id,
        };

        this.state = {
            animating: false,
            frameNumber: 0,
        };

        let shape_names = [
            "head",
            "left_eyebrow",
            "right_eyebrow",
            "left_eye",
            "right_eye",
            "top_beak",
            "bottom_beak",
            "neck",
            "left_wing",
            "body",
            "right_wing",
            "left_leg",
            "right_leg",
            "left_foot",
            "right_foot",
        ];

        let shapes = [
            new Subdivision_Sphere(3), // "head"
            new Cube(), // "left_eyebrow"
            new Cube(), // "right_eyebrow"
            new Rounded_Capped_Cylinder(12, 12, .2, .1, [0,1]), // "left_eye"
            new Rounded_Capped_Cylinder(12, 12, .2, .1, [0,1]), // "right_eye"
            new Rounded_Cone(12, 12, 1, 2, Math.PI, [0,1]), // "top_beak"
            new Rounded_Cone(12, 12, 1, 2, Math.PI, [0,1]), // "bottom_beak"
            new Rounded_Capped_Cylinder(12, 12, .6, 4, [0,1]), // "neck"
            new Wing(), // "left_wing"
            new Body(), // "body"
            new Wing(), // "right_wing"
            new Rounded_Capped_Cylinder(12, 12, .2, 3.5, [0,1]), // "left_leg"
            new Rounded_Capped_Cylinder(12, 12, .2, 3.5, [0,1]), // "right_leg"
            new Foot(), // "left_foot"
            new Foot(), // "right_foot"
        ];

        let shape_transforms = [
            Mat4.identity(), // "head"
            Mat4.identity().times(Mat4.translation([ 0.5, 0.75,-0.4])).times(Mat4.rotation( Math.PI/6, Vec.of(0,1,0))).times(Mat4.rotation( Math.PI/4, Vec.of(0,0,1))).times(Mat4.rotation(-Math.PI/12, Vec.of(1,0,0))).times(Mat4.scale([ 0.05, 0.04, 0.25])), // "left_eyebrow"
            Mat4.identity().times(Mat4.translation([ 0.5, 0.75, 0.4])).times(Mat4.rotation(-Math.PI/6, Vec.of(0,1,0))).times(Mat4.rotation( Math.PI/4, Vec.of(0,0,1))).times(Mat4.rotation( Math.PI/12, Vec.of(1,0,0))).times(Mat4.scale([ 0.05, 0.04, 0.25])), // "right_eyebrow"
            Mat4.identity().times(Mat4.rotation(-Math.PI/3, Vec.of(0,1,0))).times(Mat4.rotation( Math.PI/6, Vec.of(1,0,0)).times(Mat4.translation([ 0, 0,-1]))), // "left_eye"
            Mat4.identity().times(Mat4.rotation( Math.PI/3, Vec.of(0,1,0))).times(Mat4.rotation(-Math.PI/6, Vec.of(1,0,0)).times(Mat4.translation([ 0, 0, 1]))), // "right_eye"
            Mat4.identity().times(Mat4.translation([ 0, -0.1, 0])).times(Mat4.scale([ 0.9, 0.7, 0.9])).times(Mat4.rotation( Math.PI/2, Vec.of(0,1,0))), // "top_beak"
            Mat4.identity().times(Mat4.translation([ 0, -0.1, 0])).times(Mat4.scale([ 0.9, 0.7, 0.9])).times(Mat4.rotation( Math.PI, Vec.of(1,0,0))).times(Mat4.rotation( Math.PI/2, Vec.of(0,1,0))), // "bottom_beak"
            Mat4.identity().times(Mat4.translation([ -0.4, 0, 0])).times(Mat4.rotation( Math.PI/2, Vec.of(1,0,0))), // "neck"
            Mat4.identity().times(Mat4.translation([ -7, -7.5, 0])).times(Mat4.translation([ 0, 0, 1])).times(Mat4.scale([ 1.2, 1.2, 1.2])),
            Mat4.identity().times(Mat4.translation([ -6, -7.5, 1])), // "body"
            Mat4.identity().times(Mat4.translation([ -7, -7.5, 0])).times(Mat4.scale([ 1, 1,-1])).times(Mat4.translation([ 0, 0, 1])).times(Mat4.scale([ 1.2, 1.2, 1.2])),
            Mat4.identity().times(Mat4.translation([ -4, -5.75, .75])).times(Mat4.rotation( Math.PI/2, Vec.of( 1, 0, 0))), // "left_leg"
            Mat4.identity().times(Mat4.translation([ -4, -5.75, -.75])).times(Mat4.rotation( Math.PI/2, Vec.of( 1, 0, 0))), // "right_leg"
            Mat4.identity().times(Mat4.translation([ -4.25, -9.25, .75])), // "left_foot"
            Mat4.identity().times(Mat4.translation([ -4.25, -9.25, -.75])), // "right_foot"
        ];

        let shape_colors = [
            "white", // "head"
            "black", // "left_eyebrow"
            "black", // "right_eyebrow"
            "black", // "left_eye"
            "black", // "right_eye"
            "orange", // "top_beak"
            "orange", // "bottom_beak"
            "white", // "neck"
            "white", // "left_wing"
            "white", // "body"
            "white", // "right_wing"
            "orange", // "left_leg"
            "orange", // "right_leg"
            "orange", // "left_foot"
            "orange", // "right_foot"
        ];

        // shape's key is specifically: shape_name + Goose + goose_id

        // shape -> shape's constructor
        this.shapes = {};
        // shape -> shape's transform
        this.transforms = {};
        // shape -> shape's color
        this.colors = {};
        for (let i = 0; i < shape_names.length; i++) {
            this.shapes[shape_names[i] + '_' + this.constructor.name + goose_id] = shapes[i];
            this.transforms[shape_names[i] + '_' + this.constructor.name + goose_id] = shape_transforms[i];
            this.colors[shape_names[i] + '_' + this.constructor.name + goose_id] = shape_colors[i];
        }
        
    }
    
    spin_neck = () => {
        let t_frames = 100;
        if (this.state.frameNumber == 0)
            this.state.frameNumber = t_frames;

        let neck_down_transform = Mat4.translation([ -0.4, -4, 0]) // move neck independently
            .times(Mat4.rotation(-Math.PI / t_frames / 2, Vec.of(0,0,1)))
            .times(Mat4.translation([0.4,4,0]));

        let body_down_transform = Mat4.translation([-4,-6.75, 0]) // move neck with body
            .times(Mat4.rotation(-Math.PI / t_frames / 3, Vec.of(0,0,1)))
            .times(Mat4.translation([4,6.75,0]));

        let neck = 'neck' + '_' + this.constructor.name + this.stats.goose_id;

        this.transforms[neck] = neck_down_transform.times(body_down_transform)
            .times(this.transforms[neck]);


        this.state.frameNumber--;
        if (this.state.frameNumber == 0)
            this.state.animating = false;
    }

    flap = () => {
        let t_frames = 100;
        if (this.state.frameNumber == 0)
            this.state.frameNumber = t_frames;

        let left_wing = 'left_wing' + '_' + this.constructor.name + this.stats.goose_id;
        let right_wing = 'right_wing' + '_' + this.constructor.name + this.stats.goose_id;
        if (this.state.frameNumber > t_frames/2) {
            let adjustment = 0.1 * (100 - this.state.frameNumber);
            this.transforms[left_wing] = Mat4.translation([ -7,-4.5 + adjustment,1])
                .times(Mat4.rotation(-Math.PI / t_frames, Vec.of(1,0,0)))
                .times(Mat4.translation([ 7,4.5 - adjustment,-1]))
                .times(this.transforms[left_wing]);
            this.transforms[right_wing] = Mat4.translation([ -7,-4.5 + adjustment,-1])
                .times(Mat4.rotation(Math.PI / t_frames, Vec.of(1,0,0)))
                .times(Mat4.translation([ 7,4.5 - adjustment,1]))
                .times(this.transforms[right_wing]);
            for (let shape in this.transforms) {
                this.transforms[shape] = Mat4.translation([0.1,0.1,0]).times(this.transforms[shape]);
            }
        }
        else {
            let adjustment = 0.1 * this.state.frameNumber;
            this.transforms[left_wing] = Mat4.translation([ -7,-4.5 + adjustment,1])
                .times(Mat4.rotation(Math.PI / t_frames, Vec.of(1,0,0)))
                .times(Mat4.translation([ 7,4.5 - adjustment,-1]))
                .times(this.transforms[left_wing]);
            this.transforms[right_wing] = Mat4.translation([ -7,-4.5 + adjustment,-1])
                .times(Mat4.rotation(-Math.PI / t_frames, Vec.of(1,0,0)))
                .times(Mat4.translation([ 7,4.5 - adjustment,1]))
                .times(this.transforms[right_wing]);
            for (let shape in this.transforms) {
                this.transforms[shape] = Mat4.translation([0.1,-0.1,0]).times(this.transforms[shape]);
            }
        }

        this.state.frameNumber--;
        if (this.state.frameNumber == 0)
            this.state.animating = false;
    }
}



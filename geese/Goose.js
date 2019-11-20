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

        let shape_names = [
            "head",
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
            new Rounded_Capped_Cylinder(12, 12, .2, .1, [0,1]), // "left_eye"
            new Rounded_Capped_Cylinder(12, 12, .2, .1, [0,1]), // "right_eye"
            new Rounded_Cone(12, 12, 1, 2, Math.PI, [0,1]), // "top_beak"
            new Rounded_Cone(12, 12, 1, 2, Math.PI, [0,1]), // "bottom_beak"
            new Rounded_Capped_Cylinder(12, 12, .6, 4, [0,1]), // "neck"
            new Wing(), // "left_wing"
            new Body(), // "body"
            new Wing(), // "right_wing"
            new Rounded_Capped_Cylinder(12, 12, .2, 2.5, [0,1]), // "left_leg"
            new Rounded_Capped_Cylinder(12, 12, .2, 2.5, [0,1]), // "right_leg"
            new Foot(), // "left_foot"
            new Foot(), // "right_foot"
        ];

        let shape_transforms = [
            Mat4.identity(), // "head"
            Mat4.identity().times(Mat4.rotation(-Math.PI/3, Vec.of(0,1,0))).times(Mat4.rotation( Math.PI/6, Vec.of(1,0,0)).times(Mat4.translation([ 0, 0,-1]))), // "left_eye"
            Mat4.identity().times(Mat4.rotation( Math.PI/3, Vec.of(0,1,0))).times(Mat4.rotation(-Math.PI/6, Vec.of(1,0,0)).times(Mat4.translation([ 0, 0, 1]))), // "right_eye"
            Mat4.identity().times(Mat4.translation([ 0, -0.1, 0])).times(Mat4.scale([ 0.9, 0.7, 0.9])).times(Mat4.rotation( Math.PI/2, Vec.of(0,1,0))), // "top_beak"
            Mat4.identity().times(Mat4.translation([ 0, -0.1, 0])).times(Mat4.scale([ 0.9, 0.7, 0.9])).times(Mat4.rotation( Math.PI, Vec.of(1,0,0))).times(Mat4.rotation( Math.PI/2, Vec.of(0,1,0))), // "bottom_beak"
            Mat4.identity().times(Mat4.translation([ -0.4, 0, 0])).times(Mat4.rotation( Math.PI/2, Vec.of(1,0,0))), // "neck"
            Mat4.identity().times(Mat4.translation([ -7, -7.5, 0])).times(Mat4.translation([ 0, 0, 1])).times(Mat4.scale([ 1.2, 1.2, 1.2])),
            Mat4.identity().times(Mat4.translation([ -6, -7.5, 1])), // "body"
            Mat4.identity().times(Mat4.translation([ -7, -7.5, 0])).times(Mat4.scale([ 1, 1,-1])).times(Mat4.translation([ 0, 0, 1])).times(Mat4.scale([ 1.2, 1.2, 1.2])),
            Mat4.identity().times(Mat4.translation([ -4, -6.75, .75])).times(Mat4.rotation( Math.PI/2, Vec.of( 1, 0, 0))), // "left_leg"
            Mat4.identity().times(Mat4.translation([ -4, -6.75, -.75])).times(Mat4.rotation( Math.PI/2, Vec.of( 1, 0, 0))), // "right_leg"
            Mat4.identity().times(Mat4.translation([ -4.25, -9.25, .75])), // "left_foot"
            Mat4.identity().times(Mat4.translation([ -4.25, -9.25, -.75])), // "right_foot"
        ];

        let shape_colors = [
            "white", // "head"
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

    flap = (framesLeft) => {
        if (framesLeft > 30) {
            this.transforms['left_wing' + '_' + this.constructor.name + this.stats.goose_id] = Mat4.translation([ -7,-4.5,1])
                .times(Mat4.rotation(-Math.PI / 60, Vec.of(1,0,0)))
                .times(Mat4.translation([ 7,4.5,-1]))
                .times(this.transforms['left_wing' + '_' + this.constructor.name + this.stats.goose_id]);
            this.transforms['right_wing' + '_' + this.constructor.name + this.stats.goose_id] = Mat4.translation([ -7,-4.5,-1])
                .times(Mat4.rotation(Math.PI / 60, Vec.of(1,0,0)))
                .times(Mat4.translation([ 7,4.5,1]))
                .times(this.transforms['right_wing' + '_' + this.constructor.name + this.stats.goose_id]);
        }
        else {
            this.transforms['left_wing' + '_' + this.constructor.name + this.stats.goose_id] = Mat4.translation([ -7,-4.5,1])
                .times(Mat4.rotation(Math.PI / 60, Vec.of(1,0,0)))
                .times(Mat4.translation([ 7,4.5,-1]))
                .times(this.transforms['left_wing' + '_' + this.constructor.name + this.stats.goose_id]);
            this.transforms['right_wing' + '_' + this.constructor.name + this.stats.goose_id] = Mat4.translation([ -7,-4.5,-1])
                .times(Mat4.rotation(-Math.PI / 60, Vec.of(1,0,0)))
                .times(Mat4.translation([ 7,4.5,1]))
                .times(this.transforms['right_wing' + '_' + this.constructor.name + this.stats.goose_id]);
        }
        
        return framesLeft-1;
    }
}



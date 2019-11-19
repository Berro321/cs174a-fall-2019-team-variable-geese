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

        // shape -> shape's constructor


        let shape_names = [
            "head",
            // "left_eye",
            // "right_eye",
            // "beak",
            // "neck",
            // "left_wing",
            // "body",
            // "right_wing",
            // "left_leg",
            // "right_leg",
            // "left_foot",
            // "right_foot",
        ];

        let shape_transforms = [

        ];


        // shape -> shape's constructor
        this.shapes = {};
        this.transforms = {};
        for (let i = 0; i < shape_names.length; i++) {
            this.shapes[shape_names[i] + '_' + this.constructor.name] = new Subdivision_Sphere(3);
            this.transforms[shape_names[i] + '_' + this.constructor.name] = Mat4.identity();
        }
        
    }

    animateMove(frameNumber) {
        let animation_transforms = this.transforms;
        // console.log(animation_transforms);
        for (let shape in animation_transforms) {
            console.log(animation_transforms[shape]);
            animation_transforms[shape] = animation_transforms[shape].times(Mat4.translation([Math.cos(Math.PI / 2 / (frameNumber+1)), Math.sin(Math.PI / 2 / (frameNumber+1)), 0]));
        }
    }
}



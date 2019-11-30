// Monk class
// This is a derived class for a Monk,
// a character that provides magical attacks, has low defense and moves normally.
class Monk extends Goose {
    constructor(goose_id, x, z, orientation) { 
        super ( goose_id, x, z, orientation );

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

        // Add hat and cape.
        this.shapes['hat_tip' + '_' + this.constructor.name + goose_id] = new Rounded_Cone(12, 12, 1, 3, 2*Math.PI, [0,1]),
        this.transforms['hat_tip' + '_' + this.constructor.name + goose_id] = Mat4.translation([-0.2, 0.7, 0.2]).times(Mat4.rotation(Math.PI/8, Vec.of(0,0,1))).times(Mat4.rotation(-Math.PI/2 + Math.PI/9, Vec.of(1,0,0)));
        this.colors['hat_tip' + '_' + this.constructor.name + goose_id] = 'orange';

        this.shapes['hat_base' + '_' + this.constructor.name + goose_id] = new Cube(),
        this.transforms['hat_base' + '_' + this.constructor.name + goose_id] = Mat4.translation([-0.2, 0.7, 0.2]).times(Mat4.rotation(Math.PI/8, Vec.of(0,0,1))).times(Mat4.rotation(Math.PI/9, Vec.of(1,0,0))).times(Mat4.scale([1.2,0.1,1.2]));
        this.colors['hat_base' + '_' + this.constructor.name + goose_id] = 'black';

        this.shapes['cape' + '_' + this.constructor.name + goose_id] = new Cape(20, 20);
        this.transforms['cape' + '_' + this.constructor.name + goose_id] = Mat4.translation([-0.4,-3,0]);
        this.colors['cape' + '_' + this.constructor.name + goose_id] = 'red';
        this.setup();
    }
}
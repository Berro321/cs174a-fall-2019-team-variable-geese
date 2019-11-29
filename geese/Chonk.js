// Chonk class
// This is a derived class for a Chonk,
// a chonky, high defense, low movement character.
class Chonk extends Goose {
    constructor(goose_id) { 
        super ( goose_id );

        let tag = '_' + this.constructor.name + this.stats.goose_id;
        let neck = 'neck' + tag;
        let body = 'body' + tag;
        let left_wing = 'left_wing' + tag;
        let right_wing = 'right_wing' + tag;


        //Overwrite these initial transforms.
        this.transforms[neck]       = Mat4.identity().times(Mat4.translation([ -0.4, 0, 0])).times(Mat4.rotation( Math.PI/2, Vec.of(1,0,0))).times(Mat4.scale([ 1, 1, 0.8])); // 'neck'
        this.transforms[left_wing]  = Mat4.identity().times(Mat4.translation([ -7, -7.5, 0])).times(Mat4.translation([ 0, 0, 3])).times(Mat4.scale([ 1.2, 1.2, 1.2])); // 'left_wing'
        this.transforms[body]       = Mat4.identity().times(Mat4.translation([ -6, -7.5, 3])).times(Mat4.scale([ 1, 1.3, 3])); // 'body'
        this.transforms[right_wing] = Mat4.identity().times(Mat4.translation([ -7, -7.5, 0])).times(Mat4.scale([ 1, 1,-1])).times(Mat4.translation([ 0, 0, 3])).times(Mat4.scale([ 1.2, 1.2, 1.2])); // 'right_wing'

        // Add 'attack_ball.'
        this.shapes['attack_ball' + '_' + this.constructor.name + goose_id] = new Subdivision_Sphere(3);
        this.transforms['attack_ball' + '_' + this.constructor.name + goose_id] = Mat4.scale([ 0.1, 0.1, 0.1]);
        this.colors['attack_ball' + '_' + this.constructor.name + goose_id] = 'white';
    }

    //Do the ball roll.
    attack = () => {
        let t_frames = 100;
        if (this.state.frameNumber == 0)
            this.state.frameNumber = t_frames;

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

        let head_down_transform;
        let head_up_transform;
        
        let neck_down_transform = Mat4.translation([-0.4, -4, 0]) // move neck independently
            .times(Mat4.rotation(-Math.PI / t_frames / 2, Vec.of(0,0,1)))
            .times(Mat4.translation([0.4,4,0]));
        let neck_up_transform = Mat4.translation([-0.4, -4, 0]) // move neck independently
            .times(Mat4.rotation(Math.PI / t_frames / 2, Vec.of(0,0,1)))
            .times(Mat4.translation([0.4,4,0]));
            
        let body_down_transform = Mat4.translation([-4,-6.75, 0]) // move neck with body
            .times(Mat4.rotation(-Math.PI / t_frames / 3, Vec.of(0,0,1)))
            .times(Mat4.translation([4,6.75,0]));
        let body_up_transform = Mat4.translation([-4,-6.75, 0]) // move neck with body
            .times(Mat4.rotation(Math.PI / t_frames / 3, Vec.of(0,0,1)))
            .times(Mat4.translation([4,6.75,0]));

        if (this.state.frameNumber > t_frames/2 + t_frames * 0.1) {
            this.transforms[head] = body_down_transform
                .times(neck_down_transform)
                .times(this.transforms[head]);
                
            this.transforms[left_eyebrow] = body_down_transform
                .times(neck_down_transform)
                .times(this.transforms[left_eyebrow]);
                
            this.transforms[right_eyebrow] = body_down_transform
                .times(neck_down_transform)
                .times(this.transforms[right_eyebrow]);
                
            this.transforms[left_eye] = body_down_transform
                .times(neck_down_transform)
                .times(this.transforms[left_eye]);
                
            this.transforms[right_eye] = body_down_transform
                .times(neck_down_transform)
                .times(this.transforms[right_eye]);
                
            this.transforms[top_beak] = body_down_transform
                .times(neck_down_transform)
                .times(this.transforms[top_beak]);
                
            this.transforms[bottom_beak] = body_down_transform
                .times(neck_down_transform)
                .times(this.transforms[bottom_beak]);
                
            this.transforms[left_wing] = body_down_transform
                .times(this.transforms[left_wing]);    
                
            this.transforms[neck] = Mat4.identity()
                .times(body_down_transform)
                .times(neck_down_transform)
                .times(this.transforms[neck]);
            
            this.transforms[body] = body_down_transform
                .times(this.transforms[body]);

            this.transforms[right_wing] = body_down_transform
                .times(this.transforms[right_wing]);  
        }
        else if (this.state.frameNumber > t_frames/2 - t_frames * 0.1) {
            ;
        }
        else {
            this.transforms[head] = neck_up_transform
                .times(body_up_transform)
                .times(this.transforms[head]);

            this.transforms[left_eyebrow] = neck_up_transform
                .times(body_up_transform)
                .times(this.transforms[left_eyebrow]);

            this.transforms[right_eyebrow] = neck_up_transform
                .times(body_up_transform)
                .times(this.transforms[right_eyebrow]);
                
            this.transforms[left_eye] = neck_up_transform
                .times(body_up_transform)
                .times(this.transforms[left_eye]);
                
            this.transforms[right_eye] = neck_up_transform
                .times(body_up_transform)
                .times(this.transforms[right_eye]);
                
            this.transforms[top_beak] = neck_up_transform
                .times(body_up_transform)
                .times(this.transforms[top_beak]);
                
            this.transforms[bottom_beak] = neck_up_transform
                .times(body_up_transform)
                .times(this.transforms[bottom_beak]);
             
            this.transforms[neck] = neck_up_transform
                .times(body_up_transform)
                .times(this.transforms[neck]);
                
            this.transforms[left_wing] = body_up_transform
                .times(this.transforms[left_wing]);    

            this.transforms[body] = body_up_transform
                .times(this.transforms[body]);

            this.transforms[right_wing] = body_up_transform
                .times(this.transforms[right_wing]);  
        }

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
            this.transforms[left_wing] = Mat4.translation([ -7,-4.5 + adjustment,3])
                .times(Mat4.rotation(-Math.PI / t_frames, Vec.of(1,0,0)))
                .times(Mat4.translation([ 7,4.5 - adjustment,-3]))
                .times(this.transforms[left_wing]);
            this.transforms[right_wing] = Mat4.translation([ -7,-4.5 + adjustment,-3])
                .times(Mat4.rotation(Math.PI / t_frames, Vec.of(1,0,0)))
                .times(Mat4.translation([ 7,4.5 - adjustment,3]))
                .times(this.transforms[right_wing]);
            for (let shape in this.transforms) {
                this.transforms[shape] = Mat4.translation([0.1,0.1,0]).times(this.transforms[shape]);
            }
        }
        else {
            let adjustment = 0.1 * this.state.frameNumber;
            this.transforms[left_wing] = Mat4.translation([ -7,-4.5 + adjustment,3])
                .times(Mat4.rotation(Math.PI / t_frames, Vec.of(1,0,0)))
                .times(Mat4.translation([ 7,4.5 - adjustment,-3]))
                .times(this.transforms[left_wing]);
            this.transforms[right_wing] = Mat4.translation([ -7,-4.5 + adjustment,-3])
                .times(Mat4.rotation(-Math.PI / t_frames, Vec.of(1,0,0)))
                .times(Mat4.translation([ 7,4.5 - adjustment,3]))
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
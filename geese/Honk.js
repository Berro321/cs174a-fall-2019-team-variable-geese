// Honk class
// This is a derived class for your standard Honk,
// a basic, well-rounded character
class Honk extends Goose {
    constructor(goose_id) { 
        super ( goose_id );
        this.head_pos = [0, 0];
    }

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

            let new_pos = body_down_transform.times(neck_down_transform).times(Vec.of(this.head_pos[0],this.head_pos[1],0,1));
            let face_transform = Mat4.translation([new_pos[0] - this.head_pos[0], new_pos[1] - this.head_pos[1], 0]);

            this.transforms[left_eyebrow] = face_transform
                .times(this.transforms[left_eyebrow]);
                
            this.transforms[right_eyebrow] = face_transform
                .times(this.transforms[right_eyebrow]);
                
            this.transforms[left_eye] = face_transform
                .times(this.transforms[left_eye]);
                
            this.transforms[right_eye] = face_transform
                .times(this.transforms[right_eye]);
                
            this.transforms[top_beak] = face_transform
                .times(this.transforms[top_beak]);
                
            this.transforms[bottom_beak] = face_transform
                .times(this.transforms[bottom_beak]);

            this.head_pos = [new_pos[0], new_pos[1]];

                
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
            
            let new_pos = neck_up_transform.times(body_up_transform).times(Vec.of(this.head_pos[0],this.head_pos[1],0,1));
            let face_transform = Mat4.translation([new_pos[0] - this.head_pos[0], new_pos[1] - this.head_pos[1], 0]);

            this.transforms[left_eyebrow] = face_transform
                .times(this.transforms[left_eyebrow]);

            this.transforms[right_eyebrow] = face_transform
                .times(this.transforms[right_eyebrow]);
                
            this.transforms[left_eye] = face_transform
                .times(this.transforms[left_eye]);
                
            this.transforms[right_eye] = face_transform
                .times(this.transforms[right_eye]);
                
            this.transforms[top_beak] = face_transform
                .times(this.transforms[top_beak]);
                
            this.transforms[bottom_beak] = face_transform
                .times(this.transforms[bottom_beak]);

            this.head_pos = [new_pos[0], new_pos[1]];
            
             
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
}
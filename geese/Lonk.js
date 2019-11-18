// Lonk class
// This is a derived class for a Lonk,
// a longer range character.
class Lonk extends Goose {
    constructor() 
    { super ( LONK_ID );
        this.stats = {
            health: 50,
            attack: 1,
            defense: 1,
            range: 1,
            goose_id: goose_id,
        };

        // shape -> shape's constructor
        this.shapes = {
            head:       new Subdivision_Sphere( 3 ),
            left_eye:   new Subdivision_Sphere( 3 ),
            right_eye:  new Subdivision_Sphere( 3 ),
            beak:       new Subdivision_Sphere( 3 ),
            neck:       new Subdivision_Sphere( 3 ),
            left_wing:  new Subdivision_Sphere( 3 ),
            body:       new Subdivision_Sphere( 3 ),
            right_wing: new Subdivision_Sphere( 3 ),
            left_leg:   new Subdivision_Sphere( 3 ),
            right_leg:  new Subdivision_Sphere( 3 ),
            left_foot:  new Subdivision_Sphere( 3 ),
            right_foot: new Subdivision_Sphere( 3 ),
        };
        
        // shape -> current transform, need to initialize
        this.transforms = {
            head:       Mat4.identity(),
            left_eye:   Mat4.identity(),
            right_eye:  Mat4.identity(),
            beak:       Mat4.identity(),
            neck:       Mat4.identity(),
            left_wing:  Mat4.identity(),
            body:       Mat4.identity(),
            right_wing: Mat4.identity(),
            left_leg:   Mat4.identity(),
            right_leg:  Mat4.identity(),
            left_foot:  Mat4.identity(),
            right_foot: Mat4.identity(),
        };
    }
}
// A class to help with collisions - Professor Whitehead mentioned this in office hours!
class CollisionHandler {
    constructor(scene){
        this.scene = scene;
        this.ships = [];
        this.projectiles = [];
    }

    addShip(ship){
        this.ships.push(ship);
    }

    addProjectile(proj){
        this.projectiles.push(proj);
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        return rocket.checkCollision(ship);
    }

    handleCollision(projectile, ship){
        projectile.handleCollision(ship);
        ship.handleCollision(projectile);
        this.scene.handleCollision(projectile, ship);
    }

    update(){
        if (!this.scene.gameOver) {          
            for (let projectile of this.projectiles)     
                projectile.update();         // update rocket sprite
            for (let ship of this.ships)
                ship.update();               // update ship sprite
        } 

        // check collisions
        for (let ship of this.ships){
            for (let projectile of this.projectiles){
                if(this.checkCollision(projectile, ship)) {
                    this.handleCollision(projectile, ship)
                }
            }
        }
    }
    
}
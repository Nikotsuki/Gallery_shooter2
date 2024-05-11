class GalleryShooter extends Phaser.Scene {
    path;
    constructor() {
        super("galleryShooter");

        // Initialize a class variable "my" which is an object.
        // The object has one property, "sprite" which is also an object.
        // This will be used to hold bindings (pointers) to created sprites.
        this.my = {sprite: {}, text: {}};   

        this.myScore = 0;
        this.myLives = 6;
        this.wave = 1;
        this.i = 0;
        this.o = 0;
        this.u = 0;
 
        this.cooldown = 0;

        this.my.sprite.spiders = []; 
        this.my.sprite.slimes = [];
        this.my.sprite.snakes = [];
        this.my.sprite.flies = [];
        this.spidersTotal = 25;
        this.slimeTotal = 12;
        this.snakeTotal = 6;
        
        // Create a flag to determine if the "bullet" is currently active and moving
        this.bulletActive_left = false;
        this.bulletActive_right = false;
        this.bulletActive_up = false;
        this.bulletActive_down = false;
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("alien", "alienPink.png");
        this.load.image("alienBadge", "alienPink_badge1.png");
        this.load.image("spider", "spider.png");
        this.load.image("spiderHit", "spider_dead.png");
        this.load.image("slime", "slimeBlue.png");
        this.load.image("slimeHit", "slimeBlue_dead.png");
        this.load.image("ghost", "ghost.png");
        this.load.image("ghostHit", "ghost_dead.png");
        this.load.image("gear", "spinner.png");
        this.load.image("fly", "fly.png");
        this.load.image("snake", "snakeSlime_ani.png");

        //tileset
        this.load.image("Kenny Tileset", "kenny-tiny-town-tilemap-packed.png");    // tile sheet   
        this.load.tilemapTiledJSON("map", "map.json");

        this.load.audio("zap", "laser2.ogg");
        this.load.audio("hurt", "pepSound1.ogg");

        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");
    }

    create() {
        let my = this.my;

        this.init_game();

        this.spiderPoints = [
            48, 3,
            939, 38,
            136, 116,
            888, 171,
            164, 315,
            835, 415,
            197, 549,
            750, 639,
            171, 764,
            773, 799,
        ];

        this.slimePoints = [
            game.config.width + 50, 0,
            0, game.config.height + 50
        ];

        this.ghostPoints = [
            39, 663,
            56, 375,
            72, 51,
            271, 197,
            487, 419,
            814, 595,
            885, 433,
            963, 21
        ];

        this.snakePoints = [
            game.config.width + 50, game.config.height,
            -100, game.config.height
        ];

        this.spiderCurve = new Phaser.Curves.Spline(this.spiderPoints);
        this.slimeCurve = new Phaser.Curves.Spline(this.slimePoints);
        this.snakeCurve = new Phaser.Curves.Spline(this.snakePoints);

        this.map = this.add.tilemap("map", 16, 16, 10, 10);
        this.tileset = this.map.addTilesetImage("Kenny Tileset", "Kenny Tileset");
        this.grassLayer = this.map.createLayer("Grass", this.tileset, 0, 0);
        this.plantLayer = this.map.createLayer("Plants", this.tileset, 0, 0);
        this.grassLayer.setScale(4.0);
        this.plantLayer.setScale(4.0);

        //alien
        my.sprite.alien = this.add.sprite(game.config.width/2, game.config.height/2, "alien");
        my.sprite.alien.setScale(0.75);
        // bullet
        my.sprite.gear = this.add.sprite(-1000, -1000, "gear");
        my.sprite.gear.setScale(0.45);
        my.sprite.gear.visible = false;
        //badges
        my.sprite.badge1 = this.add.sprite(40, 50, "alienBadge");
        my.sprite.badge1.setScale(0.70);
        my.sprite.badge1.visible = true;
        my.sprite.badge2 = this.add.sprite(80, 50, "alienBadge");
        my.sprite.badge2.setScale(0.70);
        my.sprite.badge2.visible = true;
        my.sprite.badge3 = this.add.sprite(120, 50, "alienBadge");
        my.sprite.badge3.setScale(0.70);
        my.sprite.badge3.visible = true;
        my.sprite.badge4 = this.add.sprite(160, 50, "alienBadge");
        my.sprite.badge4.setScale(0.70);
        my.sprite.badge4.visible = true;
        my.sprite.badge5 = this.add.sprite(200, 50, "alienBadge");
        my.sprite.badge5.setScale(0.70);
        my.sprite.badge5.visible = true;
        my.sprite.badge6 = this.add.sprite(240, 50, "alienBadge");
        my.sprite.badge6.setScale(0.70);
        my.sprite.badge6.visible = true;
        //spiders
        for(let i=0; i<this.spidersTotal; i++){
            my.sprite.spiders.push(this.add.follower(this.spiderCurve, -100, -100, "spider"));
            my.sprite.spiders[i].points = 30;
            my.sprite.spiders[i].alive = false;
            my.sprite.spiders[i].cooldown = 0;
            my.sprite.spiders[i].visible = false;

        }
        //slime
        for(let m=0; m<this.slimeTotal; m++){
            my.sprite.slimes.push(this.add.follower(this.slimeCurve, game.config.width + 50, 0, "slime").setScale(3.5));
            my.sprite.slimes[m].points = 50;
            my.sprite.slimes[m].alive = false;
            //my.sprite.slimes[i].cooldown = 0;
            my.sprite.slimes[m].visible = false;
        }
        //ghost
        //my.sprite.ghost = this.add.sprite(-100, -100, "ghost");
        //my.sprite.ghost.points = 70;
        //snake
        for(let m=0; m<this.snakesTotal; m++){
            my.sprite.snakes.push(this.add.follower(this.snakeCurve, game.config.width + 50, game.config.height, "snake").setScale(3, 3.5));
            my.sprite.snakes[m].points = 70;
            my.sprite.snakes[m].alive = false;
            //my.sprite.slimes[i].cooldown = 0;
            my.sprite.snakes[m].visible = false;
        }
        //fly
        my.sprite.fly = this.add.sprite(-100, -100, "fly");
        my.sprite.fly.setScale(0.5);


        my.text.score = this.add.bitmapText(560, 30, "rocketSquare", "Score " + this.myScore);

        // Create key objects
        this.up = this.input.keyboard.addKey("W");
        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.down = this.input.keyboard.addKey("S");
        //this.nextScene = this.input.keyboard.addKey("S");
        this.left_arrow = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.right_arrow = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.up_arrow = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.down_arrow = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

        // Set movement speeds (in pixels/tick)
        this.playerSpeed = 4;
        this.bulletSpeed = 9;

        // update HTML description
        document.getElementById('description').innerHTML = '<h2>Single Bullet.js</h2><br>A: left // D: right // W: up // S: down // Arrow Keys: shoot'
    }

    update() {
        let my = this.my;

        // Moving left
        if (this.left.isDown) {
            // Check to make sure the sprite can actually move left
            if (my.sprite.alien.x > (my.sprite.alien.displayWidth/2)) {
                my.sprite.alien.x -= this.playerSpeed;
            }
        }

        // Moving right
        if (this.right.isDown) {
            // Check to make sure the sprite can actually move right
            if (my.sprite.alien.x < (game.config.width - (my.sprite.alien.displayWidth/2))) {
                my.sprite.alien.x += this.playerSpeed;
            }
        }

        // Moving up
        if (this.down.isDown) {
            // Check to make sure the sprite can actually move asright
            if (my.sprite.alien.y < (565)) {
                my.sprite.alien.y += this.playerSpeed;
            }
        }

        // Moving down
        if (this.up.isDown) {
            // Check to make sure the sprite can actually move right
            if (my.sprite.alien.y > (0 + (my.sprite.alien.displayHeight/2))) {
                my.sprite.alien.y -= this.playerSpeed;
            }
        }

        // Check for left bullet being fired
        if (Phaser.Input.Keyboard.JustDown(this.left_arrow)) {
            // Only start the left bullet if it's not currently active
            if (!this.bulletActive_left && !this.bulletActive_right && !this.bulletActive_up && !this.bulletActive_down) {
                // Set the active flag to true
                this.bulletActive_left = true;
                // Set the position of the bullet to be the location of the player
                // Offset by the height of the sprite, so the "bullet" comes out of
                // the top of the player avatar, not the middle.
                my.sprite.gear.x = my.sprite.alien.x;
                my.sprite.gear.y = my.sprite.alien.y;
                my.sprite.gear.visible = true;
            }
        }

        if (this.bulletActive_left) {
            my.sprite.gear.x -= this.bulletSpeed;
            // Is the bullet off the top of the screen?
            if (my.sprite.gear.x < -(my.sprite.gear.width/2) || my.sprite.gear.x > game.config.width) {
                // make it inactive and invisible
                this.bulletActive_left = false;
                my.sprite.gear.visible = false;
            }
        }

        // Check for right bullet being fired
        if (Phaser.Input.Keyboard.JustDown(this.right_arrow)) {
            // Only start the left bullet if it's not currently active
            if (!this.bulletActive_left && !this.bulletActive_right && !this.bulletActive_up && !this.bulletActive_down) {
                // Set the active flag to true
                this.bulletActive_right = true;
                // Set the position of the bullet to be the location of the player
                // Offset by the height of the sprite, so the "bullet" comes out of
                // the top of the player avatar, not the middle.
                my.sprite.gear.x = my.sprite.alien.x;
                my.sprite.gear.y = my.sprite.alien.y;
                my.sprite.gear.visible = true;
            }
        }

        if (this.bulletActive_right) {
            my.sprite.gear.x += this.bulletSpeed;
            // Is the bullet off the right of the screen?
            if (my.sprite.gear.x > (game.config.width + my.sprite.gear.width/2) || my.sprite.gear.x < 0) {
                // make it inactive and invisible
                this.bulletActive_right = false;
                my.sprite.gear.visible = false;
            }
        }

        // Check for up bullet being fired
        if (Phaser.Input.Keyboard.JustDown(this.up_arrow)) {
            // Only start the left bullet if it's not currently active
            if (!this.bulletActive_left && !this.bulletActive_right && !this.bulletActive_up && !this.bulletActive_down) {
                // Set the active flag to true
                this.bulletActive_up = true;
                // Set the position of the bullet to be the location of the player
                // Offset by the height of the sprite, so the "bullet" comes out of
                // the top of the player avatar, not the middle.
                my.sprite.gear.x = my.sprite.alien.x;
                my.sprite.gear.y = my.sprite.alien.y;
                my.sprite.gear.visible = true;
            }
        }

        if (this.bulletActive_up) {
            my.sprite.gear.y -= this.bulletSpeed;
            // Is the bullet off the top of the screen?
            if (my.sprite.gear.y < 0 || my.sprite.gear.y > game.config.height) {
                // make it inactive and invisible
                this.bulletActive_up = false;
                my.sprite.gear.visible = false;
            }
        }

        // Check for down bullet being fired
        if (Phaser.Input.Keyboard.JustDown(this.down_arrow)) {
            // Only start the left bullet if it's not currently active
            if (!this.bulletActive_left && !this.bulletActive_right && !this.bulletActive_up && !this.bulletActive_down) {
                // Set the active flag to true
                this.bulletActive_down = true;
                // Set the position of the bullet to be the location of the player
                // Offset by the height of the sprite, so the "bullet" comes out of
                // the top of the player avatar, not the middle.
                my.sprite.gear.x = my.sprite.alien.x;
                my.sprite.gear.y = my.sprite.alien.y;
                my.sprite.gear.visible = true;
            }
        }

        if (this.bulletActive_down) {
            my.sprite.gear.y += this.bulletSpeed;
            // Is the bullet off the top of the screen?
            if (my.sprite.gear.y > (game.config.height + my.sprite.gear.width/2) || my.sprite.gear.y < 0) {
                // make it inactive and invisible
                this.bulletActive_down = false;
                my.sprite.gear.visible = false;
            }
        }

        this.cooldown += 1;
    
        //wave 1
        if(this.wave == 1){
            if(this.cooldown % 120 == 0){
                my.sprite.spiders[this.i].visible = true;
                my.sprite.spiders[this.i].alive = true;
                my.sprite.spiders[this.i].startFollow({from: 0, to: 1, delay: 0, duration: 17000, ease: 'Sine.easeInOut', repeat: 1, yoyo: false, rotateToPath: false, rotationOffset: -90});
                this.i += 1;
            }
            if (this.i == this.spidersTotal){
                this.wave = 2; 
                this.cooldown = 0;
                this.i = 0;
            }
        }
        //wave 2
        if(this.wave == 2){
            if(this.cooldown % 250 == 0 && this.i < this.spidersTotal){
                my.sprite.spiders[this.i].visible = true;
                my.sprite.spiders[this.i].alive = true;
                my.sprite.spiders[this.i].startFollow({from: 0, to: 1, delay: 0, duration: 16500, ease: 'Sine.easeInOut', repeat: 1, yoyo: false, rotateToPath: false, rotationOffset: -90});
                this.i += 1;
            }
            if(this.cooldown % 600 == 0 && this.o < this.slimeTotal){
                my.sprite.slimes[this.o].visible = true;
                my.sprite.slimes[this.o].alive = true;
                my.sprite.slimes[this.o].startFollow({from: 0, to: 1, delay: 0, duration: 5000, ease: 'Sine.easeInOut', repeat: 1, yoyo: false, rotateToPath: false, rotationOffset: -90});
                this.o += 1;
            }
            if (this.i == this.spidersTotal && this.o == this.slimeTotal){
                this.wave = 3; 
                this.cooldown = 0;
                this.i = 0;
                this.o = 0;
            }
        }

        //wave 3
        if(this.wave == 3){
            console.log("wave 3");
            if(this.cooldown % 220 == 0 && this.i < this.spidersTotal){
                my.sprite.spiders[this.i].visible = true;
                my.sprite.spiders[this.i].alive = true;
                my.sprite.spiders[this.i].startFollow({from: 0, to: 1, delay: 0, duration: 15000, ease: 'Sine.easeInOut', repeat: 1, yoyo: false, rotateToPath: false, rotationOffset: -90});
                this.i += 1;
            }
            if(this.cooldown % 500 == 0 && this.o < this.slimeTotal){
                my.sprite.slimes[this.o].visible = true;
                my.sprite.slimes[this.o].alive = true;
                my.sprite.slimes[this.o].startFollow({from: 0, to: 1, delay: 0, duration: 5000, ease: 'Sine.easeInOut', repeat: 1, yoyo: false, rotateToPath: false, rotationOffset: -90});
                this.o += 1;
            }
            if(this.cooldown % 550 == 0 && this.u < this.snakesTotal){
                my.sprite.snakes[this.u].visible = true;
                my.sprite.snakes[this.u].alive = true;
                my.sprite.snakes[this.u].startFollow({from: 0, to: 1, delay: 0, duration: 7000, ease: 'Sine.easeInOut', repeat: 1, yoyo: false, rotateToPath: false, rotationOffset: -90});
                this.u += 1;
            }
            if (this.i == this.spidersTotal && this.o == this.slimeTotal && this.u == this.snakesTotal){
                this.scene.start("beatGame", {score: this.myScore});
            }
        }


        //spiders collision
        for(let spider of my.sprite.spiders){
            if (this.collides(my.sprite.gear, spider)) {
                spider.stopFollow();
                spider.alive = false;
                // start animation
                //this.die = this.add.sprite(spider.x, spider.y, "spiderHit");
                spider.x = -200;
                //setTimeout(this.die.visible = false, 200);
                // clear out bullet -- put y offscreen, will get reaped next update
                my.sprite.gear.y = -1000;
                my.sprite.gear.x = -1000;
                this.myScore += spider.points;
                this.updateScore();
                //spider.x = -1000;
                spider.visible = false;
                this.sound.play("zap", {
                    volume: 0.7   // Can adjust volume using this, goes from 0 to 1
                });
            }
                
            if (this.collides(my.sprite.alien, spider)) {
                spider.x = -200;
                spider.y = -200;
                spider.stopFollow();
                spider.alive = false;
                spider.visible = false;
                this.sound.play("hurt", {
                    volume: 0.7   // Can adjust volume using this, goes from 0 to 1
                });
                this.myScore -= 60;
                this.updateScore();
                this.myLives -= 1;
                //this.die.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                //    this.my.sprite.spider.visible = true;
                //    this.my.sprite.spider.x = Math.random()*config.width;
                //}
            }
            if(spider.alive == true){
                spider.cooldown += 1;
                if(spider.cooldown % Math.floor(Math.random() * 800) == 0){
                    my.sprite.flies.push(this.add.sprite(spider.x, spider.y, "fly").setScale(0.8));
                }
            }
        }

        //slimes collision
        for(let slime of my.sprite.slimes){
            if (this.collides(my.sprite.gear, slime)) {
                slime.stopFollow();
                slime.alive = false;
                //this.die = this.add.sprite(spider.x, spider.y, "spiderHit");
                slime.x = -200;
                //setTimeout(this.die.visible = false, 200);
                // clear out bullet -- put y offscreen, will get reaped next update
                my.sprite.gear.y = -1000;
                my.sprite.gear.x = -1000;
                this.myScore += slime.points;
                this.updateScore();
                //spider.x = -1000;
                slime.visible = false;
                this.sound.play("zap", {
                    volume: 0.7   // Can adjust volume using this, goes from 0 to 1
                });
            }
                    
            if (this.collides(my.sprite.alien, slime)) {
                slime.x = -200;
                slime.y = -200;
                slime.stopFollow();
                slime.alive = false;
                slime.visible = false;
                this.sound.play("hurt", {
                    volume: 0.7   // Can adjust volume using this, goes from 0 to 1
                });
                this.myScore -= 60;
                this.updateScore();
                this.myLives -= 1;
                }
        }

        //snakes collision
        for(let snake of my.sprite.snakes){
            if (this.collides(my.sprite.gear, snake)) {
                snake.stopFollow();
                snake.alive = false;
                //this.die = this.add.sprite(spider.x, spider.y, "spiderHit");
                snake.x = -200;
                //setTimeout(this.die.visible = false, 200);
                // clear out bullet -- put y offscreen, will get reaped next update
                my.sprite.gear.y = -1000;
                my.sprite.gear.x = -1000;
                this.myScore += snake.points;
                this.updateScore();
                //spider.x = -1000;
                snake.visible = false;
                this.sound.play("zap", {
                    volume: 0.7   // Can adjust volume using this, goes from 0 to 1
                });
            }
                    
            if (this.collides(my.sprite.alien, snake)) {
                snake.x = -200;
                snake.y = -200;
                snake.stopFollow();
                snake.alive = false;
                snake.visible = false;
                this.sound.play("hurt", {
                    volume: 0.7   // Can adjust volume using this, goes from 0 to 1
                });
                this.myScore -= 60;
                this.updateScore();
                this.myLives -= 1;
                }
        }

        if(this.myLives == 5){
            my.sprite.badge6.visible = false;
        }
        if(this.myLives == 4){
            my.sprite.badge5.visible = false;
        }
        if(this.myLives == 3){
            my.sprite.badge4.visible = false;
        }
        if(this.myLives == 2){
            my.sprite.badge3.visible = false;
        }
        if(this.myLives == 1){
            my.sprite.badge2.visible = false;
        }
        if(this.myLives == 0){
            console.log("end");
            my.sprite.badge1.visible = false;
            this.scene.restart();
            this.scene.start("gameOver", {score: this.myScore});
        }

        for (let fly of my.sprite.flies) {
            fly.y += this.bulletSpeed/2;
            if(this.collides(my.sprite.alien, fly)){
                fly.x = -500
                this.sound.play("hurt", {
                    volume: 0.7   // Can adjust volume using this, goes from 0 to 1
                });
                this.myScore -= 30;
                this.updateScore();
                this.myLives -= 1;
            }
        }

        my.sprite.flies = my.sprite.flies.filter((fly) => fly.y < game.config.height + 50);
    }

    collides(a, b){
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }

    updateScore() {
        let my = this.my;
        if(this.myScore < 0){
            this.myScore = 0;
        }
        my.text.score.setText("Score " + this.myScore);
    }

    init_game(){

        this.myScore = 0;
        this.myLives = 6;
        this.wave = 3;
        this.i = 0;
        this.o = 0;
        this.u = 0;
 
        this.cooldown = 0;
        

        this.my.sprite.spiders = []; 
        this.my.sprite.flies = [];
        this.my.sprite.slimes = [];
        this.my.sprite.snakes = [];
        this.spidersTotal = 25;
        this.slimeTotal = 12;
        this.snakesTotal = 6;
        
        // Create a flag to determine if the "bullet" is currently active and moving
        this.bulletActive_left = false;
        this.bulletActive_right = false;
        this.bulletActive_up = false;
        this.bulletActive_down = false;
    }
}
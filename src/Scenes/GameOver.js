class GameOver extends Phaser.Scene {
    constructor(){
        super("gameOver");
        this.my = {text: {}};   
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");
    }

    init (data){
        this.finalScore = data.score;
    }

    create(){
        let my = this.my;
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        my.text.GameOver1 = this.add.bitmapText(game.config.width/2 - 100, game.config.height/2 - 150, "rocketSquare", "Game Over");
        my.text.score = this.add.bitmapText(game.config.width/2 - 255, game.config.height/2 - 50, "rocketSquare", "Your final score was  " + this.finalScore);
        my.text.GameOver2 = this.add.bitmapText(game.config.width/2 - 280, game.config.height/2 + 50, "rocketSquare", "Press space to try again");
    }

    update(){

        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            this.scene.start("galleryShooter");
            //this.scene.restart("galleryShooter");
        }
    }
}
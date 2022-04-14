class ComboBar {
    constructor(scene, x, y, config, rocket){
        //super(scene, x, y);
        
        this.comboBar =  scene.add.rectangle(x, y, config.fixedWidth, 
                                                35, 
                                                "0xF30000").setOrigin(0,0).setStrokeStyle(); 

        this.comboLabel =  scene.add.text(x, y, "x 1", config); 
        //this.add([this.comboBar, this.comboLabel]);
        this.rocket = rocket;
        scene.add.existing(this);
        console.log(this);
        
        console.log(this.displayList);
    }

    update(){
        if (this.rocket.combo == 0){
            this.comboLabel.visible = false;
            this.comboBar.visible = false;
        } else {
            this.comboLabel.visible = true;
            this.comboBar.visible = true;
            this.comboLabel.text = this.rocket.combo;
            this.comboBar.width = this.comboLabel.width * this.rocket.comboTimer.getRemaining() / game.settings.comboDuration;
        }
    }
}
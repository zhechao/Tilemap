/** @module Player
  * A class representing the player.
  */
export default class Player {
  /** @constructor
    * Constructs a new player instance
    * @param {float} x - the player's x position
    * @param {float} y - the player's y position
    */
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.charaImg = new Image();
    this.charaImg.src = './96*128chara.png';
    this.sourceX = 0;
    this.sourceY = 0;
    this.sy = 0;
    this.dy = 32;
    this.wy = 64;
    this.ay = 96;
    this.width = 32;
    this.height = 32;
    this.step = 500;
    this.displayX = this.x;
    this.displayY = this.y;
  }

  /** @method update
    * Updates the player
    * @param {double} deltaT - the elapsed time
    * @param {Input} input - the input object
    */
  update(deltaT, input) {
    this.step -= deltaT;
    if(this.step < 500){
      this.sourceX = (this.sourceX + 32) % 96;
      this.step += 500;
    }
    if(input.keyPressed("ArrowLeft")){
      this.x--;
      this.sourceY = this.ay;
    }
    if(input.keyPressed("ArrowRight")){
      this.x++;
      this.sourceY = this.dy;
    }
    if(input.keyPressed("ArrowUp")){
      this.y--;
      this.sourceY = this.wy;
    }
    if(input.keyPressed("ArrowDown")){
      this.y++;
      this.sourceY = this.sy;
    }
    console.log(this.x,this.y);
  }

  /** @method render
    * Renders the player
    * @param {double} deltaT - elapsed time
    * @param {Context2D} context - the rendering context
    */
  render(deltaT, context) {
    context.drawImage(this.charaImg,this.sourceX,this.sourceY,this.width,this.height,this.x - 16, this.y -32, this.width, this.height);
  }

}

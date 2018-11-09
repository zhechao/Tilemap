import Input from './input';
import Tilemap from './tilemap';
import * as Calculate from './calculate';

/** @class Game
  * A class representing the high-level functionality
  * of a game - the game loop, buffer swapping, etc.
  */
export default class Game {

  /** @constructor
    * Creates the game instance
    * @param {integer} width - the width of the game screen in pixels
    * @param {integer} heght - the height of the game screen in pixels
    */
  constructor(width, height,tilemapData) {
    this._start = null;
    this.WIDTH = width;
    this.HEIGHT = height;
    this.input = new Input();
    this.entities = [];
    this.tilemap = new Tilemap(tilemapData);
    console.log(this.tilemap);

    // Set up the back buffer
    this.backBuffer = document.createElement('canvas');
    this.backBuffer.width = this.WIDTH;
    this.backBuffer.height = this.HEIGHT;
    this.backBufferCtx = this.backBuffer.getContext('2d');

    // Set up the screen buffer
    this.screenBuffer = document.createElement('canvas');
    this.screenBuffer.width = this.WIDTH;
    this.screenBuffer.height = this.HEIGHT;
    this.screenBufferCtx = this.screenBuffer.getContext('2d');
    document.body.append(this.screenBuffer);
  }
  /** @method addEntity
    * Adds an entity to the game world
    * Entities should have an update() and render()
    * method.
    * @param {Object} entity - the entity.
    */
  addEntity(entity) {
    this.entities.push(entity);
  }
  /** @method update
    * Updates the game state
    * @param {integer} elapsedTime - the number of milliseconds per frame
    */
  update(elapsedTime) {

    // Update game entitites
    this.entities.forEach((entity) => {

      var x = entity.x;
      var y = entity.y;
      var next = Calculate.getNext(x,y,this.input);
      var data = this.tilemap.tileAt(next[0], next[1], 0, this.input);
      var data2 = this.tilemap.tileAt(next[2], next[3], 0, this.input);
      if(data&& !data.solid && data2 && !data2.solid) entity.update(elapsedTime, this.input);
    });

    // Swap input buffers
    this.input.update();
  }
  /** @method render
    * Renders the game state
    * @param {integer} elapsedTime - the number of milliseconds per frame
    */
  render(elapsedTime) {
    // Clear the back buffer
    this.backBufferCtx.fillStyle = "white";
    this.backBufferCtx.fillRect(0,0,this.WIDTH, this.HEIGHT);

    // TODO: Render game
    this.tilemap.render(this.backBufferCtx);

    // Render entities
    this.entities.forEach(entity => entity.render(elapsedTime, this.backBufferCtx));

    // Flip the back buffer
    this.screenBufferCtx.drawImage(this.backBuffer, 0, 0);
  }
  /** @method loop
    * Updates and renders the game,
    * and calls itself on the next draw cycle.
    * @param {DOMHighResTimestamp} timestamp - the current system time
    */
  loop(timestamp) {
    var elapsedTime = this._frame_start ? timestamp - this._frame_start : 0;
    this.update(elapsedTime);
    this.render(elapsedTime);
    this._frame_start = timestamp;
    window.requestAnimationFrame((timestamp) => {this.loop(timestamp)});
  }
}

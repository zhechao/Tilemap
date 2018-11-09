export function getlayer(x,y,input){
  var fx = x - (x % 32);
  var fy = y - (y % 32);
  var row = fy / 32;
  var col = fx / 32;
  return row * 32 + col;
}

export function getNext(x, y, input){
  var rx = x;
  var dx = rx;
  var ry = y;
  var dy = ry;
  if(input.keyPressed("ArrowLeft")) {
    rx--;
  }
  if(input.keyPressed("ArrowRight")) {
    rx ++;
  }
  if(input.keyPressed("ArrowUp")) {
    ry--;
  }
  if(input.keyPressed("ArrowDown")) {
    ry ++;
  }
  return [rx,ry,dx,dy];
}

let drops = [];
let theta = 0;
let val = 4;
let inc = 1 / 32;

const circleDetail = 50;
let palette;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL); // 设置为WEBGL渲染模式
  background(0); // 黑色背景

  // 使用图片中的配色
  palette = [
    color(255, 0, 127),  // 亮粉色
    color(255, 204, 0),  // 亮黄色
    color(0, 204, 204),  // 青色
    color(255, 51, 51),  // 鲜红色
    color(153, 51, 255), // 紫色
    color(0, 153, 204),  // 天蓝色
    color(255, 102, 0),  // 橙色
    color(204, 255, 102) // 柠檬黄
  ];
}

function draw() {
  orbitControl();

  let v = pedal(120, 7, theta);

  if (frameCount < 480) {
    let total = (val / 2) * 3;
    for (let n = 0; n < total; n += 8) {
      let r = map(n, 0, total, 9, 2);
      let outerR = map(n, 0, total, 6, 1);

      for (let i = 0; i < 3; i++) {
        addInk(v.x, v.y, r, random(palette), map(n, 0, total, 0, 100));
        if (n > total / 2) {
          addInk(v.x, v.y, outerR, random(palette), map(n, 0, total, 0, 100));
        }
      }
    }

    val += 0.18;
    theta += 1 + inc * PI;
  } else {
    noLoop();
  }

  for (let drop of drops) {
    drop.show();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
}

function addInk(x, y, r, col, z) {
  let drop = new Drop(x, y, r, col, z);
  for (let other of drops) {
    other.marble(drop);
  }
  drops.push(drop);
}

class Drop {
  constructor(x, y, r, col, z) {
    this.center = createVector(x, y, z);
    this.r = r;
    this.col = col;
  }

  marble(other) {
    let p = this.center.copy().sub(other.center);
    let m = p.mag();
    let root = sqrt(1 + (this.r * this.r) / (m * m));
    p.mult(root).add(other.center);
    this.center.set(p);
  }

  show() {
    fill(this.col);
    noStroke();
    push();
    translate(this.center.x, this.center.y, this.center.z);
    sphere(this.r);
    pop();
  }
}

function pedal(sc, n, theta) {
  let r = (n - 2) * sin((n / (n - 2)) * (theta + 0.5 * PI));
  let x = sc * r * cos(theta);
  let y = sc * r * sin(theta);
  return createVector(x, y, 0);
}


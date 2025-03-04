let molds = [];
let num = 4000;
let d;
let colors = [];
let origins = []; // 6 个起点，包括 5 个随机点和 1 个中心点

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  d = pixelDensity();

  // 颜色渐变参考
  colors = [
    color(243, 130, 154), // 粉红
    color(225, 48, 59),   // 红色
    color(212, 220, 159), // 淡黄绿
    color(19, 55, 112),   // 深蓝
    color(11, 102, 161)   // 亮蓝
  ];

  // 生成 5 个随机起点
  for (let i = 0; i < 5; i++) {
    origins.push(createVector(random(width), random(height)));
  }
  // 添加一个位于画布中心的起点
  origins.push(createVector(width / 2, height / 2));

  for (let i = 0; i < num; i++) {
    let origin = random(origins); // 选取一个起点
    molds[i] = new Mold(origin.x, origin.y, random(colors)); // 给每个 mold 赋予随机颜色
  }
}

function draw() {
  background(0, 5);
  loadPixels();

  for (let i = 0; i < num; i++) {
    molds[i].update();
    molds[i].display();
  }
}

class Mold {
  constructor(x, y, col) {
    this.x = x + random(-20, 20); // 让它们在起点附近生成
    this.y = y + random(-20, 20);
    this.r = 0.5;
    this.heading = random(360);
    this.vx = cos(this.heading);
    this.vy = sin(this.heading);
    this.rotAngle = 45;
    this.color = col; // 颜色属性

    // 传感器
    this.rSensorPos = createVector(0, 0);
    this.lSensorPos = createVector(0, 0);
    this.fSensorPos = createVector(0, 0);
    this.sensorAngle = 45;
    this.sensorDist = 10;
  }

  update() {
    this.vx = cos(this.heading);
    this.vy = sin(this.heading);

    // 让它们在整个画布上循环
    this.x = (this.x + this.vx + width) % width;
    this.y = (this.y + this.vy + height) % height;

    // 获取传感器位置
    this.getSensorPos(this.rSensorPos, this.heading + this.sensorAngle);
    this.getSensorPos(this.lSensorPos, this.heading - this.sensorAngle);
    this.getSensorPos(this.fSensorPos, this.heading);

    // 计算传感器读取的像素值
    let index, l, r, f;
    index = 4 * (d * floor(this.rSensorPos.y)) * (d * width) + 4 * (d * floor(this.rSensorPos.x));
    r = pixels[index];

    index = 4 * (d * floor(this.lSensorPos.y)) * (d * width) + 4 * (d * floor(this.lSensorPos.x));
    l = pixels[index];

    index = 4 * (d * floor(this.fSensorPos.y)) * (d * width) + 4 * (d * floor(this.fSensorPos.x));
    f = pixels[index];

    // 控制移动方向
    if (f > l && f > r) {
      this.heading += 0;
    } else if (f < l && f < r) {
      this.heading += random([this.rotAngle, -this.rotAngle]);
    } else if (l > r) {
      this.heading += -this.rotAngle;
    } else if (r > l) {
      this.heading += this.rotAngle;
    }
  }

  display() {
    noStroke();
    fill(this.color); // 使用渐变色
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
  }

  getSensorPos(sensor, angle) {
    sensor.x = (this.x + this.sensorDist * cos(angle) + width) % width;
    sensor.y = (this.y + this.sensorDist * sin(angle) + height) % height;
  }
}

let spreads = [];
let spreadDuration = 6000; // 每个蔓延效果持续6秒

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0); // 黑色背景
}

function draw() {
  // 使用带残影的背景，制造运动轨迹效果
  background(0, 50);

  // 遍历所有的蔓延效果
  for (let i = spreads.length - 1; i >= 0; i--) {
    let s = spreads[i];
    s.update();
    s.show();

    // 当蔓延效果超过6秒后，将其移除
    if (millis() - s.startTime > spreadDuration) {
      spreads.splice(i, 1);
    }
  }
}

// 每次鼠标点击时产生新的“蔓延”效果
function mousePressed() {
  spreads.push(new Spread(mouseX, mouseY));
}

// 画布自适应窗口大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// 蔓延效果类：管理一组粒子
class Spread {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.particles = []; // 存储所有粒子（小点和圆圈）
    this.startTime = millis();
    // 每次点击产生的粒子总数量随机
    this.maxParticles = floor(random(100, 400));
    // 每次点击产生的粒子大小范围随机
    this.minSize = random(5, 15);
    this.maxSize = random(20, 50);
    
    // 初始生成一定数量的粒子（数量随机）
    let initialCount = floor(random(5, 20));
    for (let i = 0; i < initialCount; i++) {
      this.addParticle();
    }
  }
  
  update() {
    // 如果总粒子数未达上限，持续添加新粒子
    if (this.particles.length < this.maxParticles) {
      this.addParticle();
    }
    
    // 遍历更新每个粒子
    for (let i = this.particles.length - 1; i >= 0; i--) {
      let p = this.particles[i];
      p.update();
      
      // 模拟繁殖：当粒子生命值低于阈值时，以一定概率在其附近产生新粒子
      if (p.lifespan < 50 && random() < 0.05) {
        this.particles.push(new Particle(
          p.x, 
          p.y, 
          random(TWO_PI), 
          p.speed * random(0.8, 1.2), 
          p.size * random(0.8, 1.2)
        ));
      }
      
      // 如果粒子完全死亡，则移除它
      if (p.lifespan <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }
  
  show() {
    for (let p of this.particles) {
      p.show();
    }
  }
  
  addParticle() {
    let angle = random(TWO_PI);          // 随机扩散角度
    let speed = random(0.5, 2) * random(0.5, 1.5); // 随机扩散速度
    let size = random(this.minSize, this.maxSize);  // 随机粒子大小
    this.particles.push(new Particle(this.x, this.y, angle, speed, size));
  }
}

// 粒子类：代表单个细菌（小点或圆圈）
class Particle {
  constructor(x, y, angle, speed, size) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.speed = speed;
    this.size = size;
    this.lifespan = 255;  // 初始生命值
    // 随机生成一个彩色（各通道独立），alpha 用生命值控制
    this.color = color(random(255), random(255), random(255), this.lifespan);
    // 30% 的概率绘制空心圆（边框粗为2），其余绘制实心圆
    this.type = random() < 0.3 ? "hollow" : "filled";
  }
  
  update() {
    // 粒子沿扩散方向移动
    this.x += cos(this.angle) * this.speed;
    this.y += sin(this.angle) * this.speed;
    // 粒子缓慢缩小
    this.size *= 0.98;
    // 生命值衰减
    this.lifespan -= 2;
    // 更新颜色的透明度
    this.color = color(red(this.color), green(this.color), blue(this.color), this.lifespan);
  }
  
  show() {
    if (this.type === "hollow") {
      noFill();
      stroke(this.color);
      strokeWeight(2);
      ellipse(this.x, this.y, this.size);
    } else {
      noStroke();
      fill(this.color);
      ellipse(this.x, this.y, this.size);
    }
  }
}
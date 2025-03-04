let img;
let imgHovered = false; // Track whether the mouse is hovering over the image

function preload() {
  // Preload the image
  img = loadImage('page1.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(DEGREES);
  strokeWeight(5);
}

function draw() {
  background(8, 8, 8);

  // Adjust the view
  orbitControl();

  // Slowly rotate the entire scene for a dynamic effect
  rotateX(30);
  rotateY(frameCount * 0.1);

  // Define the radius and rotation speed for three circular rings
  let radii = [300, 400, 500]; // Radii of the three circles
  let speeds = [0.5, 0.8, 1.2]; // Individual rotation speeds

  for (let i = 0; i < 3; i++) {
    let radius = radii[i];
    let speed = speeds[i];

    // Draw cubes along each circular ring
    for (let zAngle = 0; zAngle < 180; zAngle += 2) {
      for (let xAngle = 0; xAngle < 360; xAngle += 60) {
        push();

        // Each ring has its independent rotation speed
        rotateZ(zAngle + frameCount * speed);
        rotateX(xAngle);

        // Translate based on radius
        translate(0, radius, 0);

        // ✨ Add a glowing effect
        glow(255, 0, 0, 120); // Red glow
       
        box(10); // Control cube size
        pop();
      }
    }

    // Add an image to the third ring
    if (i === 2) {
      push();
      // Synchronize image rotation with the cubes
      rotateZ(frameCount * speed);
      translate(0, 0, 0);
      rotateX(180); // Align the image with the circular ring

      // If the mouse hovers over the image, show hint text
      if (mouseOverImage()) {
        fill(0);
        textSize(20);
        text("Click to continue", width / 2 - 80, height / 2 + 180);
      }

      // ✨ If the mouse is hovering, add a white glowing border
      if (imgHovered) {
        glow(255, 255, 255, 150); // White glow
      } else {
        noStroke(); // No glowing border
      }

      texture(img); // Apply texture
      plane(300, 300); // Display image size
      pop();
    }
  }
}

// Function to detect if the mouse is over the image
function mouseOverImage() {
  return mouseX > width / 2 - 150 && mouseX < width / 2 + 150 &&
         mouseY > height / 2 - 150 && mouseY < height / 2 + 150;
}

// 🌟 Custom glow effect function
function glow(r, g, b, intensity) {
  drawingContext.shadowBlur = intensity; // Control glow intensity
  drawingContext.shadowColor = color(r, g, b); // Set glow color
}
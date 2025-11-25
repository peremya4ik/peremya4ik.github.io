// sketch.js
function setup() {
    createCanvas(windowWidth, windowHeight);
    background(30);
}

function draw() {
    fill(255, 50);
    noStroke();
    ellipse(mouseX, mouseY, 40, 40);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
let escena = 0;
let estatua, info, banner, bgMenu, bgCleaning;
let estaVisibleInfo = false;
let cleanliness = 0;
let message = "";
let infoWhite;
let fondoLouvre;

// statue geometry (normal mode)
let statueX = 150, statueY = 40, statueW = 300, statueH = 400;

// Treatment counters
let cepilloCount = 0;
let vinagreCount = 0;
let agarCount = 0;
let alcoholCount = 0;

let infoVisibleCleaning = false;

// intro message variable
let showIntroCleaning = false;

// Louvre mode (no fading)
let showLouvre = false;

// Info button params
let infoX = 550, infoY = 20, infoW = 40, infoH = 40;

// Fade-out for felicitaciones
let felicidadesAlpha = 255;

// Music & sound icons
let sonido;
let muteIcon, soundIcon;
let isMuted = false;

function preload() {
  estatua = loadImage("lapena.png");
  info = loadImage("info.png");
  banner = loadImage("banner.png");
  bgMenu = loadImage("fondo1.jpg");
  bgCleaning = loadImage("storage.jpg");
  infoWhite = loadImage("info white.png");
  fondoLouvre = loadImage("fondoLouvre.jpg");

  sonido = loadSound("sonido.mp3");
  muteIcon = loadImage("mute.png");
  soundIcon = loadImage("sound.png");
}

function setup() {

  let canvas = createCanvas(600, 600);
  canvas.parent("canvas-container");
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
}

function draw() {
  background(0);

  if (escena === 0) {
    drawMenu();
  } else if (escena === 1) {
    drawCleaning();
  }
}

function drawMenu() {
  tint(255, 180);
  image(bgMenu, 0, 0, width, height);
  noTint();

  fill(255, 230);
  rect(width / 2, 80, 420, 60, 20);
  fill(0);
  textSize(26);
  text("🧼 Desafío de Limpieza 🪥", width / 2, 80);

  let hover = mouseX > 200 && mouseX < 400 && mouseY > 340 && mouseY < 390;
  fill(hover ? 240 : 255);
  rect(width / 2, 370, 200, 50, 12);
  fill(0);
  textSize(22);
  text("Iniciar", width / 2, 370);

  image(info, infoX, infoY, infoW, infoH);

  if (estaVisibleInfo) {
    fill(255, 230);
    rect(435, 185, 230, 130, 15);
    image(banner, 330, 120, 210, 130);
    fill(0);
    textSize(14);
    text("Creado por\n Aleksandra Valieva\n07/09/2025", 435, 180);
  }
}

function drawCleaning() {
  // Background
  if (showLouvre) {
    image(fondoLouvre, 0, 0, width, height);
  } else {
    tint(255, 180);
    image(bgCleaning, 0, 0, width, height);
    noTint();
  }

  // Statue brightness
  let brightness = map(cleanliness, 0, 100, 120, 255);
  tint(brightness);

  if (!showLouvre) {
    image(estatua, statueX, statueY, statueW, statueH);
  } else {
    let w = 280;
    let h = w * 1.33;
    let x = width / 2 - w / 2;
    let y = height - h - 20;
    image(estatua, x, y, w, h);
  }

  noTint();

  // Initial message
  if (showIntroCleaning) {
    fill(230);
    rect(width/2, height/2, 492, 90, 15);
    fill(0);
    textSize(15);
    text(
      "¡Felicitaciones! La estatua fue invitada al Louvre para una expo.\n¿Podrías encontrar la mejor combinación de herramientas para limpiarla?",
      width/2, height/2
    );
    return;
  }

  // Buttons
  drawButton(70, 35, "Volver", 100, 30);
  drawButton(70, 75, "Reiniciar", 100, 30);

  if (!showLouvre) {
    drawButton(110, 480, "Cepillo");
    drawButton(230, 480, "Vinagre");
    drawButton(350, 480, "Agar-Agar");
    drawButton(470, 480, "Alcohol");
  }

  if (!showLouvre) image(infoWhite, infoX, infoY, infoW, infoH);

  // Progress bar
  if (!showLouvre) {
    let barW = 300, barH = 20, barX = width / 2 - barW / 2, barY = height - 50;
    noStroke();
    fill(255, 255, 255, 120);
    rectMode(CORNER);
    rect(barX, barY, barW, barH, 10);
    fill(255, 215, 0);
    rect(barX, barY, (cleanliness / 100) * barW, barH, 10);
    rectMode(CENTER);
  }

  // Info panel
  if (infoVisibleCleaning && !showLouvre) {
    fill(255, 240);
    rect(460, 115, 240, 80, 10);
    fill(0);
    textSize(14);
    text("Técnica/Material: Vaciado de yeso\nMedidas: 165x56x53 cm\nAño: 1915", 460, 115);
  }

  // Felicitaciones fade
  if (message === "¡Perfecto! Desafío aprobado, felicitaciones!") {
    fill(230, felicidadesAlpha);
    rect(180, 420, 350, 45, 10);
    fill(0, felicidadesAlpha);
    textSize(13);
    text(message, 180, 420, 320, 50);

    felicidadesAlpha -= 3;
    if (felicidadesAlpha <= 0) {
      message = "";
      felicidadesAlpha = 255;
    }
  } else if (message !== "") {
    fill(230);
    rect(180, 420, 350, 45, 10);
    fill(0);
    textSize(13);
    text(message, 180, 420, 320, 50);
  }

  // Sound/Mute icon on Louvre screen
  if (showLouvre) {
    let iconSize = 40;
    let iconX = width - iconSize - 30;
    let iconY = height - iconSize - 20;
    if (isMuted || !sonido.isPlaying()) {
      image(soundIcon, iconX, iconY, iconSize, iconSize);
    } else {
      image(muteIcon, iconX, iconY, iconSize, iconSize);
    }

    // play music if not already
    if (!isMuted && !sonido.isPlaying()) {
      sonido.loop();
    }
  }
}

function drawButton(x, y, label, w = 100, h = 40) {
  let hover =
    mouseX > x - w/2 &&
    mouseX < x + w/2 &&
    mouseY > y - h/2 &&
    mouseY < y + h/2;

  fill(hover ? 220 : 200);
  rect(x, y, w, h, 10);
  fill(0);
  textSize(16);
  text(label, x, y);
}

function mousePressed() {
  if (escena === 0) {
    if (mouseX > 200 && mouseX < 400 && mouseY > 340 && mouseY < 390) {
      escena = 1;
      showIntroCleaning = true;
    } else if (
      mouseX > infoX && mouseX < infoX + infoW &&
      mouseY > infoY && mouseY < infoY + infoH
    ) {
      estaVisibleInfo = !estaVisibleInfo;
    }
    message = "";
  } else if (escena === 1) {
    if (showIntroCleaning) {
      showIntroCleaning = false;
      return;
    }

    // Volver
    if (mouseX > 20 && mouseX < 120 && mouseY > 10 && mouseY < 50) {
      escena = 0;
      cleanliness = 0;
      showLouvre = false;
      resetTreatmentCounters();
      infoVisibleCleaning = false;
      message = "";
      if (sonido.isPlaying()) sonido.stop();
      return;
    }

    // Reiniciar
    if (mouseX > 20 && mouseX < 120 && mouseY > 50 && mouseY < 100) {
      cleanliness = 0;
      message = "";
      showLouvre = false;
      resetTreatmentCounters();
      felicidadesAlpha = 255;
      if (sonido.isPlaying()) sonido.stop();
      return;
    }

    // Info
    if (
      mouseX > infoX && mouseX < infoX + infoW &&
      mouseY > infoY && mouseY < infoY + infoH
    ) {
      if (!showLouvre) infoVisibleCleaning = !infoVisibleCleaning;
      return;
    }

    // Sound icon toggle
    if (showLouvre) {
      let iconSize = 40;
      let iconX = width - iconSize - 30;
      let iconY = height - iconSize - 20;
      if (mouseX > iconX && mouseX < iconX + iconSize &&
          mouseY > iconY && mouseY < iconY + iconSize) {
        isMuted = !isMuted;
        if (isMuted && sonido.isPlaying()) sonido.stop();
        else if (!isMuted) sonido.loop();
        return;
      }
    }

    // Disable tools in Louvre
    if (showLouvre) return;

    if (isOver(110, 480)) handleTreatment("Cepillo");
    else if (isOver(230, 480)) handleTreatment("Vinagre");
    else if (isOver(350, 480)) handleTreatment("Agar-Agar");
    else if (isOver(470, 480)) handleTreatment("Alcohol");
  }
}

function isOver(x, y, w = 100, h = 40) {
  return mouseX > x - w/2 &&
         mouseX < x + w/2 &&
         mouseY > y - h/2 &&
         mouseY < y + h/2;
}

function handleTreatment(treatment) {
  if (treatment === "Cepillo") {
    if (cepilloCount < 5) {
      message = "";
      cleanliness = min(cleanliness + 7, 100);
      cepilloCount++;
      if (cepilloCount === 5) {
        message = "¡Empezaste muy bien! Ahora busca un método aún más eficaz para seguir";
      }
    }
  } else if (treatment === "Agar-Agar") {
    if (cepilloCount === 0) {
      cleanliness = min(cleanliness + 10, 80);
      message = "Bien, pero podrías empezar con la otra herramienta primero";
    } else {
      cleanliness = min(cleanliness + 20, 100);
      message = "";
      if (cleanliness >= 100) {
        message = "¡Perfecto! Desafío aprobado, felicitaciones!";
        felicidadesAlpha = 255;
        showLouvre = true;
      }
    }
  } else if (treatment === "Vinagre") {
    cleanliness = max(cleanliness - 5, 0);
    vinagreCount++;
    message = "¡Ay no! Fíjate bien el material de la estatua en la info y probá de nuevo";
  } else if (treatment === "Alcohol") {
    cleanliness = max(cleanliness - 5, 0);
    alcoholCount++;
    message = "¡Alcohol es muy agresivo para el yeso, ¿no te parece?";
  }
}

function resetTreatmentCounters() {
  cepilloCount = 0;
  vinagreCount = 0;
  agarCount = 0;
  alcoholCount = 0;
}


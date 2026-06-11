let columnas = 24;
let filas = 24;
let tamanoCelda;
let tamanoLienzo;

let mic;
let semillaComposicion = 0;
let ultimoAplauso = 0;

let coloresLeParc = [
  '#E30613', '#EA5514', '#F39200', '#FFF200', '#A0C814',
  '#009B4E', '#008984', '#007FA4', '#005CA9', '#2E3192',
  '#662D91', '#92278F', '#D71463', '#E5006D'
];

function setup() {
  ajustarDimensiones();
  createCanvas(tamanoLienzo, tamanoLienzo);
  rectMode(CENTER);

  mic = new p5.AudioIn();
  mic.start();
}

function draw() {
  background(240);

  let volumen = mic.getLevel();

  if (getAudioContext().state !== 'running') {
    fill(50);
    textAlign(CENTER, CENTER);
    textSize(18);
    text("Hacé CLIC en la pantalla para activar el micrófono.", width / 2, height / 2);
    return;
  }

  // 1. APLAUSO (Sonido fuerte) -> Cambia de color
  // Bajado a 0.09 para asegurarnos de que capture tu aplauso de 0.169
  if (volumen >= 0.09 && millis() - ultimoAplauso > 400) {
    semillaComposicion = random(10000);
    ultimoAplauso = millis();
  }

  // Fijamos la semilla para que los colores se queden quietos en el silencio
  randomSeed(semillaComposicion);

  // 2. DIBUJAR LA GRILLA
  for (let i = 0; i < columnas; i++) {
    for (let j = 0; j < filas; j++) {

      let x = i * tamanoCelda + tamanoCelda / 2;
      let y = j * tamanoCelda + tamanoCelda / 2;

      let colFondo = random(coloresLeParc);
      let colForma = random(coloresLeParc);

      while (colForma === colFondo) {
        colForma = random(coloresLeParc);
      }

      let esCuadrado = random() > 0.5;

      // Fondo de la celda
      fill(colFondo);
      noStroke();
      rect(x, y, tamanoCelda, tamanoCelda);

      let moverX = 0;
      let moverY = 0;

      // 3. VOZ (Sonido intermedio) -> Solo vibra
      // La vibración ahora actúa solo si el volumen no llega a ser un aplauso (menor a 0.09)
      if (esCuadrado && volumen > 0.005 && volumen < 0.09) {
        let rangoVibracion = map(volumen, 0.005, 0.09, 3, 12);

        // Math.random() nativo para proteger la estabilidad de los colores
        moverX = (Math.random() * rangoVibracion * 2) - rangoVibracion;
        moverY = (Math.random() * rangoVibracion * 2) - rangoVibracion;
      }

      // Figura interna
      fill(colForma);
      if (esCuadrado) {
        rect(x + moverX, y + moverY, tamanoCelda * 0.6, tamanoCelda * 0.6);
      } else {
        ellipse(x, y, tamanoCelda * 0.5, tamanoCelda * 0.5);
      }
    }
  }

  // MONITOR DE VOLUMEN FLOTANTE
  push(); 
  rectMode(CORNER);
  fill(0, 200); 
  rect(15, 15, 180, 45, 5); 
  fill(0, 255, 0); 
  textSize(18);
  textAlign(LEFT, CENTER);
  text("Volumen: " + volumen.toFixed(3), 30, 37);
  pop(); 
}

function ajustarDimensiones() {
  tamanoLienzo = min(windowWidth, windowHeight);
  tamanoCelda = tamanoLienzo / columnas;
}

function windowResized() {
  ajustarDimensiones();
  resizeCanvas(tamanoLienzo, tamanoLienzo);
}

function activarAudio() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
    userStartAudio();
  }
}

function mousePressed() {
  activarAudio();
}

function touchStarted() {
  activarAudio();
}

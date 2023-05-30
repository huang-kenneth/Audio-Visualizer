var song
var img
var fft
var particles = []

function preload() {
    song = loadSound('Cupid.mp3')
    img = loadImage('background.png')
}

function setup() {
    createCanvas(windowWidth, windowHeight)
    angleMode(DEGREES)
    imageMode(CENTER)
    rectMode(CENTER)
    fft = new p5.FFT(0.9, 256)

    img.filter(BLUR, 0)

    noLoop()
}

function draw() {
    background(0)

    // put circle in the middle
    translate(width / 2, height / 2)

    // get beat detection
    fft.analyze()
    amp = fft.getEnergy(20, 200)

    push()
    if (amp > 240) {
        rotate((amp - 240) / 15 - 0.5);
    }
    // for background 
    image(img, 0, 0, width, height)
    pop()

    // for alpha layer
    var alpha = map(amp, 0, 255, 180, 150)
    fill(0, alpha)
    rect(0, 0, width, height)

    // for circle
    stroke(255)
    strokeWeight(3)
    noFill()
    
    var wave = fft.waveform()
    for (t = -1; t <= 1; t += 2) {
        beginShape()
        for (var i = 0; i <= 180; i += 0.5) {
            var index = floor(map(i, 0, 180, 0, wave.length - 1))

            var r = map(wave[index], -1, 1, 150, 350)

            var x = r * sin(i) * t
            var y = r * cos(i)
            
            vertex(x, y)
        }
    endShape()
    }
    var p = new Particle()
    particles.push(p)
    
    for (var i = 0; i < particles.length; i++) {
        particles[i].update(amp > 5, amp > 200, amp > 220)
        particles[i].show()
    }
}

function mousePressed() {
    if (song.isPlaying()) {
        song.pause()
        noLoop()
    } else {
        song.play()
        loop()
    }
}

class Particle {
    constructor() {
        this.pos = p5.Vector.random2D().mult(250)
        this.vel = p5.Vector.random2D().mult(0)
        this.acc = this.pos.copy().mult(random(0.0001, 0.00001))

        this.w = random(3, 5)
    }

    update(soundPlaying, cond1, cond2) {
        this.vel.add(this.acc)
        if (soundPlaying) {
            this.pos.add(this.vel)
            if (cond1) {
                this.pos.add(this.vel)
            }
            if (cond2) {
                this.pos.add(this.vel)
                this.pos.add(this.vel)
            }
        }
    }
    edges() {
        if (this.pos.x < -width / 2 || this.pos.x > width / 2 || 
        this.pos.y < -height / 2 || this.pos.y > height / 2) {
            this.pos = p5.Vector.random2D().mult(250)
            this.vel = p5.Vector.random2D().mult(0)
            this.acc = this.pos.copy().mult(random(0.0001, 0.00001))
        }
    }
    show() {
        noStroke()
        fill(255)
        ellipse(this.pos.x, this.pos.y, this.w)
    }
}
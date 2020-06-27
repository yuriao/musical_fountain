import { Template } from 'meteor/templating';
import './main.html';

import * as Tone from "tone";
import p5 from '/public/p5.js'

var lowPass = new Tone.Filter({
    "frequency" : 14000,
}).toMaster();

var openHiHat = new Tone.NoiseSynth({
    "filter" : {
        "Q" : 1
    },
    "envelope" : {
        "attack" : 0.01,
        "decay" : 0.3
    },
    "filterEnvelope" : {
        "attack" : 0.01,
        "decay" : 0.03,
        "baseFrequency" : 4000,
        "octaves" : -2.5,
        "exponent" : 4,
    }
}).connect(lowPass);

var openHiHatPart = new Tone.Part(function(time){
    openHiHat.triggerAttack(time);
}, [{ "8n" : 2 }, { "8n" : 6 }]); //.start(0) on nusic template rendered

var closedHiHat = new Tone.NoiseSynth({
    "filter" : {
        "Q" : 1
    },
    "envelope" : {
        "attack" : 0.01,
        "decay" : 0.15
    },
    "filterEnvelope" : {
        "attack" : 0.01,
        "decay" : 0.03,
        "baseFrequency" : 4000,
        "octaves" : -2.5,
        "exponent" : 4,

    }
}).connect(lowPass);

var closedHatPart = new Tone.Part(function(time){
    closedHiHat.triggerAttack(time);
}, [0, { "16n" : 1 }, { "8n" : 1 }, { "8n" : 3 }, { "8n" : 4 }, { "8n" : 5 }, { "8n" : 7 }, { "8n" : 8 }]);

//BASS
var bassEnvelope = new Tone.AmplitudeEnvelope({
    "attack" : 0.01,
    "decay" : 0.2,
    "sustain" : 0,
}).toMaster();

var bassFilter = new Tone.Filter({
    "frequency" : 600,
    "Q" : 8
});

var bass = new Tone.PulseOscillator("A2", 0.4).chain(bassFilter, bassEnvelope);

var bassPart = new Tone.Part(function(time, note){
    bass.frequency.setValueAtTime(note, time);
    bassEnvelope.triggerAttack(time);
}, [["0:0", "A1"],
    ["0:2", "G1"],
    ["0:2:2", "C2"],
    ["0:3:2", "A1"]]);

//BLEEP
var bleepEnvelope = new Tone.AmplitudeEnvelope({
    "attack" : 0.01,
    "decay" : 0.4,
    "sustain" : 0,
}).toMaster();

var bleep = new Tone.Oscillator('A4').connect(bleepEnvelope);

var bleepLoop = new Tone.Loop(function(time){
     bleepEnvelope.triggerAttack(time);
}, "2n");

//KICK
var kickEnvelope = new Tone.AmplitudeEnvelope({
    "attack" : 0.01,
    "decay" : 0.2,
    "sustain" : 0,
}).toMaster();

var kick = new Tone.Oscillator("G2").connect(kickEnvelope);

//bleep.connect(kickEnvelope);

var kickSnapEnv = new Tone.FrequencyEnvelope({
    "attack" : 0.005,
    "decay" : 0.01,
    "sustain" : 0,
    "baseFrequency" : "A2",
    "octaves" : 2.7
}).connect(kick.frequency);

var kickPart = new Tone.Part(function(time){
    kickEnvelope.triggerAttack(time);
    kickSnapEnv.triggerAttack(time);
}, ["0", "0:0:3", "0:2:2", "0:3:1"]);

Tone.Transport.loopStart = 0;
Tone.Transport.loopEnd = "1:0";
Tone.Transport.loop = true;
//musical elements end

// mixer elements
var mixctrl1;
var mixctrl2;
var mixctrl3;
var mixctrl4;
var mixctrl5;

// other parameters
var music_start=0;
var mamp=0;
var mamp1=0;
var mamp2=0;
var mamp3=0;
var mamp4=0;
var mamp5=0;

// functions
Template.fountain_area.onRendered(function() {
  // counter starts at 0
    canvas = document.getElementById("fcanvas");
    ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight*0.85;

    balls1 = [];
    balls2 = [];
    balls3 = [];
    balls4 = [];
    balls5 = [];
    numBalls = 100;
    color1 = 0;
    color2 = 0;
    color3 = 0;
    color4 = 0;
    color5 = 0;
    
    var Circle = function() {
        this.radius = 5;
        this.x = canvas.width / 2;
        this.y = 10;
        this.vx = Math.random() * 1 - 1;
        this.vy = Math.random() * -2 - 6;
        this.color = 'red';
    };

    Circle.prototype.drawcir = function() {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    };

    for (var i = 0; i < numBalls; ++i) {
        balls1.push(new Circle());
        balls2.push(new Circle());
        balls3.push(new Circle());
        balls4.push(new Circle());
        balls5.push(new Circle());
    }

    (function drawFrame() {
        requestAnimationFrame(drawFrame);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        mamp1=(openHiHat.envelope.value*1+closedHiHat.envelope.value*0.3+bassEnvelope.value*0.3+bleepEnvelope.value*0.3+kickEnvelope.value*0.3)*(openHiHat.volume.value+40);
        mamp2=(openHiHat.envelope.value*0.3+closedHiHat.envelope.value*1+bassEnvelope.value*0.3+bleepEnvelope.value*0.3+kickEnvelope.value*0.3)*(closedHiHat.volume.value+40);
        mamp3=(openHiHat.envelope.value*0.3+closedHiHat.envelope.value*0.3+bassEnvelope.value*1+bleepEnvelope.value*0.3+kickEnvelope.value*0.3)*(bass.volume.value+10);
        mamp4=(openHiHat.envelope.value*0.3+closedHiHat.envelope.value*0.3+bassEnvelope.value*0.3+bleepEnvelope.value*1+kickEnvelope.value*0.3)*(bleep.volume.value+10);
        mamp5=(openHiHat.envelope.value*0.3+closedHiHat.envelope.value*0.3+bassEnvelope.value*0.3+bleepEnvelope.value*0.3+kickEnvelope.value*1)*(kick.volume.value+20);
        console.log(bass.volume.value);
        balls1.forEach(function (item, index) {
            draw_fountain(canvas.width*0.07,color1,item,mamp1)
        });
        balls2.forEach(function (item, index) {
            draw_fountain(canvas.width*0.19,color2,item,mamp2)
        });
        balls3.forEach(function (item, index) {
            draw_fountain(canvas.width*0.31,color3,item,mamp3+10)
        });
        balls4.forEach(function (item, index) {
            draw_fountain(canvas.width*0.43,color4,item,mamp4)
        });
        balls5.forEach(function (item, index) {
            draw_fountain(canvas.width*0.55,color5,item,mamp5)
        });

        color1=color1+Math.random() * 2;
        color2=color2+Math.random() * 3;
        color3=color3+Math.random() * 4;
        color4=color4+Math.random() * 5;
        color5=color5+Math.random() * 6;
        
    })(); // self-invoking function

});

Template.music_area.onRendered(function() {
    
    mixctrl1 = document.getElementById("musical1");
    mixctrl2 = document.getElementById("musical2");
    mixctrl3 = document.getElementById("musical3");
    mixctrl4 = document.getElementById("musical4");
    mixctrl5 = document.getElementById("musical5");
    
    var phase = 0;

    let sketch = function(p) {
        p.setup = function(){
          p.createCanvas(window.innerWidth*0.31, window.innerHeight*0.60);
          p.background(255);
          p.strokeWeight(1);
          p.rectMode(p.CENTER);
        }

        p.draw = function(){
            p.background(255);
            p.stroke(1);
            //drawing the kick wave at the bottom
            //it is composed of a simple sine wave that
            //changes in height with the kick envelope
            for (var i = 10; i < window.innerWidth*0.31-10; i++){
                //scaling kickEnvelope value by 200 
                //since default is 0-1
                var kickValue = kickEnvelope.value * 150*(kick.volume.value+20)/40;
                var bassValue = bassEnvelope.value * 150*(bass.volume.value+10)/10;
                var bleepValue = bleepEnvelope.value * 150*(bleep.volume.value+10)/10;
                //multiplying this value to scale the sine wave 
                //depending on x position
                var yDot = Math.sin((i / 60) + phase) * kickValue;
                var yDot2 = Math.sin((i / 60) + phase) * bassValue;
                var yDot3 = Math.sin((i / 60) + phase) * bleepValue;
                p.point(i, 370 -150 + yDot);
                p.point(i, 370 -150 + yDot2);
                p.point(i, 370 -150 + yDot3);
            }
            //increasing phase means that the kick wave will 
            //not be standing and looks more dynamic
            phase += 1;
        }
    };

    let p5_canvas = new p5(sketch,'p5container');

    openHiHat.volume.setValueAtTime(-50,"0");
    closedHiHat.volume.setValueAtTime(-50,"0");
    bass.volume.setValueAtTime(-50,"0");
    bleep.volume.setValueAtTime(-50,"0");
    kick.volume.setValueAtTime(-50,"0");

    document.getElementById('play_m').addEventListener('click', function() {

        openHiHatPart.start(0);
        closedHatPart.start(0);
        bass.start(0);
        bassPart.start(0);
        bleep.start(0);
        bleepLoop.start(0);
        kick.start(0);
        kickPart.start(0);
        
        Tone.Transport.toggle(); // start parts

        console.log('Playback status change successfully');
        if(music_start==0){
            document.getElementById('play_m').innerHTML="stop";
            music_start=1;
        }else{
            document.getElementById('play_m').innerHTML="play";
            music_start=0;
        }
    });
    
});

Template.music_area.events({
    'input .channel1'() { 
        openHiHat.volume.setValueAtTime(mixctrl1.value*0.5-50, "0");//"0" represents instantly change the value, it is the time lag before change
     },
    'input .channel2'() { 
        closedHiHat.volume.setValueAtTime(mixctrl2.value*0.5-50, "0");
     },
    'input .channel3'() { 
        bass.volume.setValueAtTime(mixctrl3.value*0.4-30, "0");
     },
    'input .channel4'() { 
        bleep.volume.setValueAtTime(mixctrl4.value*0.4-30, "0");
     },
    'input .channel5'() { 
        kick.volume.setValueAtTime(mixctrl5.value*0.5-30, "0");
     }
});

function draw_fountain(startloc,color,ball,kickValue) {
    gravity = 0.5;

    ball.vy += gravity;
    ball.x += ball.vx;
    ball.y += ball.vy;
    ball.color = 'hsla(' + color + ', 100%, 50%, 1)';

    if( ball.x - ball.radius > canvas.width ||
        ball.x + ball.radius < 0 ||
        ball.y - ball.radius > canvas.height ||
        ball.y + ball.radius < 0
    ){
        ball.x = startloc;
        ball.y = canvas.height;
        ball.vx = Math.random() * 2 - 1;
        ball.vy = Math.random() * -kickValue*1.3-1;
    }

    ball.drawcir();
};




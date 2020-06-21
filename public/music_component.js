import * as Tone from "tone";

// musical elements
var lowPass = new Tone.Filter({
    "frequency" : 14000,
}).toMaster();

//we can make our own hi hats with 
//the noise synth and a sharp filter envelope
var openHiHat = new Tone.NoiseSynth({
    "volume" : -10,
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
    "volume" : -10,
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

var bleep = new Tone.Oscillator("A4").connect(bleepEnvelope);

var bleepLoop = new Tone.Loop(function(time){
     bleepEnvelope.triggerAttack(time);
}, "2n");

//KICK
var kickEnvelope = new Tone.AmplitudeEnvelope({
    "attack" : 0.01,
    "decay" : 0.2,
    "sustain" : 0,
}).toMaster();

var kick = new Tone.Oscillator("A2").connect(kickEnvelope);

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
}, ["0", "0:0:3", "0:2:0", "0:3:1"]);

var synth = new Tone.FMSynth().toMaster();

var synpart = new Tone.Part(function(time, note){
    synth.triggerAttackRelease(note, "8n", time);
}, [[0, "C2"], ["0:2", "C3"], ["0:3:2", "G2"]]);
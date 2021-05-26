const chalk = require('chalk');
const log = console.log;
const midi = require('easymidi');
const delay = 100;
let nextNoteDelay = delay;
let output;
let arrTextToPlay = [];


// Count the available output ports.



CreateNewMidiPort();
AskInput();


function playNotes(text){
	var i = 1;
	arrTextToPlay = text.split("");

	playNextNote();
}

function playNextNote(){
	var letterToPlay = arrTextToPlay.shift();
	playNote(letterToPlay);
	if(arrTextToPlay.length <= 0){
		AskInput();
	}else{
		setTimeout(playNextNote, nextNoteDelay);
	}
}

function playNote(letter){
	let letterNo = letter.charCodeAt(0) - 97;

	if(letterNo >= 0){
		midiNum = 24 + (Math.floor(letterNo/3.3)*12);
		sendMidiNote(midiNum);
		nextNoteDelay = delay;
	}else{
		nextNoteDelay = delay * 3;
	}

	log(`playing: ${letter}, letterno: ${letterNo}, midinum: ${midiNum}, delay: ${nextNoteDelay}`);


}

function sendMidiNote(note){
	output.send('noteon', {
	  note: note,
	  velocity: 127,
	  channel: 0
	})

	setTimeout(function(){
		output.send('noteoff', {
		  note: note,
		  velocity: 127,
		  channel: 0
		});
	}, delay);
}


function CreateNewMidiPort(){
	var outputs = midi.getOutputs();
	log("getPortCount: ", outputs.length);

	// Get the name of a specified output port.
	for (var i = 0; i < outputs.length; i++) {
		log("getportname "+i, outputs[i]);

	}

	// Set up a new output.
	output = new midi.Output('TXT2MIDI', true);
	log("new port created", output.name);

}

function AskInput(){
	var inquirer = require('inquirer');
inquirer
  .prompt([
    {
    type: 'input',
    name: 'input',
    message: 'Input Text?',
    default: 'Hello World!',
  },
  ])
  .then((answers) => {
    // Use user feedback for... whatever!!
    playNotes(answers.input);
  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  });
}


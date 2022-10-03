const micContainer = document.getElementsByClassName('mic-container')[0];

micContainer.addEventListener('click', (e)=> {
  let elem = e.target;
  
  elem.classList.toggle('active');
});


const display = document.querySelector('.display');
const State = ['Initial', 'Record', "Download"];
let stateIndex = 0, mediaRecorder, chunks = [], audioURL = '';


const app = (index) => {
  switch (State[index]) {
    case 'Initial':
        clearDisplay();
        addMessage('Press the button to start recording');
        addButton('record', 'record()', 'Start Recording');
        break;

    case 'Record':
        clearDisplay()
        addMessage('Recording...')
        addButton('stop', 'stopRecording()', 'Stop Recording')
        break

    case 'Download':
        clearControls()
        addAudio()
        addButton('download', 'downloadAudio()', 'Dwnload Audio')
        addButton('record', 'record()', 'Record Again')
        break
    
    default:
        clearDisplay()
        addMessage('Your browser does not support mediaDevices')
        break;
  }
}
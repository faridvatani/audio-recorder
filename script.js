// collect DOMs
const display = document.querySelector('.display');
const controllerWrapper = document.querySelector('.controllers');
const State = ['Initial', 'Record', 'Download'];
const loader = `<div class="loader">
<svg id="wave" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 48">
  <title>Audio Wave</title>
  <path id="Line_1" data-name="Line 1" d="M0.91,15L0.78,15A1,1,0,0,0,0,16v6a1,1,0,1,0,2,0s0,0,0,0V16a1,1,0,0,0-1-1H0.91Z"/>
  <path id="Line_2" data-name="Line 2" d="M6.91,9L6.78,9A1,1,0,0,0,6,10V28a1,1,0,1,0,2,0s0,0,0,0V10A1,1,0,0,0,7,9H6.91Z"/>
  <path id="Line_3" data-name="Line 3" d="M12.91,0L12.78,0A1,1,0,0,0,12,1V37a1,1,0,1,0,2,0s0,0,0,0V1a1,1,0,0,0-1-1H12.91Z"/>
  <path id="Line_4" data-name="Line 4" d="M18.91,10l-0.12,0A1,1,0,0,0,18,11V27a1,1,0,1,0,2,0s0,0,0,0V11a1,1,0,0,0-1-1H18.91Z"/>
  <path id="Line_5" data-name="Line 5" d="M24.91,15l-0.12,0A1,1,0,0,0,24,16v6a1,1,0,0,0,2,0s0,0,0,0V16a1,1,0,0,0-1-1H24.91Z"/>
  <path id="Line_6" data-name="Line 6" d="M30.91,10l-0.12,0A1,1,0,0,0,30,11V27a1,1,0,1,0,2,0s0,0,0,0V11a1,1,0,0,0-1-1H30.91Z"/>
</svg>
</div>`;

let stateIndex = 0
let mediaRecorder, chunks = [], audioURL = '';

// mediaRecorder setup for audio
if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
    console.log('mediaDevices supported..')

    navigator.mediaDevices.getUserMedia({
        audio: true
    }).then(stream => {
        mediaRecorder = new MediaRecorder(stream)

        mediaRecorder.ondataavailable = (e) => {
            chunks.push(e.data)
        }

        mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, {'type': 'audio/ogg; codecs=opus'})
            chunks = []
            audioURL = window.URL.createObjectURL(blob)
            document.querySelector('audio').src = audioURL
            
        }
    }).catch(error => {
        console.log('Following error has occured : ',error)
    })
}else{
    stateIndex = ''
    application(stateIndex)
}

const clearDisplay = () => {
    display.textContent = ''
}

const clearControls = () => {
    controllerWrapper.textContent = ''
}

const record = () => {
    stateIndex = 1
    mediaRecorder.start()
    application(stateIndex)
}

const stopRecording = () => {
    stateIndex = 2
    mediaRecorder.stop()
    application(stateIndex)
}

const downloadAudio = () => {
    const downloadLink = document.createElement('a')
    downloadLink.href = audioURL
    downloadLink.setAttribute('download', 'audio')
    downloadLink.click()
}

const addButton = (id, funString) => {
    const btn = document.createElement('a')
    btn.id = id
    btn.classList.add("circle");
    btn.setAttribute('onclick', funString)

    if (id == 'record') {
        btn.innerHTML = `<i class="fas fa-microphone"></i>`;
    }else if (id == 'stop') {
        btn.classList.toggle("active");
        btn.innerHTML = `<i class="fas fa-microphone"></i>`;
    }else if (id == 'download') {
        btn.innerHTML = `<i class="fas fa-download"></i>`;
    }
    controllerWrapper.append(btn)
}

const addMessage = (text,hasLoader) => {
    const msg = document.createElement('h3')
    msg.textContent = text

    if (hasLoader == true){
        msg.textContent = ''
        display.innerHTML = loader;
    }
    display.append(msg)
}

const addAudio = () => {
    const audio = document.createElement('audio')
    audio.controls = true
    audio.src = audioURL
    display.append(audio)
}

const application = (index) => {
    switch (State[index]) {
        case 'Initial':
            clearDisplay()
            clearControls()

            addMessage('Press the start button to start recording')
            addButton('record', 'record()')
            break;

        case 'Record':
            clearDisplay()
            clearControls()

            addMessage('Recording...',true)
            addButton('stop', 'stopRecording()')
            break

        case 'Download':
            clearDisplay()
            clearControls()
    
            addAudio()
            addButton('record', 'record()', 'Record Again')
            addButton('download', 'downloadAudio()')
            break
        
        default:
            clearDisplay()
            clearControls()

            addMessage('Your browser does not support mediaDevices')
            break;
    }
}

application(stateIndex)
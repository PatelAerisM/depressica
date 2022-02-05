/*
 * js file for recording audio for in-the-moment help
 */



let record = document.querySelector("#recordButton")
let stop = document.querySelector('#stopButton')
let pastRecordings = document.querySelector("#past-recordings")
let canvas = document.querySelector("#visualizer")
let mainSection = document.querySelector("#recorder-controls")
let revokeMicAccessButtonEl = document.querySelector("#mic-drop")
let clipNames = []


stop.disabled = true;
record.disabled = true;
revokeMicAccessButtonEl.disabled = true;

let audioContext;
let canvasContext = canvas.getContext("2d")

function visualize(stream) {
    if(!audioContext) {
        audioContext = new AudioContext();
    }

    const source = audioContext.createMediaStreamSource(stream);

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);
    //analyser.connect(audioCtx.destination);

    draw()

    function draw() {
        const WIDTH = canvas.width
        const HEIGHT = canvas.height;

        requestAnimationFrame(draw);

        analyser.getByteTimeDomainData(dataArray);

        canvasContext.fillStyle = 'rgb(200, 200, 200)';
        canvasContext.fillRect(0, 0, WIDTH, HEIGHT);

        canvasContext.lineWidth = 2;
        canvasContext.strokeStyle = 'rgb(0, 0, 0)';

        canvasContext.beginPath();

        let sliceWidth = WIDTH * 1.0 / bufferLength;
        let x = 0;


        for(let i = 0; i < bufferLength; i++) {

            let v = dataArray[i] / 128.0;
            let y = v * HEIGHT/2;

            if(i === 0) {
                canvasContext.moveTo(x, y);
            } else {
                canvasContext.lineTo(x, y);
            }

            x += sliceWidth;
        }

        canvasContext.lineTo(canvas.width, canvas.height/2);
        canvasContext.stroke();

    }
}

function startRecorder() {
    if (navigator.mediaDevices.getUserMedia) {
        console.log('getUserMedia supported.');

        const constraints = {audio: true};
        let chunks = [];

        let onSuccess = function (stream) {
            const mediaRecorder = new MediaRecorder(stream);
            visualize(stream);

            getMicAccessButtonEl.disabled = true;
            record.disabled = false;
            revokeMicAccessButtonEl.disabled = false;


            revokeMicAccessButtonEl.addEventListener("click", function() {
                stream.getTracks().forEach(track => track.stop())
                revokeMicAccessButtonEl.disabled = true;
            })


            record.onclick = function () {
                revokeMicAccessButtonEl.disabled = false;
                mediaRecorder.start();
                console.log(mediaRecorder.state);
                console.log("recorder started");
                record.style.background = "red";

                stop.disabled = false;
                record.disabled = true;
            }

            stop.onclick = function () {
                mediaRecorder.stop();
                // stream.getTracks().forEach(track => track.stop())
                console.log(mediaRecorder.state);
                console.log("recorder stopped");
                record.style.background = "";
                record.style.color = "";
                // mediaRecorder.requestData();

                stop.disabled = true;
                record.disabled = false;
            }

            mediaRecorder.onstop = function (e) {
                console.log("data available after MediaRecorder.stop() called.");

                const clipName = prompt('Enter a name for your sound clip?', 'My unnamed clip');

                const clipContainer = document.createElement('article');
                const clipLabel = document.createElement('p');
                const audio = document.createElement('audio');
                const deleteButton = document.createElement('button');
                const saveButton = document.createElement('button')

                clipContainer.classList.add('clip');
                audio.setAttribute('controls', '');
                deleteButton.textContent = 'Delete';
                deleteButton.className = 'delete';
                saveButton.textContent = 'Save';
                saveButton.className = 'save';


                if (clipName === null) {
                    clipLabel.textContent = 'My unnamed clip';
                } else {
                    clipLabel.textContent = clipName;
                }

                clipContainer.appendChild(audio);
                clipContainer.appendChild(clipLabel);
                clipContainer.appendChild(deleteButton);
                clipContainer.appendChild(saveButton);
                pastRecordings.appendChild(clipContainer);

                audio.controls = true;
                const blob = new Blob(chunks, {'type': 'audio/mpeg; codecs=opus'});
                chunks = [];
                const audioURL = window.URL.createObjectURL(blob);
                audio.src = audioURL;
                console.log("recorder stopped");

                deleteButton.onclick = function (e) {
                    let evtTgt = e.target;
                    evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
                }

                saveButton.onclick = function(e) {
                    const reader = new window.FileReader();
                    reader.onload = function (e) {
                        localStorage.setItem(clipName, event.target.result)
                    }
                    reader.readAsDataURL(blob)
                    saveClipNames(clipName)
                }

                clipLabel.onclick = function () {
                    const existingName = clipLabel.textContent;
                    const newClipName = prompt('Enter a new name for your sound clip?');
                    if (newClipName === null) {
                        clipLabel.textContent = existingName;
                    } else {
                        clipLabel.textContent = newClipName;
                    }
                }
            }

            mediaRecorder.ondataavailable = function (e) {
                chunks.push(e.data);
            }

        }

        let onError = function (err) {
            console.log('The following error occured: ' + err);
        }

        navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);

    } else {
        console.log('getUserMedia not supported on your browser!');
    }
}

let getMicAccessButtonEl = document.querySelector("#mic-check")
getMicAccessButtonEl.addEventListener("click", function() {
    startRecorder();
})

let saveClipNames = function (clipName) {
    if (clipNames) { // if clipNames DNE
        clipNames.push(clipName)
        localStorage.setItem("clipNames", JSON.stringify(clipNames))
    } else {
        clipNames = JSON.parse(localStorage.getItem("clipNames"))
        clipNames.push(clipName)
        localStorage.setItem("clipNames", JSON.stringify(clipNames))
    }
}

window.onresize = function() {
    canvas.width = mainSection.offsetWidth;
}

window.onresize();

function loadAudioFiles() {
    let clipNames = JSON.parse(localStorage.getItem("clipNames"));
    if (clipNames) {

        for (let i = 0; i < clipNames.length; i++) {

            let clip = localStorage.getItem(clipNames[0])
            let b64AudioFile = clip.slice(36)
            // console.log(clip)
            const byteCharacters = atob(b64AudioFile);
            const byteNumbers = new Array(byteCharacters.length)
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i)
            }
            const byteArray = new Uint8Array(byteNumbers)
            const blob = new Blob([byteArray], {type: "audio/mpeg"})
            console.log(blob)

            const clipContainer = document.createElement('article');
            const clipLabel = document.createElement('p');
            const audio = document.createElement('audio');
            const deleteButton = document.createElement('button');
            const saveButton = document.createElement('button')

            clipContainer.classList.add('clip');
            audio.setAttribute('controls', '');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'delete';
            saveButton.textContent = 'Save';
            saveButton.className = 'save';


            if (clipNames[i] === null) {
                clipLabel.textContent = 'My unnamed clip';
            } else {
                clipLabel.textContent = clipNames[i];
            }

            clipContainer.appendChild(audio);
            clipContainer.appendChild(clipLabel);
            clipContainer.appendChild(deleteButton);
            clipContainer.appendChild(saveButton);
            pastRecordings.appendChild(clipContainer);

            audio.controls = true;
            chunks = [];
            const audioURL = window.URL.createObjectURL(blob);
            audio.src = audioURL;
            console.log("recorder stopped");

            deleteButton.onclick = function (e) {
                let evtTgt = e.target;
                evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
            }

            saveButton.onclick = function (e) {
                const reader = new window.FileReader();
                reader.onload = function (e) {
                    localStorage.setItem(clipNames[i], event.target.result)
                }
                reader.readAsDataURL(blob)
                saveClipNames(clipNames[i])
            }

            clipLabel.onclick = function () {
                const existingName = clipLabel.textContent;
                const newClipName = prompt('Enter a new name for your sound clip?');
                if (newClipName === null) {
                    clipLabel.textContent = existingName;
                } else {
                    clipLabel.textContent = newClipName;
                }
            }
        }
/*
        let jsonString = clipNames[0]
        const parsed = JSON.parse(jsonString);
        const blob = await fetch(parsed.blob).then(res => res.blob());
        console.log(blob);*/
    }
}

loadAudioFiles()

// loadAudioFiles().then(r => startRecorder())

/*
const blobToBase64 = (blob) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
            resolve(reader.result);
        };
    });
};

(async () => {
    const b64 = await blobToBase64(blob);
    const jsonString = JSON.stringify({blob: b64});
    console.log(jsonString);
})();*/
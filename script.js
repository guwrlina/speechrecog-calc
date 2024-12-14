document.addEventListener('DOMContentLoaded', () => {
    const display = document.querySelector('input[name="display"]');
    const startAudioBtn = document.getElementById('startAudio');
    const stopAudioBtn = document.getElementById('stopAudio');
    const statusDiv = document.getElementById('status');
    let recognition;

    // Calculator functionality
    const buttons = document.querySelectorAll('.calculator input[type="button"]');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            if (e.target.value === '=') {
                try {
                    display.value = eval(display.value);
                } catch (error) {
                    display.value = 'Error';
                }
            } else if (e.target.value === 'AC') {
                display.value = '';
            } else if (e.target.value === 'Del') {
                display.value = display.value.toString().slice(0, -1);
            } else {
                display.value += e.target.value;
            }
        });
    });
    

    // Audio recognition functionality
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            statusDiv.textContent = 'Listening...';
            startAudioBtn.disabled = true;
            stopAudioBtn.disabled = false;
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            display.value = transcript;
            statusDiv.textContent = `You said: ${transcript}`;
            
            // Attempt to evaluate the speech input
            try {
                const result = eval(transcript.replace(/x/gi, '*'));
                if (!isNaN(result)) {
                    display.value = result;
                    statusDiv.textContent += ` = ${result}`;
                }
            } catch (error) {
                statusDiv.textContent += ' (Unable to calculate)';
            }
        };

        recognition.onerror = (event) => {
            statusDiv.textContent = `Error occurred in recognition: ${event.error}`;
        };

        recognition.onend = () => {
            statusDiv.textContent = 'Click "Start Audio Input" to begin';
            startAudioBtn.disabled = false;
            stopAudioBtn.disabled = true;
        };

        startAudioBtn.addEventListener('click', () => {
            recognition.start();
        });

        stopAudioBtn.addEventListener('click', () => {
            recognition.stop();
        });
    } else {
        statusDiv.textContent = 'Web Speech API is not supported in this browser.';
        startAudioBtn.disabled = true;
        stopAudioBtn.disabled = true;
    }
});



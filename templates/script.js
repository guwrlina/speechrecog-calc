document.addEventListener('DOMContentLoaded', () => {
    const display = document.querySelector('input[name="display"]');
    const startAudioBtn = document.getElementById('startAudio');
    const stopAudioBtn = document.getElementById('stopAudio');
    const statusDiv = document.getElementById('status');
    let isRecording = false;

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

    // Speech recognition functionality
    startAudioBtn.addEventListener('click', startRecording);
    stopAudioBtn.addEventListener('click', stopRecording);

    function startRecording() {
        isRecording = true;
        startAudioBtn.disabled = true;
        stopAudioBtn.disabled = false;
        statusDiv.textContent = 'Listening...';

        fetch('/start_recognition', { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    pollForResults();
                } else {
                    statusDiv.textContent = 'Failed to start recording';
                    resetButtons();
                }
            })
            .catch(error => {
                console.error('Error:', error);
                statusDiv.textContent = 'Error occurred while starting recording';
                resetButtons();
            });
    }

    function stopRecording() {
        isRecording = false;
        fetch('/stop_recognition', { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    statusDiv.textContent = 'Processing audio...';
                } else {
                    statusDiv.textContent = 'Failed to stop recording';
                }
                resetButtons();
            })
            .catch(error => {
                console.error('Error:', error);
                statusDiv.textContent = 'Error occurred while stopping recording';
                resetButtons();
            });
    }

    function pollForResults() {
        if (!isRecording) return;

        fetch('/get_result')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success' && data.result) {
                    display.value = data.result;
                    statusDiv.textContent = `You said: ${data.result}`;
                    try {
                        const calculatedResult = eval(data.result.replace(/x/gi, '*'));
                        if (!isNaN(calculatedResult)) {
                            display.value = calculatedResult;
                            statusDiv.textContent += ` = ${calculatedResult}`;
                        }
                    } catch (error) {
                        statusDiv.textContent += ' (Unable to calculate)';
                    }
                    resetButtons();
                } else if (isRecording) {
                    setTimeout(pollForResults, 1000);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                statusDiv.textContent = 'Error occurred while getting results';
                resetButtons();
            });
    }

    function resetButtons() {
        startAudioBtn.disabled = false;
        stopAudioBtn.disabled = true;
    }
});






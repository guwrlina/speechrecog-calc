const { execSync } = require('child_process');
const fs = require('fs');

// Function to run shell commands
function runCommand(command) {
    console.log(`Running: ${command}`);
    try {
        const output = execSync(command, { encoding: 'utf-8' });
        console.log(output);
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

// Create a virtual environment
runCommand('python -m venv venv');

// Activate the virtual environment and install requirements
if (process.platform === 'win32') {
    runCommand('.\\venv\\Scripts\\activate && pip install -r requirements.txt');
} else {
    runCommand('source venv/bin/activate && pip install -r requirements.txt');
}

// Run the Flask application
console.log('Starting Flask application...');
if (process.platform === 'win32') {
    runCommand('set FLASK_APP=app.py && flask run');
} else {
    runCommand('FLASK_APP=app.py flask run');
}

// Note: The above command will start the Flask server and keep running.
// You would typically run this in a separate terminal window.





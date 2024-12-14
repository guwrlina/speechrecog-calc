from flask import Flask, render_template, jsonify
import speech_recognition as sr
import threading

app = Flask(__name__)

recognizer = sr.Recognizer()
microphone = sr.Microphone()
stop_listening = None
latest_result = None


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/start_recognition', methods=['POST'])
def start_recognition():
    global stop_listening, latest_result

    latest_result = None

    def callback(recognizer, audio):
        global latest_result
        try:
            result = recognizer.recognize_google(audio)
            latest_result = result
        except sr.UnknownValueError:
            latest_result = "Speech Recognition could not understand audio"
        except sr.RequestError as e:
            latest_result = f"Could not request results from Speech Recognition service; {e}"

    stop_listening = recognizer.listen_in_background(microphone, callback)
    return jsonify({"status": "success"})

@app.route('/stop_recognition', methods=['POST'])
def stop_recognition():
    global stop_listening
    if stop_listening:
        stop_listening(wait_for_stop=False)
        stop_listening = None
    return jsonify({"status": "success"})

@app.route('/get_result')
def get_result():
    global latest_result
    if latest_result:
        result = latest_result
        latest_result = None
        return jsonify({"status": "success", "result": result})
    return jsonify({"status": "waiting"})

if __name__ == '__main__':
    app.run(debug=True)




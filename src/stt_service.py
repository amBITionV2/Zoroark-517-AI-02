import sounddevice as sd
import numpy as np
import whisper
import tempfile
import wave
import time
import threading
import keyboard

stt_model = whisper.load_model("base")

SAMPLE_RATE = 16000
SILENCE_THRESHOLD = 100
MAX_SILENCE_TIME = 5
MAX_TOTAL_TIME = 30
stop_recording = False


def save_wav(audio, filename):
    """Save numpy audio to wav file."""
    with wave.open(filename, 'wb') as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(SAMPLE_RATE)
        wf.writeframes(audio.tobytes())


def stop_on_enter():
    """Stop recording when Enter key is pressed."""
    global stop_recording
    keyboard.wait('enter')
    print("\n[INFO] Enter key pressed — stopping early.")
    stop_recording = True


def listen_and_transcribe():
    """Record audio until silence, max time, or Enter key is pressed — then transcribe."""
    global stop_recording
    stop_recording = False

    print("🎙️ Listening... (Press ENTER to stop early, or stay silent for 5s)")
    all_audio = []
    silence_start = None
    start_time = time.time()

    threading.Thread(target=stop_on_enter, daemon=True).start()

    with sd.InputStream(samplerate=SAMPLE_RATE, channels=1, dtype=np.int16) as stream:
        while True:
            chunk, _ = stream.read(int(0.5 * SAMPLE_RATE))
            chunk = np.squeeze(chunk)
            all_audio.append(chunk)

            volume = np.abs(chunk).mean()

            if volume < SILENCE_THRESHOLD:
                if silence_start is None:
                    silence_start = time.time()
                elif time.time() - silence_start > MAX_SILENCE_TIME:
                    print("🛑 Stopped due to silence.")
                    break
            else:
                silence_start = None

            if stop_recording:
                break

            if time.time() - start_time > MAX_TOTAL_TIME:
                print("🛑 Stopped due to max time reached.")
                break

    audio = np.concatenate(all_audio, axis=0)

    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmpfile:
        save_wav(audio, tmpfile.name)
        print("\n🧠 Transcribing...")
        result = stt_model.transcribe(tmpfile.name, language="en")

    return result["text"].strip()


if __name__ == "__main__":
    text = listen_and_transcribe()
    print(f"\n🗣️ Transcription:\n{text}")

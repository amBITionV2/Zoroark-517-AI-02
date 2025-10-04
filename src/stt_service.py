import sounddevice as sd
import numpy as np
import whisper
import tempfile
import wave
import time
import threading

stt_model = whisper.load_model("base")

SAMPLE_RATE = 16000
SILENCE_THRESHOLD = 100
MAX_SILENCE_TIME = 3
MAX_TOTAL_TIME = 20

# Global recording control
recording_state = {
    "is_recording": False,
    "should_stop": False,
    "audio_chunks": [],
    "lock": threading.Lock()
}


def save_wav(audio, filename):
    """Save numpy audio to wav file."""
    with wave.open(filename, 'wb') as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(SAMPLE_RATE)
        wf.writeframes(audio.tobytes())


def record_audio():
    """Background thread function to record audio."""
    print("🎙️ Recording started...")
    silence_start = None
    start_time = time.time()
    
    try:
        with sd.InputStream(samplerate=SAMPLE_RATE, channels=1, dtype=np.int16) as stream:
            while True:
                with recording_state["lock"]:
                    if recording_state["should_stop"]:
                        print("🛑 Recording stopped by user")
                        break
                
                chunk, _ = stream.read(int(0.5 * SAMPLE_RATE))
                chunk = np.squeeze(chunk)
                
                with recording_state["lock"]:
                    recording_state["audio_chunks"].append(chunk)
                
                volume = np.abs(chunk).mean()
                
                # Check for silence
                if volume < SILENCE_THRESHOLD:
                    if silence_start is None:
                        silence_start = time.time()
                    elif time.time() - silence_start > MAX_SILENCE_TIME:
                        print("🛑 Stopped due to silence")
                        break
                else:
                    silence_start = None
                
                # Check max time
                if time.time() - start_time > MAX_TOTAL_TIME:
                    print("🛑 Stopped due to max time (20s)")
                    break
                    
    except Exception as e:
        print(f"❌ Recording error: {e}")
    finally:
        with recording_state["lock"]:
            recording_state["is_recording"] = False


def listen_and_transcribe():
    """Start recording in background and wait for completion."""
    global recording_state
    
    # Reset state
    with recording_state["lock"]:
        recording_state["is_recording"] = True
        recording_state["should_stop"] = False
        recording_state["audio_chunks"] = []
    
    # Start recording thread
    record_thread = threading.Thread(target=record_audio, daemon=True)
    record_thread.start()
    
    # Wait for recording to complete
    record_thread.join(timeout=MAX_TOTAL_TIME + 2)
    
    # Get recorded audio
    with recording_state["lock"]:
        audio_chunks = recording_state["audio_chunks"].copy()
        recording_state["is_recording"] = False
    
    if not audio_chunks:
        print("⚠️ No audio recorded")
        return "No audio detected"
    
    try:
        # Concatenate all audio chunks
        audio = np.concatenate(audio_chunks, axis=0)
        
        # Save to temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmpfile:
            save_wav(audio, tmpfile.name)
            print("🧠 Transcribing...")
            result = stt_model.transcribe(tmpfile.name, language="en")
        
        transcribed_text = result["text"].strip()
        print(f"✅ Transcription: {transcribed_text}")
        return transcribed_text
        
    except Exception as e:
        print(f"❌ Transcription error: {e}")
        return "Error during transcription"


def stop_recording():
    """Signal the recording to stop."""
    with recording_state["lock"]:
        if recording_state["is_recording"]:
            recording_state["should_stop"] = True
            print("📌 Stop signal sent")
            return True
        return False


def is_recording():
    """Check if currently recording."""
    with recording_state["lock"]:
        return recording_state["is_recording"]


if __name__ == "__main__":
    text = listen_and_transcribe()
    print(f"\n🗣️ Transcription:\n{text}")
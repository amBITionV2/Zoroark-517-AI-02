import requests
import os
import base64

# Set your ElevenLabs API key
ELEVEN_API_KEY = "sk_86cc981d87f7827a52b82189cb3cb0d21d98e1b2c5f5bb10"

# Choose a voice ID
VOICE_ID = "UgBBYS2sOqTuMpoF3BR0"  # Example voice (Rachel)

def speak_text(text: str):
    """Convert text to speech using ElevenLabs API and return audio data."""
    if not text.strip():
        return None

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": ELEVEN_API_KEY
    }
    data = {
        "text": text,
        "voice_settings": {
            "stability": 0.6,
            "similarity_boost": 0.8
        }
    }

    print("🔊 Generating speech...")
    response = requests.post(url, json=data, headers=headers)

    if response.status_code != 200:
        print("❌ Error generating speech:", response.text)
        return None

    # Save audio file
    output_path = "ai_voice.mp3"
    with open(output_path, "wb") as f:
        f.write(response.content)
    
    print("✅ Audio generated successfully")
    return output_path

def get_audio_base64(file_path: str):
    """Convert audio file to base64 for sending to frontend."""
    if not file_path or not os.path.exists(file_path):
        return None
    
    with open(file_path, "rb") as audio_file:
        audio_bytes = audio_file.read()
        audio_base64 = base64.b64encode(audio_bytes).decode('utf-8')
    
    return audio_base64
import requests
import os

# Set your ElevenLabs API key
ELEVEN_API_KEY = "sk_86cc981d87f7827a52b82189cb3cb0d21d98e1b2c5f5bb10"

# Choose a voice ID (you can find it on your ElevenLabs dashboard)
VOICE_ID = "UgBBYS2sOqTuMpoF3BR0"  # Example voice (Rachel)

def speak_text(text: str):
    """Convert text to speech using ElevenLabs API and play the audio."""
    if not text.strip():
        return

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

    print("🔊 Speaking...")
    response = requests.post(url, json=data, headers=headers)

    if response.status_code != 200:
        print("❌ Error generating speech:", response.text)
        return

    output_path = "ai_voice.mp3"
    with open(output_path, "wb") as f:
        f.write(response.content)

    os.system(f'start {output_path}')

import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from interview_flow import get_ai_response, set_resume_context
from stt_service import listen_and_transcribe, stop_recording, is_recording
from conclusion_checker import check_conclusion
from tts_service import speak_text, get_audio_base64

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

interview_state = {
    "question_number": 0,
    "is_active": False
}

class StartRequest(BaseModel):
    resume: str

@app.get("/")
def root():
    return {
        "message": "AI Interview Backend Running",
        "status": "active",
        "endpoints": ["/ai/start", "/ai/listen"]
    }

@app.post("/ai/start")
def start_interview(req: StartRequest):
    """Initialize interview with resume and ask first question"""
    try:
        interview_state['question_number'] = 1
        interview_state['is_active'] = True
        
        set_resume_context(req.resume)
        
        question = get_ai_response("start_interview", interview_state['question_number'])
        
        audio_file = speak_text(question)
        audio_base64 = get_audio_base64(audio_file) if audio_file else None
        
        return {
            "question": question,
            "question_number": interview_state['question_number'],
            "status": "success",
            "audio": audio_base64
        }
    
    except Exception as e:
        print(f"Error in start_interview: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to start interview: {str(e)}")

@app.post("/ai/listen")
def listen_and_respond():
    """Listen to candidate answer via STT and generate AI response"""
    try:
        if not interview_state['is_active']:
            raise HTTPException(status_code=400, detail="Interview not started. Call /ai/start first.")
        
        print("Listening for candidate answer...")
        candidate_answer = listen_and_transcribe()
        print(f"Transcribed answer: {candidate_answer}")
        
        # Handle transcription errors
        if not candidate_answer or candidate_answer.strip() == "":
            return {
                "candidate_answer": "No response detected",
                "ai_response": "I didn't catch that. Could you please repeat your answer?",
                "interview_end": False,
                "question_number": interview_state['question_number']
            }
        
        # Step 2: Increment question number for next question
        interview_state['question_number'] += 1
        
        # Step 3: Get AI response based on candidate's answer
        print(f"Getting AI response for question {interview_state['question_number']}...")
        ai_response = get_ai_response(candidate_answer, interview_state['question_number'])
        print(f"AI response: {ai_response}")
        
        # Step 4: Generate speech audio
        print("Generating speech...")
        audio_file = speak_text(ai_response)
        audio_base64 = get_audio_base64(audio_file) if audio_file else None
        
        # Step 5: Check if interview should conclude
        interview_end = check_conclusion(ai_response)
        
        if interview_end:
            interview_state['is_active'] = False
            print("Interview concluded")
        
        return {
            "candidate_answer": candidate_answer,
            "ai_response": ai_response,
            "interview_end": interview_end,
            "question_number": interview_state['question_number'],
            "audio": audio_base64
        }
    
    except Exception as e:
        print(f"Error in listen_and_respond: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to process answer: {str(e)}")

@app.get("/ai/status")
def get_status():
    """Get current interview status"""
    return {
        "is_active": interview_state['is_active'],
        "current_question_number": interview_state['question_number']
    }

@app.post("/ai/end")
def end_interview():
    """Manually end the interview"""
    interview_state['is_active'] = False
    interview_state['question_number'] = 0
    return {
        "message": "Interview ended successfully",
        "status": "inactive"
    }

if __name__ == "__main__":
    import uvicorn
    print("Starting AI Interview Backend Server...")
    print("Server will run on http://127.0.0.1:8000")
    print("Make sure your STT and TTS services are properly configured!")
    uvicorn.run(app, host="127.0.0.1", port=8000)
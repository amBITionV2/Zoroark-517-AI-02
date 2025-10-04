from fastapi import FastAPI
from pydantic import BaseModel
from interview_flow import get_ai_response, set_resume_context
from stt_service import listen_and_transcribe
from conclusion_checker import check_conclusion
from tts_service import speak_text
import uvicorn

app = FastAPI()

class QuestionRequest(BaseModel):
    candidate_answer: str
    question_number: int
    resume_text: str = None

@app.post("/ai/listen")
async def listen_and_respond(question_number: int):
    answer = listen_and_transcribe()  # Records and transcribes candidate
    ai_response = get_ai_response(answer, question_number)
    speak_text(ai_response)
    interview_end = check_conclusion(ai_response)
    return {
        "candidate_answer": answer,
        "ai_response": ai_response,
        "interview_end": interview_end,
        "question_number": question_number + 1
    }

@app.post("/ai/start")
async def start_interview(req: QuestionRequest):
    if req.resume_text:
        set_resume_context(req.resume_text)
    question = get_ai_response("start_interview", 1)
    speak_text(question)
    return {"question": question, "question_number": 1}

@app.post("/ai/next")
async def next_question(req: QuestionRequest):
    answer = req.candidate_answer
    q_num = req.question_number
    response = get_ai_response(answer, q_num)
    speak_text(response)
    interview_end = check_conclusion(response)
    
    next_question = None
    if not interview_end:
        next_question = get_ai_response("next_question", q_num + 1)
    
    return {
        "ai_response": response,
        "next_question": next_question,
        "interview_end": interview_end,
        "question_number": q_num + 1
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

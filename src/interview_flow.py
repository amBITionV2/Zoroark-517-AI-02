import google.generativeai as genai
import os
from dotenv import load_dotenv
load_dotenv()

genai.configure(api_key=os.environ["API_KEY"])
conversation_history = []
resume_context = None

def set_resume_context(resume_text: str):
    """Load resume text so AI can personalize questions."""
    global resume_context
    resume_context = resume_text.strip() if resume_text else None
    print("📄 Resume context loaded successfully.")


def get_ai_response(user_input: str, question_number: int):
    """Generate next intelligent question or follow-up."""
    global conversation_history, resume_context

    # Store candidate’s response
    conversation_history.append({
        "question_num": question_number,
        "answer": user_input
    })

    # Handle empty / unclear input
    if len(user_input.strip()) < 3:
        return "I couldn’t quite hear that clearly. Let's move on to another topic."
    
    # Build the dynamic prompt
    prompt = f"""
    You are an experienced **technical interviewer** conducting a structured interview.
    Guidelines:
    - Keep your tone confident and professional (like a hiring manager).
    - Base your questions on the candidate’s previous answers and resume.
    - Encourage depth: ask for reasoning, examples, or results.
    - Never repeat questions or ask unrelated ones.
    - If resume info exists, use it to tailor questions about projects, tech skills, and achievements.
    - If enough has been covered, conclude politely.

    Resume (if provided):
    {resume_context if resume_context else "No resume provided"}

    Interview so far:
    {conversation_history}

    The candidate just said: "{user_input}"

    Now generate your next message as the interviewer:
    - Either ask a follow-up question
    - Or naturally conclude if appropriate
    """

    model = genai.GenerativeModel("gemini-2.5-flash")
    response = model.generate_content(prompt)

    return response.text.strip()


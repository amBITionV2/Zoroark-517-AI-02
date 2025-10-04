import os
from interview_flow import get_ai_response, set_resume_context
from stt_service import listen_and_transcribe
from conclusion_checker import check_conclusion
from tts_service import speak_text

ffmpeg_path = r"C:\Users\neera\Downloads\ffmpeg-2025-10-01-git-1a02412170-essentials_build\ffmpeg-2025-10-01-git-1a02412170-essentials_build\bin"
os.environ["PATH"] = ffmpeg_path + os.pathsep + os.environ["PATH"]

resume_text = """
Neeraj Paramkar
H +91-8431036155 | # neerajparamkar@gmail.com | ï Linkedin | § Github |  Portfolio
Education
KLE Independent PU College Belagavi, India
Class 12th (2022 - 2024) Percentage: 95.66%
Dayananda Sagar College of Engineering Bangalore, India
Bachelor of Engineering in Computer Science (2024 - 2028) CGPA: 8.8/10
Skills
Languages C, C++, Python, JavaScript, TypeScript, HTML, CSS
Databases MongoDB
Frameworks & Libraries React, Next.js, Node.js, Express.js, EJS, Tailwind CSS, GSAP, Vite
Developer Tools Git, GitHub, Postman, Vercel
Projects
QuickTask Next.js | Node.js | Express.js | MongoDB GitHub August 2025 - September 2025
• Skill Based Task Assignment Platform
• Developed a full-stack web application for posting and assigning skill-based tasks.
• Implemented automatic skill-matching logic to assign tasks to individuals with relevant skills.
• Integrated secure authentication and email notifications for task assignments.
• Designed a task status tracking system (To-Do, In Progress, Completed ).
AI Code Reviewer Next.js | Express | MongoDB | OpenAI APIs GitHub July 2025 - August 2025
• Developed an AI-driven platform that reviews code and provides intelligent feedback.
• Added features for bug detection, improvements, and time/space complexity analysis.
• Implemented secure authentication and project history tracking for users.
• Supported structured review history to help developers monitor progress.
Authenticator React | Node.js/Express | Nodemailer | MongoDB GitHub May 2025 - June 2025
• Built a full-featured authentication system.
• Supported registration, login, OTP-based email verification, and password reset.
• Integrated secure OTP delivery.
• Designed as a plug-and-play authentication solution for web apps (e.g., e-commerce, blogs, task
managers).
Key Achievements
• Solved 250+ problems on LeetCode and achieved a LeetCode Rating of 1513.
• Earned 100 Days badges (x2) and 50 Days badge (x2) on LeetCode, demonstrating consistent
problem-solving and coding practice.
• Contributing as a Tech Team Member at ByteXync, collaborating on real-world projects and
improving skills in React.js, Next.js, Node.js, Express, and MongoDB.
"""
set_resume_context(resume_text)

MAX_QUESTIONS = 8

def run_interview():
    print("🎤 Real-Time AI Interview Started\n")

    question_number = 1
    question = get_ai_response("start_interview", question_number)
    print(f"\n🤖 AI asks: {question}")
    speak_text(question)

    for _ in range(MAX_QUESTIONS):
        print("🎙️ Please answer now...")
        answer = listen_and_transcribe()
        print(f"👤 Candidate answered: {answer}")

        follow_up = get_ai_response(answer, question_number)
        print(f"\n🤖 AI responds: {follow_up}")
        speak_text(follow_up)

        if check_conclusion(follow_up):
            print("\n✅ Interview concluded early based on AI response.")
            break

        if "?" in follow_up:
            continue
        else:
            question_number += 1
            next_question = get_ai_response("next_question", question_number)
            print(f"\n🤖 AI asks: {next_question}")
            speak_text(question)

    else:
        print("\n🛑 Max questions reached, ending interview.")


if __name__ == "__main__":
    run_interview()

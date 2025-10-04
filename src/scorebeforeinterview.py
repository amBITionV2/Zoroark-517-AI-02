import json
from rag import evaluate_resume_for_domain

def calculate_total_score(resume_text: str, target_domain: str, mcq_marks: float, coding_marks: float) -> dict:
    """
    Combines resume score with MCQ and coding marks into a total_score.
    """
    rag_json = evaluate_resume_for_domain(resume_text, target_domain)
    rag_resume_score = rag_json.get("resume_score", 0)
    resume_score_scaled = (rag_resume_score / 100) * 35

    total_score = resume_score_scaled + mcq_marks + coding_marks

    updated_json = rag_json.copy()
    updated_json["mcq_marks"] = mcq_marks
    updated_json["coding_marks"] = coding_marks
    updated_json["resume_score"] = round(rag_resume_score, 2)
    updated_json["total_score"] = round(total_score, 2)

    return updated_json

if __name__ == "__main__":
    resume_text = """Neeraj Paramkar
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
improving skills in React.js, Next.js, Node.js, Express, and MongoDB."""
    
    target_domain = "Full Stack Developer"
    mcq_marks = 20
    coding_marks = 35

    final_json = calculate_total_score(resume_text, target_domain, mcq_marks, coding_marks)

    # Save and print
    with open("final_score.json", "w") as f:
        json.dump(final_json, f, indent=4)

    print(json.dumps(final_json, indent=4))

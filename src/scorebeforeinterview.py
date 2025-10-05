import json
from rag import evaluate_resume_for_domain
import requests

url = "http://localhost:5000/api/admin/user/:userId/resume-text"

response = requests.get(url)

if response.status_code == 200:
    # Assuming the API returns plain text
    resume_text = response.text
    print("Resume fetched successfully!")
else:
    print(f"Failed to fetch resume. Status code: {response.status_code}")


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
    resume_text = response.json()["resume_text"]
    
    target_domain = "Full Stack Developer"
    mcq_marks = 20
    coding_marks = 35

    final_json = calculate_total_score(resume_text, target_domain, mcq_marks, coding_marks)

    with open("final_score.json", "w") as f:
        json.dump(final_json, f, indent=4)

    print(json.dumps(final_json, indent=4))

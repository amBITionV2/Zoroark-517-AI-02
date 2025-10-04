import re
import google.generativeai as genai
import json
import os
from dotenv import load_dotenv
load_dotenv()


genai.configure(api_key=os.environ["API_KEY"])


def chunk_resume(resume_text: str):
    resume_text = re.sub(r'\s+', ' ', resume_text)
    sections = re.split(
        r'(?i)(?=Education|Skills|Projects|Experience|Achievements|Key Achievements|Certifications)',
        resume_text
    )

    chunks = []
    for section in sections:
        section = section.strip()
        if not section:
            continue
        if re.search(r'(?i)Projects|Experience', section):
            projects = re.split(
                r'(?=•|[A-Z][a-z]+ [A-Z][a-z]+|AI|QuickTask|Authenticator)',
                section
            )
            for p in projects:
                p = p.strip()
                if len(p.split()) > 10:
                    chunks.append(p)
        else:
            chunks.append(section)
    return chunks

def evaluate_resume_for_domain(resume_text: str, target_domain: str):
    chunks = chunk_resume(resume_text)
    combined_resume = "\n\n".join(chunks)

    prompt = f"""
You are a highly experienced HR and technical recruiter specializing in candidate evaluation and job-fit analysis across multiple industries.

Your task is to critically assess the candidate's profile for their suitability to the given target domain.

INPUTS:
- Candidate Resume (structured sections): {combined_resume}
- Target Domain or Job Role: {target_domain}

EVALUATION RULES:
1. Analyze the candidate’s education, experience, projects, certifications, and skills to estimate how well they align with the target domain.
2. Be objective and specific — do not compliment or speculate beyond resume facts.
3. Consider:
   - Technical and domain relevance of skills and tools.
   - Depth and complexity of listed projects.
   - Demonstrated outcomes, achievements, and metrics (if any).
   - Transferable skills that may partially cover missing areas.
4. Identify critical skill or experience gaps that are mandatory for excellence in this domain.
5. Assign a RESUME SCORE from 0–100 based strictly on alignment (100 = perfect match, 0 = unrelated profile).
6. Keep the explanation concise and formal, avoiding opinionated or speculative wording.

OUTPUT STRICTLY in the following JSON structure only (no extra text, no markdown):

{{
  "domain": "{target_domain}",
  "resume_score": <integer between 0 and 100>,
  "summary": "<2–3 line factual overview of fit>",
  "strengths": ["specific skills or experiences clearly relevant to the domain"],
  "missing_skills": ["critical skills, tools, or experiences not evident"],
  "recommendation": "<1–2 line action plan on how to close these gaps>"
}}
"""

    model = genai.GenerativeModel("models/gemini-2.5-flash")
    response = model.generate_content(prompt)
    response_text = response.text.strip()
    if not response_text:
        raise ValueError("Empty response from Gemini API. Check API key or network.")

    import re
    json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
    if not json_match:
        raise ValueError(f"No JSON found in model response:\n{response_text}")

    return json.loads(json_match.group())

def generate_with_gemini(prompt: str) -> str:
    """
    Helper function to generate text using Gemini — reusable by other scripts like aigenmcq.py.
    """
    model = genai.GenerativeModel("models/gemini-2.5-flash")
    response = model.generate_content(prompt)
    return response.text.strip()
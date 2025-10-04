import json
from rag import generate_with_gemini

def generate_mcqs_for_domain(domain: str, num_questions: int = 10, difficulty: str = "medium") -> list:
    """
    Generates domain-specific MCQs using Gemini AI.

    Args:
        domain (str): The target job domain (e.g., "Full Stack Developer", "Data Scientist").
        num_questions (int): Number of questions to generate.
        difficulty (str): Difficulty level ("easy", "medium", "hard").

    Returns:
        list: List of MCQ dictionaries.
    """

    prompt = f"""
You are an expert technical interviewer.

Generate {num_questions} high-quality **multiple choice questions (MCQs)** for the domain: "{domain}".

Each question should:
- Be relevant to the domain and test real applied knowledge.
- Have exactly 4 options.
- Include the correct answer.
- Match the given difficulty level: {difficulty}.
- Be strictly outputted as a JSON array, with this structure:
- Shuffle the answers, dont make all answers the same option, randomize more.
[
  {{
    "question": "string",
    "options": ["option1", "option2", "option3", "option4"],
    answer: correct option from options(mention only the number is good enough),
    "difficulty": "{difficulty}"
  }}
]
"""

    response_text = generate_with_gemini(prompt)

    import re
    json_match = re.search(r'\[.*\]', response_text, re.DOTALL)
    if not json_match:
        raise ValueError(f"No JSON found in AI response:\n{response_text}")

    try:
        mcq_list = json.loads(json_match.group())
    except json.JSONDecodeError:
        raise ValueError(f"Invalid JSON format returned:\n{response_text}")

    return mcq_list

if __name__ == "__main__":
    domain = "ML Engineer"
    mcqs = generate_mcqs_for_domain(domain, num_questions=5, difficulty="medium")

    with open(f"mcq_{domain.replace(' ', '_').lower()}.json", "w") as f:
        json.dump(mcqs, f, indent=4)

    print(json.dumps(mcqs, indent=4))

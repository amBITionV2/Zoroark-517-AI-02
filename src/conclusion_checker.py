def check_conclusion(text: str) -> bool:
    """
    Return True if AI explicitly marks the interview as ended.
    The AI should output 'INTERVIEW_END' when it wants to conclude.
    """
    return "INTERVIEW_END" in text

# utils/ai_analyzer.py
from dotenv import load_dotenv
import os
import json
from groq import Groq
# Load .env file
load_dotenv()
# Initialize Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def analyze_threat(total, safe, threat, threat_rate):
    # 1. Rule-based fallback (Used if Groq fails)
    fallback_level = "LOW"
    fallback_attack = "Normal Traffic"
    fallback_recs = ["No immediate action required"]
    
    if threat_rate > 50:
        fallback_level = "CRITICAL"
        fallback_attack = "Possible DoS Attack"
        fallback_recs = ["Block suspicious IP addresses", "Enable firewall rules", "Inspect IDS logs", "Notify Security Team"]
    elif threat_rate > 25:
        fallback_level = "HIGH"
        fallback_attack = "Probe / DoS Activity"
        fallback_recs = ["Monitor traffic", "Inspect Firewall", "Review IDS Logs", "Enable Rate Limiting"]

    # 2. Prepare the AI Prompt
    prompt = f"""
    You are an expert cybersecurity SOC analyst. Analyze the following network traffic data:
    - Total Records: {total}
    - Safe Traffic: {safe}
    - Threat Traffic: {threat}
    - Threat Rate: {threat_rate}%

    Based on this data, provide a brief security analysis.
    Return your analysis **strictly** as a raw JSON object (no markdown formatting, no code blocks) with the following keys:
    - "level": The threat level (choose one strictly: "CRITICAL", "HIGH", "MEDIUM", or "LOW").
    - "attack": A specific, realistic label for the potential attack type.
    - "recommendations": An array of exactly 4 actionable security recommendations (strings).
    """

    # 3. Call Groq AI
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a cybersecurity SOC analyst returning structured JSON."},
                {"role": "user", "content": prompt}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.7,
            max_tokens=500,
            response_format={"type": "json_object"} # Enforces valid JSON output
        )

        response_content = chat_completion.choices[0].message.content
        ai_data = json.loads(response_content)

        # Extract Groq data
        level = ai_data.get("level", fallback_level)
        attack = ai_data.get("attack", fallback_attack)
        recs = ai_data.get("recommendations", fallback_recs)

    except Exception as e:
        print(f"Groq AI failed, using fallback logic. Error: {e}")
        # Fallback to rule-based logic if API fails
        level = fallback_level
        attack = fallback_attack
        recs = fallback_recs

    # Return a single formatted string
    return f"""Threat Level: {level}
Possible Attack: {attack}
Risk Score: {threat_rate}%

Recommendations:
""" + "\n".join([f"- {r}" for r in recs])
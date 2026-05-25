from itertools import combinations
import requests
import json

DRUG_CLASS_MAP = {
    "penicillin": ["amoxicillin", "ampicillin", "penicillin", "flucloxacillin"],
    "nsaid": ["ibuprofen", "aspirin", "naproxen", "diclofenac"],
    "sulfonamide": ["sulfamethoxazole", "trimethoprim", "sulfadiazine"],
    "statin": ["atorvastatin", "simvastatin", "rosuvastatin", "lovastatin"],
    "opioid": ["tramadol", "oxycodone", "codeine", "morphine", "fentanyl"],
}


def load_fallback_data():
    with open("data/fallback_interactions.json","r") as f:
        data = json.load(f)
    return data

def check_interactions_fallback(medicines: list[str], fallback_data: list) -> list:
    pairs = list(combinations(medicines,2))
    results = []
    for pair in pairs:
        drug_1 = pair[0]
        drug_2 = pair[1]

        for entry in fallback_data:
            if (entry["drug_a"].lower() == drug_1.lower() and entry["drug_b"].lower() == drug_2.lower()) or (entry["drug_a"].lower() == drug_2.lower() and entry["drug_b"].lower() == drug_1.lower()):
                results.append(entry)

    return results

def check_allergies(medicines: list[str], known_allergies: list[str]) -> list:
    # For each medicine, check if it matches any known allergy
    # Return a list of allergy alerts
    matches = []
    for medicine in medicines:
        for known_allergy in known_allergies:
            #exact matching
            if medicine.lower() == known_allergy.lower():
                matches.append({
                    "medicine": medicine,
                    "reason": f"Patient is allergic to {known_allergy}",
                    "severity": "high"
                })

            #mapping with drug classes
            else:
                for drug_class, drug_items in DRUG_CLASS_MAP.items():
                    if known_allergy.lower() == drug_class.lower() and medicine.lower() in drug_items:
                        matches.append({
                            "medicine": medicine,
                            "reason": f"{drug_class} class",
                            "severity": "high"
                        })

    return matches

def parse_llm_response(content: str) -> dict:
    try:
        content = content.strip()
        #removing md output if any by the llm
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]

        #finding { } brackets in json to extract pure json

        start = content.index("{")
        end = content.rindex("}")+1
        content = content[start:end]

        #loading content
        data = json.loads(content)

        #ensuring required fields atleast contain default values
        data.setdefault("interactions",[])
        data.setdefault("allergy_alerts",[])
        data.setdefault("requires_doctor_review",True)

        return data
    
    except Exception:
        return {
            "interactions": [],
            "allergy_alerts": [],
            "requires_doctor_review": True
        }
    
def check_interactions_llm(medicines: list[str], patient_history) -> dict:
    with open("prompts/system_prompt.txt", "r") as f:
        system_prompt = f.read()

    user_message = json.dumps({
        "medicines": medicines,
        "patient_history": {
            "age": patient_history.age,
            "weight": patient_history.weight,
            "known_allergies": patient_history.known_allergies,
            "current_medications": patient_history.current_medications,
            "conditions": patient_history.conditions
        }
    }, indent=2)

    response = requests.post(
        "http://localhost:11434/api/chat",
        json={
            "model": "qwen2.5",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            "stream": False
        },
        timeout = 30
    )

    response.raise_for_status()

    content = response.json()["message"]["content"]
    return parse_llm_response(content)


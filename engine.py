from itertools import combinations
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
            print(f"Comparing: {medicine.lower()} vs {known_allergy.lower()}")

            #exact matching
            if medicine.lower() == known_allergy.lower():
                matches.append({
                    "medicine": medicine,
                    "reason": f"Patient is allergic to {known_allergy}",
                    "severity": "high"
                })

    return matches
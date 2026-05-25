import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from engine import check_allergies, check_interactions_fallback

# Test 1 — exact allergy match
def test_exact_allergy_match():
    result = check_allergies(["Penicillin"], ["Penicillin"])
    assert len(result) == 1
    assert result[0]["medicine"] == "Penicillin"
    assert result[0]["severity"] == "high"

# Test 2 — no allergy match
def test_no_allergy_match():
    result = check_allergies(["Warfarin"], ["Penicillin"])
    assert len(result) == 0

# Test 3 — fallback interaction found
def test_fallback_interaction_found():
    fake_fallback = [
        {
            "drug_a": "Warfarin",
            "drug_b": "Aspirin",
            "severity": "high",
            "mechanism": "test",
            "clinical_recommendation": "test",
            "source_confidence": "high"
        }
    ]
    result = check_interactions_fallback(["Warfarin", "Aspirin"], fake_fallback)
    assert len(result) == 1
    assert result[0]["drug_a"].lower() == "warfarin"
    assert result[0]["drug_b"].lower() == "aspirin"

# Test 4 — fallback no match
def test_fallback_no_match():
    fake_fallback = [
        {
            "drug_a": "Warfarin",
            "drug_b": "Aspirin",
            "severity": "high",
            "mechanism": "test",
            "clinical_recommendation": "test",
            "source_confidence": "high"
        }
    ]
    result = check_interactions_fallback(["Metformin", "Ibuprofen"], fake_fallback)
    assert len(result) == 0

# Test 5 — drug class allergy match
def test_drug_class_allergy_match():
    result = check_allergies(["Amoxicillin"], ["penicillin"])
    assert len(result) == 1
    assert result[0]["medicine"] == "Amoxicillin"
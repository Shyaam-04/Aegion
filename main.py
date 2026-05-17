from fastapi import FastAPI
from models import DrugCheckRequest, DrugCheckResponse
from engine import load_fallback_data, check_interactions_fallback, check_allergies
import time
app = FastAPI()

@app.get("/health")
def home():
    return{
        "status":"ok"
    }

@app.post("/check-drugs")
def check_drugs(request: DrugCheckRequest):
    start_time = time.time()
    fallback_data = load_fallback_data()
    interactions = check_interactions_fallback(request.medicines, fallback_data)
    allergies = check_allergies(request.medicines, request.patient_history.known_allergies)
    response_time = int((time.time() - start_time)*1000)   #since response time should be in ms

    #calculation of overall_risk_level
    all_severities = [i["severity"] for i in interactions]+[a["severity"] for a in allergies]
    if "high" in all_severities:
        overall_risk_level = "high"
    elif "medium" in all_severities:
        overall_risk_level = "medium"
    else:
        overall_risk_level = "low"

    #safe_to_prescribe calculation
    safe_to_prescribe = len(interactions) == 0 and len(allergies) == 0

    #requires_doctor_review calculation
    requires_doctor_review = "high" in all_severities



    return DrugCheckResponse(
        interactions = interactions,
        allergy_alerts = allergies,
        safe_to_prescribe = safe_to_prescribe,
        overall_risk_level = overall_risk_level,
        requires_doctor_review = requires_doctor_review,
        source = "fallback",
        cache_hit = False,
        processing_time_ms = response_time
    )


from fastapi import FastAPI
from models import DrugCheckRequest, DrugCheckResponse
from engine import load_fallback_data, check_interactions_fallback, check_allergies, check_interactions_llm
from cache import make_cache_key, get_from_cache, save_to_cache
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

    #checking cache
    cache_key = make_cache_key(request.medicines, request.patient_history.current_medications)
    cache = get_from_cache(cache_key)
    if cache:
        cache["cache_hit"] = True
        cache["processing_time_ms"] = 0
        return cache
    
    #checking llm
    try:
        source = "llm"
        llm_result = check_interactions_llm(request.medicines, request.patient_history)
        interactions = llm_result.get("interactions",[])
        allergies = llm_result.get("allergy_alerts",[])
        requires_doctor_review = llm_result.get("requires_doctor_review", True)

    except Exception:
        #checking fallback data incase llm failed
        source = "fallback"
        fallback_data = load_fallback_data()
        interactions = check_interactions_fallback(request.medicines, fallback_data)
        allergies = check_allergies(request.medicines, request.patient_history.known_allergies)
        requires_doctor_review = any(i.get("severity") == "high" for i in interactions)
        

    #calculation of overall_risk_level
    all_severities = ([i["severity"] for i in interactions if "severity" in i] + [a["severity"] for a in allergies if "severity" in a])
    if "high" in all_severities:
        overall_risk_level = "high"
    elif "medium" in all_severities:
        overall_risk_level = "medium"
    else:
        overall_risk_level = "low"

    # deterministic uncertainty escalation
    if any(i.get("source_confidence") == "low" for i in interactions):
        requires_doctor_review = True
    
    if any(i.get("source_confidence") == "high" for i in interactions):
        requires_doctor_review = False

    #safe_to_prescribe calculation
    safe_to_prescribe = len(interactions) == 0 and len(allergies) == 0
    response_time = int((time.time() - start_time)*1000)   #since response time should be in ms





    response =  DrugCheckResponse(
        interactions = interactions,
        allergy_alerts = allergies,
        safe_to_prescribe = safe_to_prescribe,
        overall_risk_level = overall_risk_level,
        requires_doctor_review = requires_doctor_review,
        source = source,
        cache_hit = False,
        processing_time_ms = response_time
    )
    save_to_cache(cache_key, response.model_dump())
    return response


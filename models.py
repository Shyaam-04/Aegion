from pydantic import BaseModel
from typing import Literal, Optional

class PatientHistory(BaseModel):
    age: Optional[int] = None
    weight: Optional[float] = None
    known_allergies: list[str]
    current_medications: list[str]
    conditions: list[str]

class DrugCheckRequest(BaseModel):
    medicines: list[str]
    patient_history: PatientHistory

class InteractionResult(BaseModel):
    drug_a: str
    drug_b: str
    severity: Literal["high","medium","low"]
    mechanism: str
    clinical_recommendation: str
    source_confidence: Optional[Literal["high","medium","low"]] = None

class AllergyAlert(BaseModel):
    medicine: str
    reason: str
    severity: Literal["high","medium","low"]

class DrugCheckResponse(BaseModel):
    interactions: list[InteractionResult]
    allergy_alerts: list[AllergyAlert]
    safe_to_prescribe: bool
    overall_risk_level: Literal["high","medium","low"]
    requires_doctor_review: bool
    source: Literal["llm","fallback"]
    cache_hit: bool
    processing_time_ms: int





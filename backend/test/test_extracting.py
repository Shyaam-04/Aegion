import json

with open("/Users/shyaam_karodiya/Downloads/drug-label-0001-of-0013.json", "r") as f:
    data = json.load(f)

results = data["results"]

# Count how many records actually have drug_interactions
has_interactions = [r for r in results if "drug_interactions" in r and r["drug_interactions"]]

print(f"Total records: {len(results)}")
print(f"Records WITH drug_interactions: {len(has_interactions)}")

# Preview one that has it
if has_interactions:
    sample = has_interactions[0]
    openfda = sample.get("openfda", {})
    name = openfda.get("generic_name", ["UNKNOWN"])[0]
    text = sample["drug_interactions"][0][:200]
    print(f"\nSample drug: {name}")
    print(f"Interaction text: {text}...")

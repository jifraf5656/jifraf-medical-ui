from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="JIFRAF Medical Core API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/case-data")
async def get_case_data():
    return {
        "vitals": [
            {"label": "Pulse", "value": "145", "unit": "bpm", "color": "yellow", "glow": True},
            {"label": "BP", "value": "88/52", "unit": "mmHg", "color": "yellow", "glow": True},
            {"label": "SpO2", "value": "89", "unit": "%", "color": "yellow", "glow": True},
            {"label": "Temp", "value": "38.8", "unit": "°C", "color": "yellow", "glow": True},
            {"label": "Respiratory", "value": "28", "unit": "/min", "color": "yellow", "glow": True},
            {"label": "Blood Glucose", "value": "110", "unit": "mg/dL", "color": "green", "glow": False},
            {"label": "Consciousness", "value": "Alert", "unit": "", "color": "green", "glow": False},
        ],
        "anamnesis": [
            {"label": "Ana Şikayet", "value": "Ani Başlayan Dyspnea and Chest Pain"},
            {"label": "Başlangıç Zamanı", "value": "30 dk önce"},
            {"label": "Ağrı Tipi", "value": "Pleuritic"},
            {"label": "Ek Semptomlar", "value": "Baş Dönmesi, Terleme"},
        ],
        "diagnoses": [
            {"name": "Pulmoner Emboli", "prob": 78, "color": "orange"},
            {"name": "Akut Koroner Sendrom", "prob": 65, "color": "orange"},
            {"name": "Pnömotoraks", "prob": 15, "color": "orange"}
        ],
        "timeline": [
            {"time": "12:00", "title": "Admission", "sub": "", "color": "cyan"},
            {"time": "12:05", "title": "Anamnez", "sub": "", "color": "cyan"},
            {"time": "12:10", "title": "EKG", "sub": "→ *PE Supported", "color": "green"},
            {"time": "12:15", "title": "Vitals", "sub": "*AKS Supported", "color": "yellow"},
            {"time": "12:30", "title": "Lab Results", "sub": "+ Troponin +", "color": "red"}
        ]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)

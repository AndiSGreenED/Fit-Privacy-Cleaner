from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

app = FastAPI(title="Fit Privacy Cleaner")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "ok"}


@app.get("/app")
def app_ui():
    return FileResponse("../frontend/index.html")


@app.post("/analyze")
async def analyze_fit(file: UploadFile = File(...)):

    content = await file.read()

    return {
        "success": True,
        "filename": file.filename,
        "size_bytes": len(content),
        "heart_rate": True,
        "gps": True,
        "power": True,
        "cadence": True,
        "device_info": True
    }
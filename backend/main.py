from fastapi import FastAPI, UploadFile, File

app = FastAPI(title="Fit Privacy Cleaner")


@app.get("/")
def root():
    return {
        "status": "ok",
        "service": "Fit Privacy Cleaner"
    }


@app.post("/analyze")
async def analyze_fit(file: UploadFile = File(...)):
    content = await file.read()

    result = {
        "filename": file.filename,
        "size_bytes": len(content),
        "uploaded": True
    }
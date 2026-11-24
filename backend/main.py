from fastapi import FastAPI

app = FastAPI(
    title="Fit Privacy Cleaner"
)

@app.get("/")
def root():
    return {
        "status": "ok",
        "service": "Fit Privacy Cleaner"
    }
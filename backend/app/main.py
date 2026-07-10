from fastapi import FastAPI

app = FastAPI(
    title="Seat Allocation API",
    version="1.0.0"
)

@app.get("/")
def root():
    return {"message": "Seat Allocation API is running 🚀"}
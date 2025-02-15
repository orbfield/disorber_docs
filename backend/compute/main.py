from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ComputeRequest(BaseModel):
    value: float
    multiplier: float

@app.post("/compute")
async def compute(request: ComputeRequest):
    result = request.value * request.multiplier
    return {"result": result}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_json()
            result = data['value'] * data['multiplier']
            await websocket.send_json({"result": result})
    except:
        await websocket.close()

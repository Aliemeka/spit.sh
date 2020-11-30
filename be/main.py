from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def main():
    return {'message': 'Hello World!'}

@app.get("/{id}")
async def find(id: int):
    return {"id": id}
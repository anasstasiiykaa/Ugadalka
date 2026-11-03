from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random

app = FastAPI(title="Guess Game API")

# Дозволяємо React-фронтенду робити запити до нашого сервера (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Змінна для збереження стану поточного раунду гри
game_state = {
    "user_name": "",
    "secret_number": 0,
    "attempts_left": 3,
    "max_attempts": 3,
    "is_active": False
}

class StartGameRequest(BaseModel):
    user_name: str

class MakeGuessRequest(BaseModel):
    guess: int

@app.post("/api/start")
def start_game(req: StartGameRequest):
    name = req.user_name.strip() if req.user_name.strip() else "Гравець"
    secret = random.randint(1, 10)
    
    game_state["user_name"] = name
    game_state["secret_number"] = secret
    game_state["attempts_left"] = 3
    game_state["is_active"] = True

    return {
        "user_name": name,
        "attempts_left": 3,
        "secret_number": secret,  # Згідно з умовою завдання виводимо загадане число
        "message": f"Привіт, {name}! Я загадав число від 1 до 10. У вас є 3 спроби."
    }

@app.post("/api/guess")
def make_guess(req: MakeGuessRequest):
    if not game_state["is_active"]:
        raise HTTPException(status_code=400, detail="Гра не розпочата!")

    guess = req.guess
    if not (1 <= guess <= 10):
        raise HTTPException(status_code=400, detail="Введіть число від 1 до 10!")

    game_state["attempts_left"] -= 1
    attempts_left = game_state["attempts_left"]
    attempts_used = game_state["max_attempts"] - attempts_left
    name = game_state["user_name"]
    secret = game_state["secret_number"]

    # 1. Якщо число вгадано
    if guess == secret:
        game_state["is_active"] = False
        return {
            "status": "win",
            "attempts_used": attempts_used,
            "attempts_left": attempts_left,
            "message": f"🎉 Вітаємо, {name}! Ви вгадали число {secret} з {attempts_used}-ї спроби!"
        }

    # 2. Якщо спроби закінчилися
    if attempts_left <= 0:
        game_state["is_active"] = False
        return {
            "status": "lose",
            "attempts_used": 3,
            "attempts_left": 0,
            "secret_number": secret,
            "message": f"😔 На жаль, {name}, ви вичерпали всі 3 спроби. Загадане число було: {secret}."
        }

    # 3. Якщо гра триває (підказка більше/менше)
    hint = "БІЛЬШЕ" if secret > guess else "МЕНШЕ"
    return {
        "status": "continue",
        "attempts_used": attempts_used,
        "attempts_left": attempts_left,
        "message": f"💬 {name}, загадане число {hint} за {guess}."
    }

from fastapi import FastAPI, Request, Form
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import random

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

class GameLogic:
    def __init__(self):
        self.choices = ['rock', 'paper', 'scissors']
        
    def get_computer_choice(self, difficulty):
        if difficulty == 'easy':
            return random.choice(self.choices)
        elif difficulty == 'medium':
            # 50% chance of making a smart choice
            if random.random() < 0.5:
                return random.choice(self.choices)
            else:
                return self.get_winning_move(random.choice(self.choices))
        else:  # hard
            # 75% chance of making a smart choice
            if random.random() < 0.75:
                return self.get_winning_move(random.choice(self.choices))
            else:
                return random.choice(self.choices)
    
    def get_winning_move(self, choice):
        if choice == 'rock':
            return 'paper'
        elif choice == 'paper':
            return 'scissors'
        else:
            return 'rock'
    
    def determine_winner(self, player_choice, computer_choice):
        if player_choice == computer_choice:
            return 'tie'
        elif (
            (player_choice == 'rock' and computer_choice == 'scissors') or
            (player_choice == 'paper' and computer_choice == 'rock') or
            (player_choice == 'scissors' and computer_choice == 'paper')
        ):
            return 'player'
        else:
            return 'computer'

game = GameLogic()

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse(
        "index.html",
        {"request": request}
    )

@app.post("/play")
async def play(
    player_choice: str = Form(...),
    difficulty: str = Form(...)
):
    computer_choice = game.get_computer_choice(difficulty)
    result = game.determine_winner(player_choice, computer_choice)
    
    return JSONResponse({
        "player_choice": player_choice,
        "computer_choice": computer_choice,
        "result": result
    })

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

from fastapi import FastAPI, Request, Form, HTTPException
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
        self.last_player_choices = []
        self.max_history = 5
        
    def get_computer_choice(self):
        if len(self.last_player_choices) < 2:
            return random.choice(self.choices)
            
        if len(set(self.last_player_choices[-2:])) == 1:
            counter_move = self.get_winning_move(self.last_player_choices[-1])
            return counter_move
            
        if random.random() < 0.7:
            return random.choice(self.choices)
        else:
            return self.get_winning_move(self.last_player_choices[-1])
    
    def get_winning_move(self, choice):
        winning_moves = {
            'rock': 'paper',
            'paper': 'scissors',
            'scissors': 'rock'
        }
        return winning_moves[choice]
    
    def determine_winner(self, player_choice, computer_choice):
        if player_choice not in self.choices:
            raise HTTPException(status_code=400, detail="Invalid choice")
            
        self.last_player_choices.append(player_choice)
        if len(self.last_player_choices) > self.max_history:
            self.last_player_choices.pop(0)
            
        if player_choice == computer_choice:
            return 'tie'
            
        winning_combinations = {
            'rock': 'scissors',
            'paper': 'rock',
            'scissors': 'paper'
        }
        
        return 'player' if winning_combinations[player_choice] == computer_choice else 'computer'

game = GameLogic()

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse(
        "index.html",
        {"request": request}
    )

@app.post("/play")
async def play(request: Request, player_choice: str = Form(...)):
    try:
        if player_choice not in game.choices:
            raise HTTPException(status_code=400, detail="Invalid choice")
            
        computer_choice = game.get_computer_choice()
        result = game.determine_winner(player_choice, computer_choice)
        
        return JSONResponse({
            "player_choice": player_choice,
            "computer_choice": computer_choice,
            "result": result,
            "status": "success"
        })
    except Exception as e:
        return JSONResponse({
            "status": "error",
            "message": str(e)
        }, status_code=500)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

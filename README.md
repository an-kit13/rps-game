
Cyber RPS Arena 🎮

A modern, interactive Rock Paper Scissors game with a futuristic design and dark mode support. Built with FastAPI and vanilla JavaScript.

## 🛠️ Technologies Used

- **Backend**
  - FastAPI
  - Python 3.8+
  - Uvicorn
  - Jinja2 Templates

- **Frontend**
  - HTML5
  - CSS3 (with CSS Variables)
  - Vanilla JavaScript
  - Custom Animations

## 📁 Project Structure

```
project/
├── static/
│   ├── css/
│   │   ├── styles.css    # Main styles
│   │   ├── themes.css    # Theme variables
│   │   └── animations.css # Animation keyframes
│   └── js/
│       └── game.js       # Game logic
├── templates/
│   └── index.html        # Main HTML template
└── main.py              # FastAPI application
```

## 🚀 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/an-kit13/rps-game.git
   cd rps-game
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\\Scripts\\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the application:
   ```bash
   uvicorn main:app --reload
   ```

5. Visit `http://localhost:8000` in your browser


## 🎨 Customization

### Adding New Themes

1. Modify `themes.css`:
   ```css
   [data-theme="your-theme"] {
       --bg-primary: #your-color;
       --accent-color: #your-accent;
       /* Add other variables */
   }
   ```

### Modifying Difficulty Levels

1. Update the `GameLogic` class in `main.py`:
   ```python
   def get_computer_choice(self, difficulty):
       # Add your custom logic
       pass
   ```

## 🙏 Acknowledgments

- Inspired by the classic Rock Paper Scissors game
- Built with modern web technologies
- Designed for an engaging user experience

---

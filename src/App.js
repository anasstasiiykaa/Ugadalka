import React, { useState } from 'react';
import './App.css';

function App() {
  const [nameInput, setNameInput] = useState('');
  const [guessInput, setGuessInput] = useState('');
  
  const [userName, setUserName] = useState('');
  const [secretNumber, setSecretNumber] = useState(null);
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [attemptsUsed, setAttemptsUsed] = useState(0);
  const [message, setMessage] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const handleStart = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_name: nameInput }),
      });
      const data = await response.json();

      setUserName(data.user_name);
      setSecretNumber(data.secret_number);
      setAttemptsLeft(data.attempts_left);
      setAttemptsUsed(0);
      setMessage(data.message);
      setGameStarted(true);
      setGameOver(false);
      setGuessInput('');
    } catch (error) {
      alert("Не вдалося з'єднатися з сервером. Перевірте, чи запущено Python!");
    }
  };

  const handleGuess = async () => {
    if (!guessInput) return;

    try {
      const response = await fetch('http://127.0.0.1:8000/api/guess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guess: parseInt(guessInput) }),
      });
      const data = await response.json();

      if (response.status !== 200) {
        alert(data.detail);
        return;
      }

      setAttemptsLeft(data.attempts_left);
      setAttemptsUsed(data.attempts_used);
      setMessage(data.message);

      if (data.status === 'win' || data.status === 'lose') {
        setGameOver(true);
      }
      setGuessInput('');
    } catch (error) {
      alert("Помилка при відправці спроби!");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>🎯 Гра «Вгадай число»</h1>

        {!gameStarted ? (
          <div className="form-group">
            <label>Введіть ваш юзернейм:</label>
            <input
              type="text"
              placeholder="Ваш юзернейм..."
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
            />
            <button onClick={handleStart}>гоу ту плей</button>
          </div>
        ) : (
          <div className="game-area">
            <div className="hint-box">
              [Загадане число на екрані]: <strong>{secretNumber}</strong>
            </div>

            <div className="info-bar">
              <p>Гравець: <strong>{userName}</strong></p>
              <p>Спроби: <strong>{attemptsUsed} / 3</strong></p>
            </div>

            {!gameOver && (
              <div className="form-group">
                <input
                  type="number"
                  min="1"
                  max="10"
                  placeholder="Число від 1 до 10"
                  value={guessInput}
                  onChange={(e) => setGuessInput(e.target.value)}
                />
                <button onClick={handleGuess}>Спробувати</button>
              </div>
            )}

            <div className="message-box">{message}</div>

            {gameOver && (
              <button className="restart-btn" onClick={() => setGameStarted(false)}>
                Зіграти ще раз
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
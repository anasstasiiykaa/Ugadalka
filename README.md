# Гра «Вгадай число»

Проєкт містить React-фронтенд у `frontend/` і FastAPI-бекенд у `backend/`.

## Запуск бекенду

У першому терміналі PowerShell з кореня проєкту:

```powershell
py -m venv backend\.venv
backend\.venv\Scripts\Activate.ps1
py -m pip install -r backend\requirements.txt
py -m uvicorn main:app --reload --app-dir backend
```

API буде доступний на http://127.0.0.1:8000, документація API — на http://127.0.0.1:8000/docs.

## Запуск фронтенду

У другому терміналі PowerShell з кореня проєкту:

```powershell
cd frontend
npm install
npm start
```

Вебсторінка відкриється на http://localhost:3000. Фронтенд звертається до бекенду на `http://127.0.0.1:8000`.

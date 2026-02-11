# 🚀 Bajaj Task – Backend API Project

A structured REST API built using **Node.js** and **Express.js** that performs mathematical operations and integrates AI-powered responses.

---

## 📌 Features

- ✅ Health Check Endpoint  
- 🔢 Generate Fibonacci Sequence  
- 🔍 Filter Prime Numbers  
- ➗ Compute HCF (Highest Common Factor)  
- ✖️ Compute LCM (Least Common Multiple)  
- 🤖 AI-based Response Endpoint  
- 📦 Standardized JSON Response Utility  
- 🧠 Clean Service-Based Architecture  

---

## 🏗️ Project Structure

```
.
├── controllers/
│   └── math.controller.js
├── services/
│   ├── math.service.js
│   └── ai.service.js
├── utils/
│   └── response.util.js
├── routes/
│   └── routes.js
├── app.js
├── server.js
└── package.json
```

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- JavaScript (ES6+)
- OpenAI API
- Vercel (Deployment Ready)

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Kaemikun/Bajaj-Task.git
cd Bajaj-Task
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Setup Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
OPENAI_API_KEY=your_openai_api_key_here
```

### 4️⃣ Run the Server

```bash
npm run dev
```

or

```bash
npm start
```

Server will run at:

```
http://localhost:3000
```

---

## 📡 API Endpoints

### 🩺 Health Check

**GET** `/health`

Response:
```json
{
  "status": "OK"
}
```

---

### 🔢 Generate Fibonacci

**POST** `/fibonacci`

Request Body:
```json
{
  "n": 10
}
```

---

### 🔍 Filter Prime Numbers

**POST** `/primes`

Request Body:
```json
{
  "numbers": [1,2,3,4,5,6]
}
```

---

### ➗ Compute HCF

**POST** `/hcf`

Request Body:
```json
{
  "a": 12,
  "b": 18
}
```

---

### ✖️ Compute LCM

**POST** `/lcm`

Request Body:
```json
{
  "a": 12,
  "b": 18
}
```

---

### 🤖 AI Response

**POST** `/ask-ai`

Request Body:
```json
{
  "prompt": "Explain recursion in simple terms"
}
```

---

## 🌍 Deployment (Vercel)

1. Push code to GitHub
2. Import project into Vercel
3. Add Environment Variable:
   - `OPENAI_API_KEY`
4. Deploy 🚀

---

## 📈 Future Improvements

- Input Validation Middleware
- Rate Limiting
- Swagger API Documentation
- Unit Testing with Jest
- Docker Support

---

## 👨‍💻 Author

Ansh Kaushal  
Backend Developer | Java & Node.js Enthusiast  

---

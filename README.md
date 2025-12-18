# FormSync AI

A dynamic form generation platform powered by Google Gemini AI, FastAPI, and Next.js. This application allows users to describe a form in natural language (e.g., "Create a job application form") and instantly generates a fully functional, validate-able form schema.

## 🚀 Features
- **AI-Powered Generation**: Uses Google Gemini Flash to convert text to JSON schemas.
- **Dynamic Rendering**: React frontend renders forms instantly from JSON.
- **Modern Stack**: Built with Next.js 15, TailwindCSS, FastAPI, and Supabase.

## 🛠️ Tech Stack
- **Frontend**: Next.js 15 (React 19), TailwindCSS, Lucide Icons.
- **Backend**: FastAPI (Python), Pydantic.
- **AI Model**: Google Gemini 1.5 Flash (via REST API).
- **Database**: Supabase (PostgreSQL).

## 📋 Prerequisites
- Node.js 18+
- Python 3.11+
- Google Gemini API Key (get one at [aistudio.google.com](https://aistudio.google.com/))
- Supabase Project (optional for storage)

## 🏁 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/Hensi43/FormSync-AI.git
cd FormSync-AI
```

### 2. Backend Setup (FastAPI)
Navigate to the `apps/api` folder:
```bash
# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r apps/api/requirements.txt
```

**Configure Environment Variables:**
Create `apps/api/.env` and add your keys:
```env
GEMINI_API_KEY=your_gemini_api_key_here
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
```

**Run the Server:**
```bash
cd apps/api
uvicorn main:app --reload --port 8000
```
The API will be available at `http://localhost:8000`. Test it with `http://localhost:8000/health`.

### 3. Frontend Setup (Next.js)
Open a new terminal and navigate to `apps/web`:
```bash
cd apps/web

# Install dependencies
npm install
```

**Run the Development Server:**
```bash
npm run dev
```
The Frontend will be available at `http://localhost:3000`.

## 🧪 Usage
1. Open the frontend at `http://localhost:3000`.
2. In the text area, type a description like:
   > "Create a registration form for a hackathon with fields for team name, number of members, project idea, and dietary restrictions."
3. Click **"Generate JSON Schema"**.
4. The AI will generate the form structure, and you will see a live preview of the form on the right/bottom.

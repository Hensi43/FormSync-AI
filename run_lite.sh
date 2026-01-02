#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== FormSync AI Lite Launcher ===${NC}"

# Function to kill process on a port
kill_port() {
  local port=$1
  local pid=$(lsof -ti :$port)
  if [ ! -z "$pid" ]; then
    echo "Stopping process on port $port (PID: $pid)..."
    kill -9 $pid
  fi
}

# 1. Cleanup existing processes
echo -e "${BLUE}Cleaning up existing processes...${NC}"
kill_port 8000
kill_port 3000

# 2. Start Backend (No Reload for better performance)
echo -e "${GREEN}Starting Backend (Lite Mode)...${NC}"
cd apps/api
# Check if venv exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    ./venv/bin/pip install -r requirements.txt
fi

# Run uvicorn without --reload
# Using execution in background
./venv/bin/uvicorn main:app --port 8000 > ../../backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend started (PID: $BACKEND_PID). Logs: backend.log"
cd ../..

# 3. Start Frontend
echo -e "${GREEN}Starting Frontend...${NC}"
cd apps/web
# Run next dev. Note: Turbopack is default in Next 15+ for local dev, 
# but we can try running it as is. If we wanted production performance we'd build & start, 
# but that loses dev capability.
# We run this in foreground so user can see output and Ctrl+C kills it
npm run dev

# Cleanup on exit
kill $BACKEND_PID

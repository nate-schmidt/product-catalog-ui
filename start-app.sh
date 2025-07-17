#!/bin/bash

# Start the backend service
echo "Starting backend service..."
cd product-catalog-service
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python init_db.py
python main.py &
BACKEND_PID=$!
cd ..

# Give backend time to start
sleep 2

# Start the frontend
echo "Starting frontend service..."
cd product-catalog-ui
bun install
bun dev &
FRONTEND_PID=$!

echo "Services started!"
echo "Backend API: http://localhost:8000"
echo "Frontend UI: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both services"

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
#!/bin/bash
cd /home/cse/exam_sriya/examseating/backend
source venv/bin/activate
nohup python app.py > server.log 2>&1 &
echo $! > server.pid
echo "Server started with PID: $(cat server.pid)"
echo "Access at: http://localhost:5000"
echo "Logs: backend/server.log"

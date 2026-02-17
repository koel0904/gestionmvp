import subprocess
import signal
import sys
import os

def signal_handler(sig, frame):
    print("\nStopping servers...")
    # Terminate processes
    if backend_process:
        backend_process.terminate()
    if frontend_process:
        frontend_process.terminate()
    sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)

print("Starting Backend Server...")
# Run 'npm run server' in the current directory (root)
backend_process = subprocess.Popen(["npm", "run", "server"], cwd=".")

print("Starting Frontend Server...")
# Run 'npm run dev' in the gestionapp subdirectory
frontend_process = subprocess.Popen(["npm", "run", "dev"], cwd="./gestion-FRV")

# Wait for processes to finish (they won't unless crashed or stopped)
backend_process.wait()
frontend_process.wait()

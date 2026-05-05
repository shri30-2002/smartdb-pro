import psutil
import socket
import json
import os

FILE_NAME = "servers.json"

# ---------------- LOAD SERVERS ----------------
def load_servers():
    if not os.path.exists(FILE_NAME):
        return []

    with open(FILE_NAME, "r") as file:
        return json.load(file)

# ---------------- SAVE SERVERS ----------------
def save_servers(data):
    with open(FILE_NAME, "w") as file:
        json.dump(data, file, indent=2)

# Global server list
servers = load_servers()

# ---------------- MAIN SCAN ----------------
def scan_server(host="127.0.0.1", port=5432):
    result = {}

    # CPU
    result["cpu"] = psutil.cpu_percent(interval=1)

    # RAM
    result["ram"] = psutil.virtual_memory().percent

    # Disk
    result["disk"] = psutil.disk_usage("/").percent

    # PostgreSQL Main DB Check
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(2)

    try:
        sock.connect((host, port))
        result["database_status"] = "Running"
    except:
        result["database_status"] = "Offline"

    sock.close()

    # ---------------- MULTI SERVER CHECK ----------------
    checked_servers = []

    for server in servers:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(2)

        try:
            sock.connect((server["host"], server["port"]))
            status = "Running"
        except:
            status = "Offline"

        sock.close()

        checked_servers.append({
            "name": server["name"],
            "host": server["host"],
            "port": server["port"],
            "status": status
        })

    result["servers"] = checked_servers

    return result
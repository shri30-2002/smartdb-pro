import psutil
import socket

# ---------------- SERVER LIST ----------------
servers = [
    {
        "name": "Local PostgreSQL",
        "host": "127.0.0.1",
        "port": 5432
    },
    {
        "name": "Local MySQL",
        "host": "127.0.0.1",
        "port": 3306
    },
    {
        "name": "Test Server",
        "host": "8.8.8.8",
        "port": 53
    }
]

# ---------------- CHECK ONE SERVER ----------------
def check_database(host, port):
    sock = socket.socket(
        socket.AF_INET,
        socket.SOCK_STREAM
    )

    sock.settimeout(2)

    try:
        sock.connect((host, port))
        sock.close()
        return "Running"
    except:
        sock.close()
        return "Offline"

# ---------------- MAIN SCAN ----------------
def scan_server():
    result = {}

    # Machine Stats
    result["cpu"] = psutil.cpu_percent(interval=1)
    result["ram"] = psutil.virtual_memory().percent
    result["disk"] = psutil.disk_usage("/").percent

    # Multi Servers
    result["servers"] = []

    for server in servers:
        status = check_database(
            server["host"],
            server["port"]
        )

        result["servers"].append({
            "name": server["name"],
            "host": server["host"],
            "port": server["port"],
            "status": status
        })

    # First server quick status
    result["database_status"] = result[
        "servers"
    ][0]["status"]

    return result
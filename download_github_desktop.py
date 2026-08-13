import os
import urllib.request

URL = "https://central.github.com/deployments/desktop/desktop/latest/win32"
DOWNLOAD_DIR = r"C:\Users\dell\Downloads"
TARGET_FILE = os.path.join(DOWNLOAD_DIR, "GitHubDesktopSetup-x64.exe")

def download_desktop():
    if not os.path.exists(DOWNLOAD_DIR):
        os.makedirs(DOWNLOAD_DIR)
        
    print(f"Downloading GitHub Desktop installer from {URL} to {TARGET_FILE}...")
    req = urllib.request.Request(URL, headers={"User-Agent": "Antigravity-Agent"})
    
    with urllib.request.urlopen(req) as resp, open(TARGET_FILE, "wb") as f:
        f.write(resp.read())

    print("GitHub Desktop setup executable successfully downloaded!")

if __name__ == "__main__":
    download_desktop()

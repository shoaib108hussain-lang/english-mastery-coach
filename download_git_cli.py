import os
import sys
import zipfile
import urllib.request

URL = "https://github.com/cli/cli/releases/download/v2.42.0/gh_2.42.0_windows_amd64.zip"
ZIP_PATH = os.path.join(os.path.dirname(__file__), "gh_cli.zip")
TARGET_DIR = os.path.dirname(__file__)

def download_and_extract():
    print(f"Downloading standalone GitHub CLI binary from {URL}...")
    req = urllib.request.Request(URL, headers={"User-Agent": "Antigravity-Agent"})
    
    with urllib.request.urlopen(req) as resp, open(ZIP_PATH, "wb") as f:
        f.write(resp.read())
        
    print("Extracting standalone gh.exe tool...")
    with zipfile.ZipFile(ZIP_PATH, 'r') as zip_ref:
        for member in zip_ref.namelist():
            if member.endswith("gh.exe"):
                filename = os.path.basename(member)
                target_path = os.path.join(TARGET_DIR, filename)
                with zip_ref.open(member) as source, open(target_path, "wb") as target:
                    target.write(source.read())
                print(f"Extracted standalone executable: {target_path}")
                break

    if os.path.exists(ZIP_PATH):
        os.remove(ZIP_PATH)

    print("GitHub CLI tool is ready for instant execution!")

if __name__ == "__main__":
    download_and_extract()

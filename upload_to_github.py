import os
import sys
import json
import base64
import urllib.request
import urllib.error

REPO_NAME = "english-mastery-coach"
DESCRIPTION = "English Mastery Coach (Start -> B2) - 13 Parts, 100 Stages, 8-Skill Integrated Learning, Speakometer Accent Engine"
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

def make_request(url, token, data=None, method="GET"):
    headers = {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "Antigravity-Agent"
    }
    encoded_data = json.dumps(data).encode('utf-8') if data else None
    req = urllib.request.Request(url, data=encoded_data, headers=headers, method=method)
    
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        err_body = e.read().decode('utf-8')
        print(f"HTTP Error {e.code}: {err_body}")
        return None

def upload_project(token, is_private=False):
    print(f"Initializing GitHub upload for {REPO_NAME}...")
    
    # 1. Check/Create Repository
    user_info = make_request("https://api.github.com/user", token)
    if not user_info:
        print("Invalid GitHub token or unauthorized request.")
        return False
    
    username = user_info["login"]
    print(f"Authenticated as GitHub user: {username}")
    
    repo_url = f"https://api.github.com/repos/{username}/{REPO_NAME}"
    existing_repo = make_request(repo_url, token)
    
    if not existing_repo:
        print(f"Creating new GitHub repository '{REPO_NAME}'...")
        create_payload = {
            "name": REPO_NAME,
            "description": DESCRIPTION,
            "private": is_private,
            "auto_init": False
        }
        new_repo = make_request("https://api.github.com/user/repos", token, data=create_payload, method="POST")
        if not new_repo:
            print("Failed to create repository.")
            return False
        print(f"Repository created: https://github.com/{username}/{REPO_NAME}")
    else:
        print(f"Found existing repository: https://github.com/{username}/{REPO_NAME}")

    # 2. Upload files
    files_to_upload = []
    for root, dirs, files in os.walk(DIRECTORY):
        for file in files:
            if file.endswith(('.pyc', '.zip', '.log', '.exe')) or '__pycache__' in root or 'gh_cli' in root:
                continue
            rel_path = os.path.relpath(os.path.join(root, file), DIRECTORY).replace("\\", "/")
            files_to_upload.append(rel_path)

    print(f"Uploading {len(files_to_upload)} files...")

    for file_path in files_to_upload:
        full_path = os.path.join(DIRECTORY, file_path.replace("/", os.sep))
        with open(full_path, "rb") as f:
            content_b64 = base64.b64encode(f.read()).decode("utf-8")

        file_api_url = f"https://api.github.com/repos/{username}/{REPO_NAME}/contents/{file_path}"
        existing_file = make_request(file_api_url, token)
        sha = existing_file["sha"] if existing_file and "sha" in existing_file else None

        put_payload = {
            "message": f"Upload {file_path}",
            "content": content_b64
        }
        if sha:
            put_payload["sha"] = sha

        res = make_request(file_api_url, token, data=put_payload, method="PUT")
        if res:
            print(f"  Uploaded: {file_path}")
        else:
            print(f"  Failed: {file_path}")

    print("\nSUCCESS! Your application is fully uploaded to GitHub!")
    print(f"Repository URL: https://github.com/{username}/{REPO_NAME}")
    return True

if __name__ == "__main__":
    token = os.environ.get("GITHUB_TOKEN")
    if len(sys.argv) > 1:
        token = sys.argv[1]

    if not token:
        print("Usage: python upload_to_github.py YOUR_GITHUB_PAT_TOKEN")
        sys.exit(1)

    upload_project(token)

import http.server
import socketserver
import os

PORT = 8095
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        if self.path == '/favicon.ico':
            self.send_response(204)
            self.end_headers()
            return
        super().do_GET()

if __name__ == "__main__":
    os.chdir(DIRECTORY)
    socketserver.TCPServer.allow_reuse_address = True
    while True:
        try:
            with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as httpd:
                print(f"Server running at http://0.0.0.0:{PORT}")
                httpd.serve_forever()
        except Exception as e:
            print(f"Server restarted after notice: {e}")

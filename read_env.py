import os

file_path = r"D:\acursor\avyna\.env.local"
if os.path.exists(file_path):
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        print(f.read())
else:
    print(f"File not found: {file_path}")

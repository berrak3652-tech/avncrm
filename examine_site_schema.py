import requests
import json

URL = "https://mdxsasiabwronqkegkuo.supabase.co"
KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1keHNhc2lhYndyb25xa2Vna3VvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxMTQ0MzEsImV4cCI6MjA4MzY5MDQzMX0.PpfYdieqVCKvItbCOMvdjKD_AdUdaw8pBdiNogUJQ5E"

headers = {
    "apikey": KEY,
    "Authorization": f"Bearer {KEY}"
}

def get_schema():
    # Fetch one record from each to see keys
    results = {}
    for table in ['products', 'orders']:
        r = requests.get(f"{URL}/rest/v1/{table}?limit=1", headers=headers)
        if r.status_code == 200:
            data = r.json()
            results[table] = data[0] if data else "Empty"
        else:
            results[table] = f"Error {r.status_code}"
    return results

if __name__ == "__main__":
    print(json.dumps(get_schema(), indent=2))

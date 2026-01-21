import requests
import json

URL = "https://mdxsasiabwronqkegkuo.supabase.co"
KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1keHNhc2lhYndyb25xa2Vna3VvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxMTQ0MzEsImV4cCI6MjA4MzY5MDQzMX0.PpfYdieqVCKvItbCOMvdjKD_AdUdaw8pBdiNogUJQ5E"

headers = {
    "apikey": KEY,
    "Authorization": f"Bearer {KEY}"
}

def get_order_items():
    r = requests.get(f"{URL}/rest/v1/order_items?limit=1", headers=headers)
    if r.status_code == 200:
        data = r.json()
        return data[0] if data else "Empty"
    return f"Error {r.status_code}"

if __name__ == "__main__":
    print(json.dumps(get_order_items(), indent=2))

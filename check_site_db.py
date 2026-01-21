import requests

URL = "https://mdxsasiabwronqkegkuo.supabase.co"
KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1keHNhc2lhYndyb25xa2Vna3VvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxMTQ0MzEsImV4cCI6MjA4MzY5MDQzMX0.PpfYdieqVCKvItbCOMvdjKD_AdUdaw8pBdiNogUJQ5E"

headers = {
    "apikey": KEY,
    "Authorization": f"Bearer {KEY}"
}

def check_tables():
    # Common table names in e-commerce
    tables = ['products', 'orders', 'customers', 'categories', 'profiles', 'order_items']
    results = {}
    for table in tables:
        try:
            r = requests.get(f"{URL}/rest/v1/{table}?limit=1", headers=headers)
            if r.status_code == 200:
                results[table] = "Exists"
            else:
                results[table] = f"Error {r.status_code}"
        except Exception as e:
            results[table] = str(e)
    return results

if __name__ == "__main__":
    print(check_tables())

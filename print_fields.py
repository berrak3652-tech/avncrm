import json

with open('site_schema.json', 'r', encoding='utf-16') as f:
    data = json.load(f)
    for table, record in data.items():
        print(f"--- {table} ---")
        if isinstance(record, dict):
            for k, v in record.items():
                print(f"{k}: {type(v).__name__}")
        else:
            print(record)

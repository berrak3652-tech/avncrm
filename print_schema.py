import json

with open('site_schema.json', 'r', encoding='utf-16') as f:
    data = json.load(f)
    print(json.dumps(data, indent=2, ensure_ascii=False))

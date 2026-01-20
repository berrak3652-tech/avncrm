import pandas as pd

xl = pd.ExcelFile(r'd:\acursor\avncrm\ÜRÜNLER MALİYET FİYAT.xlsx')

with open('excel_analysis.txt', 'w', encoding='utf-8') as f:
    f.write('=== ALL SHEETS ===\n')
    f.write(f'Sheet names: {xl.sheet_names}\n')

    for sheet in xl.sheet_names:
        f.write(f'\n\n{"="*80}\n')
        f.write(f'SHEET: {sheet}\n')
        f.write("="*80 + '\n')
        df = pd.read_excel(xl, sheet_name=sheet)
        f.write(f'Shape: {df.shape}\n')
        f.write(f'Columns: {list(df.columns)}\n')
        f.write('\nData Types:\n')
        f.write(str(df.dtypes) + '\n')
        f.write('\nFirst 30 rows:\n')
        pd.set_option('display.max_columns', None)
        pd.set_option('display.width', 500)
        pd.set_option('display.max_colwidth', 50)
        f.write(df.head(30).to_string() + '\n')
        f.write('\n\nAll unique values sample:\n')
        for col in df.columns:
            unique_vals = df[col].dropna().unique()[:15]
            f.write(f'  {col}: {list(unique_vals)}\n')
        
        # Statistics for numeric columns
        f.write('\nNumeric Statistics:\n')
        numeric_df = df.select_dtypes(include=['float64', 'int64'])
        if not numeric_df.empty:
            f.write(str(numeric_df.describe()) + '\n')

print('Analysis written to excel_analysis.txt')

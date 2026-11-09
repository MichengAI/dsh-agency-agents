import re
import json

# 读取 names.ts 中的 ZH_DIVISION 和 EN_DIVISION
with open('src/names.ts', 'r', encoding='utf-8') as f:
    names_content = f.read()

zh_div = {}
for m in re.finditer(r"['\"]?([\w-]+)['\"]?:\s*'([^']+)'", re.search(r'export const ZH_DIVISION[^{]+{([^}]+)}', names_content).group(1)):
    zh_div[m.group(1)] = m.group(2)

en_div = {}
for m in re.finditer(r"['\"]?([\w-]+)['\"]?:\s*'([^']+)'", re.search(r'export const EN_DIVISION[^{]+{([^}]+)}', names_content).group(1)):
    en_div[m.group(1)] = m.group(2)

# 读取 custom-locales.ts
with open('src/client/custom-locales.ts', 'r', encoding='utf-8') as f:
    custom_content = f.read()

def parse_entries(block):
    entries = {}
    for m in re.finditer(r"['\"]([\w.-]+)['\"]:\s*(?:'([^'\\]*(?:\\.[^'\\]*)*)'|\"([^\"\\]*(?:\\.[^\"\\]*)*)\")", block):
        k = m.group(1)
        v = m.group(2) if m.group(2) is not None else m.group(3)
        # unescape
        v = v.replace("\\'", "'").replace('\\"', '"').replace('\\n', '\n')
        entries[k] = v
    return entries

custom_zh_match = re.search(r'export const customZh = {([\s\S]+?)} as const', custom_content)
custom_zh = parse_entries(custom_zh_match.group(1)) if custom_zh_match else {}

custom_en_match = re.search(r'export const customEn = {([\s\S]+?)} satisfies', custom_content)
custom_en = parse_entries(custom_en_match.group(1)) if custom_en_match else {}

# 读取 locales.ts
with open('src/client/locales.ts', 'r', encoding='utf-8') as f:
    locales_content = f.read()

zh_match = re.search(r'export const zh = {([\s\S]+?)} satisfies', locales_content)
en_match = re.search(r'export const en = {([\s\S]+?)} satisfies', locales_content)

zh_entries = dict(custom_zh)
en_entries = dict(custom_en)

for k, v in parse_entries(zh_match.group(1)).items():
    zh_entries[k] = v
for k, v in parse_entries(en_match.group(1)).items():
    en_entries[k] = v

for div_k, div_v in zh_div.items():
    zh_entries[f'division.{div_k}'] = div_v
for div_k, div_v in en_div.items():
    en_entries[f'division.{div_k}'] = div_v

print(f"Total ZH keys: {len(zh_entries)}")
print(f"Total EN keys: {len(en_entries)}")

diff = set(zh_entries.keys()) ^ set(en_entries.keys())
print(f"Key mismatch: {diff}")

with open('scratch_zh.json', 'w', encoding='utf-8') as f:
    json.dump(zh_entries, f, ensure_ascii=False, indent=2)

with open('scratch_en.json', 'w', encoding='utf-8') as f:
    json.dump(en_entries, f, ensure_ascii=False, indent=2)

print("Saved scratch_zh.json and scratch_en.json successfully.")

import os
import shutil

brain_dir = r"C:\Users\mrshibly\.gemini\antigravity-ide\brain\75bd7939-719c-43c9-895d-f91941da7167"
assets_img = r"assets\images"
assets_team = r"assets\images\team"

mappings = {
    "file_0000000042e07208a2e40c6ad41f0c19.png": ("game_changer_logo.png", assets_img),
    "file_000000002948720babce09138abc33f3.png": ("hero_jacket.png", assets_img),
    "file_0000000090e87207b909536ae1f5fb80.png": ("use_cases.png", assets_img),
    "file_0000000042cc720bbc9d51dd9afc0866.png": ("rumel.png", assets_team),
    "file_00000000153c71f8a0f4b62021de85cd.png": ("ariful.png", assets_team)
}

# Find file names in index.html and replace them
with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

for brain_file, (new_name, dest_folder) in mappings.items():
    src_path = os.path.join(brain_dir, brain_file)
    dst_path = os.path.join(dest_folder, new_name)
    
    if os.path.exists(src_path):
        print(f"Restoring {brain_file} to {dst_path}")
        shutil.copy(src_path, dst_path)
    
    # Update HTML
    old_src = brain_file
    new_src = f"{dest_folder}/{new_name}".replace("\\", "/")
    html = html.replace(old_src, new_src)

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Restoration complete.")

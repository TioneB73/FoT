
import os
import json
import re

def generate_indexes(base_path):
    image_extensions = ('.png', '.jpg', '.jpeg', '.gif', '.webp')
    folder_pattern = re.compile(r'(25\d{4}-FoT-|.*-FoT-.*)', re.IGNORECASE)
    folder_indexes = {}

    for folder in os.listdir(base_path):
        folder_path = os.path.join(base_path, folder)
        if os.path.isdir(folder_path) and folder_pattern.search(folder):
            files = [f for f in os.listdir(folder_path)
                     if f.lower().endswith(image_extensions)]
            index_path = os.path.join(folder_path, 'index.json')
            with open(index_path, 'w') as f:
                json.dump(files, f, indent=2)
            folder_indexes[folder] = files

    master_index_path = os.path.join(base_path, 'index.json')
    with open(master_index_path, 'w') as f:
        json.dump(sorted(folder_indexes.keys()), f, indent=2)

if __name__ == "__main__":
    generate_indexes("Done")

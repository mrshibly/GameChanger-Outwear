import os
import requests
from duckduckgo_search import DDGS
import time

components = [
    "ESP32 DevKit",
    "DS18B20 Temp Sensor",
    "IRFZ44N MOSFET",
    "LM2596 Buck Converter",
    "3S Li-ion Battery",
    "3S 40A BMS",
    "Carbon Fiber Heating Pad",
    "Blower Fan 5V"
]

output_dir = "assets/images/components"
os.makedirs(output_dir, exist_ok=True)

ddgs = DDGS()

for comp in components:
    filename = comp.replace(" ", "_").replace("-", "_").lower() + ".jpg"
    filepath = os.path.join(output_dir, filename)
    
    if os.path.exists(filepath):
        print(f"Skipping {comp}, already downloaded.")
        continue
        
    print(f"Searching for {comp}...")
    try:
        results = ddgs.images(comp, max_results=1)
        if results:
            img_url = results[0]['image']
            print(f"Found image: {img_url}")
            
            # Download image
            response = requests.get(img_url, timeout=10)
            if response.status_code == 200:
                with open(filepath, 'wb') as f:
                    f.write(response.content)
                print(f"Saved to {filepath}")
            else:
                print(f"Failed to download {img_url}")
        else:
            print(f"No results for {comp}")
    except Exception as e:
        print(f"Error searching {comp}: {e}")
        
    time.sleep(1) # Be nice to DDG

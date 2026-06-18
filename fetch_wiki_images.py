import requests
import os
import json

output_dir = 'assets/images/components'
os.makedirs(output_dir, exist_ok=True)

queries = {
    "esp32_devkit": "ESP32",
    "ds18b20_temp_sensor": "DS18B20",
    "irfz44n_mosfet": "MOSFET TO-220",
    "lm2596_buck_converter": "LM2596 module",
    "3s_li_ion_battery": "Li-ion battery pack",
    "3s_40a_bms": "Battery management system board",
    "carbon_fiber_heating_pad": "heating pad",
    "blower_fan_5v": "centrifugal fan blower"
}

for name, query in queries.items():
    print(f"Searching Wikimedia for {query}...")
    
    url = "https://en.wikipedia.org/w/api.php"
    params = {
        "action": "query",
        "format": "json",
        "generator": "images",
        "titles": query,
        "gimlimit": "10",
        "prop": "imageinfo",
        "iiprop": "url",
        "iiurlwidth": "500"
    }
    
    # Try a standard search first if titles fail
    search_url = "https://en.wikipedia.org/w/api.php"
    search_params = {
        "action": "query",
        "format": "json",
        "list": "search",
        "srsearch": query,
        "utf8": 1,
        "srlimit": 1
    }
    
    headers = {"User-Agent": "GameChangerApp/1.0 (mrshibly@example.com)"}
    
    try:
        r = requests.get(search_url, params=search_params, headers=headers)
        data = r.json()
        if 'query' in data and 'search' in data['query'] and len(data['query']['search']) > 0:
            title = data['query']['search'][0]['title']
            print(f"  Found article: {title}")
            
            # Get images for article
            img_params = {
                "action": "query",
                "format": "json",
                "prop": "pageimages",
                "titles": title,
                "pithumbsize": 500
            }
            img_r = requests.get(url, params=img_params, headers=headers)
            img_data = img_r.json()
            
            pages = img_data['query']['pages']
            page = list(pages.values())[0]
            
            if 'thumbnail' in page:
                img_url = page['thumbnail']['source']
                print(f"  Downloading: {img_url}")
                img_data = requests.get(img_url, headers=headers).content
                with open(os.path.join(output_dir, f"{name}.jpg"), "wb") as f:
                    f.write(img_data)
                print(f"  Saved {name}.jpg")
            else:
                print(f"  No thumbnail found for {title}")
        else:
            print(f"  No search results for {query}")
    except Exception as e:
        print(f"  Error: {e}")

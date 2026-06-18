import cv2
import numpy as np
import os

output_dir = 'assets/images/components'

for i in range(10):
    filepath = os.path.join(output_dir, f'comp_{i}.png')
    img = cv2.imread(filepath)
    if img is None: continue
    
    h, w, _ = img.shape
    
    # Calculate average color (excluding the background which is light gray ~240)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    mask = gray < 230
    
    if np.sum(mask) == 0:
        print(f"comp_{i}.png - Empty or all background. Size: {w}x{h}")
        continue
        
    mean_color = cv2.mean(img, mask=mask.astype(np.uint8))[:3] # B, G, R
    
    # B, G, R to string
    b, g, r = [int(x) for x in mean_color]
    
    # Check if mostly red (LED), black (Fan/Heatpad), yellow (Battery), etc.
    color_desc = "Unknown"
    if r > 150 and g < 100 and b < 100: color_desc = "Red (LED?)"
    elif r > 150 and g > 130 and b < 100: color_desc = "Yellow/Gold (Battery?)"
    elif r < 80 and g < 80 and b < 80: color_desc = "Dark/Black (Fan/Heatpad?)"
    elif r < 120 and g < 120 and b < 120: color_desc = "Dark Gray (MOSFET?)"
    elif g > 100 and r < 100 and b < 100: color_desc = "Green (BMS/LM2596?)"
    elif b > 100 and r < 100 and g < 100: color_desc = "Blue?"
    
    print(f"comp_{i}.png - Size: {w}x{h}, AvgColor(RGB): ({r},{g},{b}), Desc: {color_desc}")


import cv2
import numpy as np

files = ['comp_4_top.png', 'comp_4_bottom.png', 'comp_4_left.png', 'comp_4_right.png']

for f in files:
    img = cv2.imread(f'assets/images/components/{f}')
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    mask = gray < 230
    
    if np.sum(mask) == 0:
        print(f"{f} - Empty")
        continue
        
    mean_color = cv2.mean(img, mask=mask.astype(np.uint8))[:3]
    b, g, r = [int(x) for x in mean_color]
    print(f"{f} - AvgColor(RGB): ({r},{g},{b})")


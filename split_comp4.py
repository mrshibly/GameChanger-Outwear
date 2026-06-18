import cv2
import os

img_path = 'assets/images/components/comp_4.png'
img = cv2.imread(img_path)

if img is not None:
    h, w, _ = img.shape
    print(f"Splitting image of size {w}x{h}")
    
    # Split horizontally (top half and bottom half)
    mid_y = h // 2
    top = img[0:mid_y, 0:w]
    bottom = img[mid_y:h, 0:w]
    
    cv2.imwrite('assets/images/components/comp_4_top.png', top)
    cv2.imwrite('assets/images/components/comp_4_bottom.png', bottom)
    
    # Split vertically (left half and right half)
    mid_x = w // 2
    left = img[0:h, 0:mid_x]
    right = img[0:h, mid_x:w]
    
    cv2.imwrite('assets/images/components/comp_4_left.png', left)
    cv2.imwrite('assets/images/components/comp_4_right.png', right)
    
    print("Saved split versions.")

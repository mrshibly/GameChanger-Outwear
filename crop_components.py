import cv2
import numpy as np
import os

image_path = 'assets/images/components_diagram.png'
output_dir = 'assets/images/components'
os.makedirs(output_dir, exist_ok=True)

img = cv2.imread(image_path)
bg_color = img[0, 0]

diff = np.abs(img.astype(np.int32) - bg_color.astype(np.int32))
mask = np.sum(diff, axis=2) > 30

mask = mask.astype(np.uint8) * 255

# Use a smaller kernel to avoid merging separate components
kernel = np.ones((5, 5), np.uint8)
closed = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
dilated = cv2.dilate(closed, kernel, iterations=3)

contours, _ = cv2.findContours(dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

bboxes = []
for c in contours:
    x, y, w, h = cv2.boundingRect(c)
    if w > 30 and h > 30:
        bboxes.append([x, y, x+w, y+h])

# Sort boxes
bboxes.sort(key=lambda b: (b[1] // 150, b[0]))

for i, (x1, y1, x2, y2) in enumerate(bboxes):
    pad = 10
    x1 = max(0, x1 - pad)
    y1 = max(0, y1 - pad)
    x2 = min(img.shape[1], x2 + pad)
    y2 = min(img.shape[0], y2 + pad)
    
    crop = img[y1:y2, x1:x2]
    filename = f"comp_{i}.png"
    filepath = os.path.join(output_dir, filename)
    cv2.imwrite(filepath, crop)

print(f"Found {len(bboxes)} components.")

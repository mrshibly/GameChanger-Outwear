import cv2
import numpy as np

# Load the cropped inside image
img = cv2.imread("assets/images/jackets/360_views/jacket_inside.png", cv2.IMREAD_UNCHANGED)

# Create a mirrored version
img_flipped = cv2.flip(img, 1)

# The jacket is mostly centered, but let's just mirror the left half entirely from the right half!
# Wait, the zipper/inner lining might be asymmetric?
# Usually inside view of a jacket has symmetric pockets, but maybe different zippers.
# Let's see if we can just take the left 1/4th (the sleeve) from the flipped right 1/4th.

h, w = img.shape[:2]
# Center of the image
center_x = w // 2

# We only want to patch the left sleeve. The left sleeve is in the region x < w//4 roughly.
# Let's find the exact bounding box of the jacket
alpha = img[:, :, 3]
coords = cv2.findNonZero(alpha)
x, y, w_bbox, h_bbox = cv2.boundingRect(coords)

# The jacket's center is x + w_bbox//2
center_x = x + w_bbox // 2

# Let's create a new image where the left side of the jacket is replaced by the flipped right side
# We will blend it to avoid sharp edges
patched_img = img.copy()

# The left side from 0 to center_x - 100 pixels
split_point = center_x - 150

# Just copy the flipped image's left part (which is the original right sleeve flipped)
patched_img[:, :split_point] = img_flipped[:, :split_point]

cv2.imwrite("assets/images/jackets/360_views/jacket_inside_fixed.png", patched_img)
print("Saved patched image to jacket_inside_fixed.png")

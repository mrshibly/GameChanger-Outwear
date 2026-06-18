import cv2
import numpy as np

# Load the cropped inside image
img = cv2.imread("assets/images/jackets/360_views/jacket_inside.png", cv2.IMREAD_UNCHANGED)

# Create a mirrored version
img_flipped = cv2.flip(img, 1)

patched_img = img.copy()

# The left edge is cropped. We just need to paste the outer edge of the left sleeve
# The right sleeve is fine. The flipped right sleeve is at the left edge of img_flipped.
# Let's take the first 80 pixels from img_flipped and paste them, but blend them.

split_point = 65

# Create a linear gradient mask for smooth blending
mask = np.zeros((img.shape[0], split_point), dtype=np.float32)
for i in range(split_point):
    mask[:, i] = 1.0 - (i / split_point)

# For 4 channels
mask = np.expand_dims(mask, axis=-1)

# Blend
left_part = img[:, :split_point].astype(np.float32)
flipped_part = img_flipped[:, :split_point].astype(np.float32)

blended = flipped_part * mask + left_part * (1.0 - mask)

patched_img[:, :split_point] = blended.astype(np.uint8)

cv2.imwrite("assets/images/jackets/360_views/jacket_inside_fixed2.png", patched_img)
print("Saved patched image to jacket_inside_fixed2.png")

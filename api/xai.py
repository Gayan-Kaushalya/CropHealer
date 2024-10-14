from tensorflow.keras.models import load_model
from lime import lime_image
import numpy as np
import matplotlib.pyplot as plt
import tensorflow as tf




model = load_model('/kaggle/input/apple/tensorflow2/default/1/appleModel.h5')



# Load the image and convert it to a numpy array
img_path = '/kaggle/input/apple-disease-dataset-original/Original Data/train/Black Rot/0090d05d-d797-4c99-abd4-3b9cb323a5fd___JR_FrgE.S 8727_new30degFlipLR.JPG'  # Update with your image path
image = tf.keras.preprocessing.image.load_img(img_path)
image_array = np.array(image)
image_array = np.expand_dims(image_array, axis=0)  # Add batch dimension

# Predict the class (resize and rescale are applied inside the model)
predictions = model.predict(image_array)

# Remove the batch dimension for LIME (LIME expects the image in 3D format)
image_for_lime = image_array[0]  # Original image, without preprocessing, as LIME expects

# Initialize the LIME image explainer
explainer = lime_image.LimeImageExplainer()

# Define a prediction function for LIME that takes a list of images
def predict_fn(images):
    images = np.array(images)
    return model.predict(images)

# Explain the model's predictions on the image
explanation = explainer.explain_instance(
    image_for_lime,              # The image to explain (in 3D format)
    predict_fn,                  # Prediction function
    top_labels=1,                # Number of top labels to explain
    hide_color=0,                # Color to use for hidden segments
    num_samples=1000             # Number of perturbed samples to generate
)



# Get the index of the top label and the corresponding explanation heatmap
ind = explanation.top_labels[0]
dict_heatmap = dict(explanation.local_exp[ind])
heatmap = np.vectorize(dict_heatmap.get)(explanation.segments)


# Plot the original image
plt.imshow(image)

# Overlay the heatmap on top of the image
# Use 'alpha' to set transparency, e.g., 0.5 for a 50% blend
plt.imshow(heatmap, cmap="viridis", alpha=0.5, vmin=-heatmap.max(), vmax=heatmap.max())

# Add a colorbar to represent the heatmap values
plt.colorbar()

# Remove axis for cleaner display
plt.axis('off')

# Show the result
plt.show()
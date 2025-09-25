# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container at /app
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container at /app
COPY . .

# Expose the port your application listens on (if it's a web app)
# Replace 8000 with the actual port your application uses
EXPOSE 8000

# Define environment variables (optional)
# ENV NAME World

# Run the application
# Replace 'your_app.py' with the actual entry point of your application
CMD ["python", "main.py"]
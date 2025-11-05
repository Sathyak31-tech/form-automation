# Use Python 3.9 base image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy requirements first for better caching
COPY backend/requirements.txt /app/backend/requirements.txt

# Install Python dependencies
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy the entire project
COPY . /app/

# Set environment variables
ENV PYTHONPATH=/app/lib:/app/backend
ENV FLASK_APP=backend/server.py

# Expose port (Railway will set PORT env variable)
EXPOSE 5000

# Run the application
CMD ["python", "backend/server.py"]


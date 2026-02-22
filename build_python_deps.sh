#!/bin/bash
# Build script for installing Python dependencies in Vercel environment

set -e  # Exit on any error

echo "Setting up Python environment for Vercel..."

# Create a temporary directory for Python dependencies
mkdir -p /tmp/python_deps

# Copy Python files to the temporary directory
cp -r backend/utils/* /tmp/python_deps/
cp backend/python_requirements.txt /tmp/python_deps/

# Install Python dependencies to the temporary directory
pip install -r /tmp/python_deps/python_requirements.txt -t /tmp/python_deps

# Create a symbolic link or copy the required files to a location accessible by Node.js
mkdir -p api/python_deps
cp -r /tmp/python_deps/* api/python_deps/ 2>/dev/null || true

echo "Python dependencies installed successfully"
#!/bin/bash

DESIRED_BASE_URL="http://localhost:5000"

echo "ℹ️ Installing required codegen packages globally..."

# Install the required npm packages globally on the user's machine
sudo npm install -g openapi-typescript-codegen
echo "✅ Successfully installed openapi-typescript-codegen globally"

sudo npm install -g axios
echo "✅ Successfully installed axios globally"

# Define paths
current_dir=$(pwd)
target_dir="$current_dir/src/generated"

# Create the 'generated' folder
if [ ! -d "$target_dir" ]
then
    echo "📂 'generated' directory doesn't exist. Creating now..."
    mkdir -p "$target_dir"
    echo "📂 Created 'generated' folder successfully in $current_dir/src"
else
    echo "📂 'generated' Directory exists"
fi

response=$(curl -s -w "%{http_code}" http://localhost:5000/openapi.json -o "$target_dir/openapi.json")
http_code=${response: -3}

# Check if the curl command was successful and the file is not empty
if [ $http_code -ne 200 ] || [ ! -s "$target_dir/openapi.json" ]; then
    echo "❌ Failed to fetch data from the endpoint or received empty response. Exiting."
    rm -f "$target_dir/openapi.json"
    exit 1
fi

# Fetching the OpenAPI specification from the backend
sudo curl -s http://localhost:5000/openapi.json -o "$target_dir/openapi.json"
echo "🌐 Fetched the openapi.json from the server"

# Generate TypeScript interfaces and API client using openapi-typescript-codegen
npx openapi-typescript-codegen --input "$target_dir/openapi.json" --output "$target_dir" --client axios
echo "🚀 Generated TypeScript interfaces and API client"

# Update the BASE URL in the generated OpenAPI.ts file
sed -i "s|BASE: '.*'|BASE: '$DESIRED_BASE_URL'|" "$target_dir/core/OpenAPI.ts"
echo "🔧 Updated BASE URL to $DESIRED_BASE_URL in OpenAPI.ts"

# Clean up by removing the downloaded openapi.json file
sudo rm "$target_dir/openapi.json"
echo "🧹 Cleaned up temporary openapi.json file"

echo "✅ Successfully generated the required models and interfaces"
echo "🎉 Happy coding!"

# Generate Models using openapi

### Steps

1. `npm install -g @openapitools/openapi-generator-cli`
2. `openapi-generator-cli generate -i path_to_your_openapi.json -g typescript-fetch -o output_directory`

### Example

- `openapi-generator-cli generate -i openapi.json -g typescript-fetch -o models/`

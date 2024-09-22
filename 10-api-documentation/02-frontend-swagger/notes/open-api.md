### Generate APIs (open API)

we can generate code in react app

1. Install `openapi-generator-cli`
   - `npm install @openapitools/openapi-generator-cli -g`
2. Run the `openapi-generator-cli` command
   - `openapi-generator-cli generate -g typescript-axios -i path/to/your/swagger.json -o src/api`


import { defineConfig } from 'orval';

const apiSchema = 'http://localhost:8000/api/schema/';

export default defineConfig({
  // React Query API generation
  bravApi: {
    input: {
      target: apiSchema,
    },
    output: {
      mode: 'tags-split',
      target: './src/api/generated/endpoints',
      schemas: {
        path: './src/api/generated/models',
        splitByTags: true,
      },
      client: 'react-query',
      httpClient: 'axios',
      indexFiles: false,
      override: {
        mutator: {
          path: './src/api/axios-instance.ts',
          name: 'customInstance',
        },
      },
    },
  },

  // Zod schema generation
  bravApiZod: {
    input: {
      target: apiSchema,
    },
    output: {
      mode: 'tags-split',
      target: './src/api/generated/zod',
      client: 'zod',
      fileExtension: '.zod.ts',
      override: {
        zod: {
          version: 4,
          variant: 'classic',
        },
      },
    },
  },
});

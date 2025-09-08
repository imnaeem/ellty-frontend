import type { CodegenConfig } from '@graphql-codegen/cli';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const config: CodegenConfig = {
  overwrite: true,
  schema: `${API_URL}/graphql`,
  documents: "src/**/*.graphql",
  generates: {
    'src/generated/graphql.tsx': {
      plugins: [
        'typescript',
        'typescript-react-apollo',
        'typescript-operations',
      ],
    },
  },
  
};

export default config;

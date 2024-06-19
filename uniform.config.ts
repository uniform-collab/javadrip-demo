import type { CLIConfiguration } from '@uniformdev/cli';

const config: CLIConfiguration = {
  serialization: {
    entitiesConfig: {
      aggregate: {},
      asset: {},
      category: {},
      composition: { publish: true },
      contentType: {},
      component: {},
      dataType: {},
      enrichment: {},
      entry: { publish: true },
      entryPattern: { publish: true },
      locale: {},
      componentPattern: { publish: true },
      projectMapDefinition: {},
      projectMapNode: {},
      quirk: {},
      redirect: {},
      signal: {},
      test: {},
      prompt: {},
    },
    directory: './content/',
    format: 'yaml',
  },
};

module.exports = config;

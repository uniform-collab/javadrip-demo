import { registerUniformComponent, UniformSlot } from '@uniformdev/canvas-react';
import UniformEntrySearchContextProvider from './UniformEntrySearchProvider';

registerUniformComponent({
  type: 'uniformEntrySearchEngine',
  component: props => (
    <UniformEntrySearchContextProvider {...props}>
      <UniformSlot name="content" />
    </UniformEntrySearchContextProvider>
  ),
});

import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      // The entry point of your library
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'PolygonMap',
      // The output filenames
      fileName: (format) => `polygon-map.${format}.js`,
    },
    rollupOptions: {
      // Make sure to externalize deps that shouldn't be bundled into your library
      external: [
        'd3-selection', 'd3-geo', 'd3-scale', 
        'd3-shape', 'd3-zoom', 'd3-drag', 'd3-transition'
      ],
      output: {
        // Provide global variables to use in the UMD build for externalized deps
        globals: {
          'd3-selection': 'd3',
          'd3-geo': 'd3',
          'd3-scale': 'd3',
          'd3-shape': 'd3',
          'd3-zoom': 'd3',
          'd3-drag': 'd3',
          'd3-transition': 'd3',
        },
      },
    },
  },
});
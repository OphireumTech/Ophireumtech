export default defineConfig(() => {
  return {
    base: '/Ophireumtech/',

    plugins: [react(), tailwindcss(), aistudioMediaPlugin()],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },

    build: {
      outDir: 'dist',
    },

    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

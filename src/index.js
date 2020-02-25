import BuildTree from './BuildTree';

(async () => {
   // Create instance of BuildTree with config
   const instance = new BuildTree({
      filelist: 'https://joelt.me/buildtree-files.txt',
      selector: '.tree-root'
   });

   // Initiate build
   await instance.build();
})();

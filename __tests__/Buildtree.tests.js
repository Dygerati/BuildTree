import BuildTree from '../src/BuildTree';

describe('Buildtree', () => {
   it('Correctly build map based on filelist', () => {
      expect(
         BuildTree.prototype.generateDataMap(
            '/home/grannyweatherwax/broom\n/home/rincewind/grimoires/world-creation.spell'
         )
      ).toMatchSnapshot();
   });
});

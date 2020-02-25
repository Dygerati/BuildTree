/**
 * BuildTree module, fetches basic filelist and generated DOM tree
 */

export default class BuildTree {
   config = {};

   treeDepth = 0;

   /**
    * Contructor for BuildTree, accepts configuration and returns instance.
    *
    * @param {String} selector - Selector string on where to attach generated tree
    * @param {Object} filelistUri - URI for file list to be fetched
    * @returns	{BuildTree}
    */
   constructor({ selector, filelist }) {
      console.info(`Initializing with filelist at ${filelist} && selector ${selector}`);

      this.config.filelist = filelist;
      this.config.root = selector;
   }

   /**
    * Utility method for sorting objects alphabetically by the property 'name'
    * Called using Array.prototype.sort()
    *
    * @param {Object} a - First object for comparison
    * @param {Object} b - Second object for comparison
    * @returns	{Number}
    */
   sortByName(a, b) {
      const aName = a.name.toUpperCase();
      const bName = b.name.toUpperCase();
      return aName < bName ? -1 : aName > bName ? 1 : 0;
   }

   /**
    * Main entry function to carry out building tree based on configuration
    */
   async build() {
      try {
         // Fetching filelist data
         await this.fetchFileList()

            // Converting filelist into usable data structure
            .then(this.generateDataMap)

            // Utilizing generated tree to create DOM elements, recursively
            .then(map => this.createDomTree({ name: '', children: map }))

            //Attaching to configured root on DOM
            .then(tree => {
               console.info('Attaching tree');
               document.querySelector(this.config.root).appendChild(tree);
            })

            // Ensures the widths for each generated tree column line up
            .then(this.normalizeWidths.bind(this));

         console.info(`Created tree of depth ${this.treeDepth}`);
      } catch (e) {
         console.warn('Encountered error while building tree:', e.message);
         document.body.innerHTML = `<p>Unable to create tree for file list at ${this.config.filelist}</p>`;
      }
   }

   /**
    * Helper function to loop through each level of tree and normalize the widths
    */
   normalizeWidths() {
      // Loop through each level for tree
      for (let i = 0; i <= this.treeDepth; i++) {
         // Retrieve all nodes in level
         const nodes = document.querySelectorAll(`.level-${i}`);
         const nodeList = Array.from(nodes);

         // Determine the maximum width for all nodes
         const maxWidth = nodeList.reduce((max, curr) => {
            return curr.clientWidth > max ? curr.clientWidth : max;
         }, 0);

         // Set each node to max width
         nodeList.forEach(node => {
            node.style.width = maxWidth;
         });
      }
   }

   /**
    * Function to generate markup for one node of the generated tree
    * Called recursively to produce complete tree
    *
    * @param {Object} root - Node of map for which to generate markup
    * @param {Number} level - Number indicating the current depth of the tree
    * @returns	{DOM Node}
    */
   createDomTree(root, level = 0) {
      // Update treeDepth property
      if (level > this.treeDepth) {
         this.treeDepth = level;
      }

      // Create main DOM elements
      const parent = document.createElement('div');
      const titleContainer = document.createElement('div');
      const title = document.createElement('p');

      title.appendChild(document.createTextNode(`${root.name}${root.children.length ? '/' : ''}`));

      // Add classes for label
      titleContainer.classList.add('tree-label', `level-${level}`);
      titleContainer.appendChild(title);

      // Assemble into parent
      parent.appendChild(titleContainer);
      parent.classList.add('tree-parent');

      // If node has children, trigger recursively generating child nodes
      if (root.children.length) {
         // Create element for children and sort by names
         const childContainer = document.createElement('div');
         const childrenSorted = root.children.sort(this.sortByName);

         childContainer.classList.add('tree-children');

         // Trigger this function for each child, appending markup to container
         for (const child of childrenSorted) {
            childContainer.appendChild(this.createDomTree(child, level + 1));
         }

         // Add children to parent
         parent.appendChild(childContainer);
      }

      return parent;
   }

   /**
    * Called with basic filelist data, parses into data structure
    *
    * @param {String} files - Basic string data for filelist
    * @returns	{Object}
    */
   generateDataMap(files) {
      const tree = [];
      const wrapper = { tree };

      // Split filelist by each line
      files.split('\n').forEach(path => {
         // Split each line into parts delimited by '/'
         // Call reduce with accumulator to generate tree
         path.split('/').reduce((map, name) => {
            // If name not valid, skip
            if (!name) {
               return map;
            }

            // If entry not present in map, create and add to tree
            if (!map[name]) {
               map[name] = { tree: [] };
               map.tree.push({ name, children: map[name].tree });
            }

            // Return reference to next node
            return map[name];
         }, wrapper);
      });

      return tree;
   }

   /**
    * Uses browser fetch() to retrieve configured filelist data
    *
    * @returns	{String}
    */
   async fetchFileList() {
      try {
         // Fetch from remote source and convert to text
         return fetch(this.config.filelist, {}).then(res => res.text());
      } catch (e) {
         console.warn('Unable to fetch file list');
         throw e;
      }
   }
}

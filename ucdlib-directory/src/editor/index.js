import { select } from "@wordpress/data";
import { registerBlockType } from '@wordpress/blocks';

import pluginBlocks from "./lib/blocks";

if ( document.querySelector('ucdlib-plugin[plugin=ucdlib-directory]') ) {
  if ( select('core/editor') ){
    pluginBlocks.forEach(block => {
      registerBlockType( block.name, block.settings );
    });
  }
}

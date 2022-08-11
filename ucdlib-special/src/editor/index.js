import { registerPlugin } from '@wordpress/plugins';
import { registerBlockType } from '@wordpress/blocks';
import { select } from "@wordpress/data";

import blocks from "./lib/blocks";
import plugins from "./lib/plugins";

if ( document.querySelector('ucdlib-plugin[plugin=ucdlib-special]') ) {
  blocks.forEach(block => {
    registerBlockType( block.name, block.settings );
  });
  if ( select('core/editor') ){
    plugins.forEach(plugin => {
      registerPlugin( plugin.name, plugin.settings );
    })
     
  }
}
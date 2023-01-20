import { registerPlugin } from '@wordpress/plugins';
import { registerBlockType } from '@wordpress/blocks';
import { select } from "@wordpress/data";

import pluginBlocks from "./lib/blocks";
import hoursPlugin from "./lib/plugins/hours";
import corePlugin from "./lib/plugins/core";

import "../public";

if ( document.querySelector('meta[name=ucdlib-plugin-active][content=ucdlib-locations]') ) {
  if ( select('core/editor') ){
    pluginBlocks.forEach(block => {
      registerBlockType( block.name, block.settings );
    });
    registerPlugin( corePlugin.name, corePlugin.settings );
    registerPlugin( hoursPlugin.name, hoursPlugin.settings );
     
  }
}
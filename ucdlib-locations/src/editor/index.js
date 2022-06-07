import { registerPlugin } from '@wordpress/plugins';
import { registerBlockType } from '@wordpress/blocks';
import { select } from "@wordpress/data";

import pluginBlocks from "./lib/blocks";
import hoursPlugin from "./lib/plugins/hours";
import singleTemplatePlugin from "./lib/plugins/single-template";
import corePlugin from "./lib/plugins/core";

import "../public";

if ( document.querySelector('ucdlib-plugin[plugin=ucdlib-locations]') ) {
  if ( select('core/editor') ){
    pluginBlocks.forEach(block => {
      registerBlockType( block.name, block.settings );
    });
    registerPlugin( corePlugin.name, corePlugin.settings );
    registerPlugin( hoursPlugin.name, hoursPlugin.settings );
    registerPlugin( singleTemplatePlugin.name, singleTemplatePlugin.settings );
     
  }
}
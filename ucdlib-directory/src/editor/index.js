import { select } from "@wordpress/data";
import { registerBlockType } from '@wordpress/blocks';
import { registerPlugin } from '@wordpress/plugins';

import pluginBlocks from "./lib/blocks";
import userPlugin from "./lib/plugins/user";
import profilePlugin from "./lib/plugins/profile";

if ( document.querySelector('meta[name=ucdlib-plugin-active][content=ucdlib-directory]') ) {
  pluginBlocks.forEach(block => {
    registerBlockType( block.name, block.settings );
  });
  if ( select('core/editor') ){
    registerPlugin( profilePlugin.name, profilePlugin.settings );
    registerPlugin( userPlugin.name, userPlugin.settings );

  }
}

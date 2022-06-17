import { select } from "@wordpress/data";
import { registerBlockType } from '@wordpress/blocks';
import { registerPlugin } from '@wordpress/plugins';

import pluginBlocks from "./lib/blocks";
import userPlugin from "./lib/plugins/user";
import profilePlugin from "./lib/plugins/profile";

if ( document.querySelector('ucdlib-plugin[plugin=ucdlib-directory]') ) {
  if ( select('core/editor') ){
    pluginBlocks.forEach(block => {
      registerBlockType( block.name, block.settings );
    });
    registerPlugin( profilePlugin.name, profilePlugin.settings );
    registerPlugin( userPlugin.name, userPlugin.settings );

  }
}

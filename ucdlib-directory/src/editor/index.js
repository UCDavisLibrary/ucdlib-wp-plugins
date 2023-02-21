import { select } from "@wordpress/data";
import { registerBlockType } from '@wordpress/blocks';
import { registerPlugin } from '@wordpress/plugins';

import pluginBlocks from "./lib/blocks";
import userPlugin from "./lib/plugins/user";
import profilePlugin from "./lib/plugins/profile";
import additionalAuthorsPlugin from "./lib/plugins/additional-authors";

if ( document.querySelector('meta[name=ucdlib-plugin-active][content=ucdlib-directory]') ) {
  pluginBlocks.forEach(block => {
    registerBlockType( block.name, block.settings );
  });
  if ( select('core/editor') ){
    registerPlugin( profilePlugin.name, profilePlugin.settings );
    registerPlugin( userPlugin.name, userPlugin.settings );
    registerPlugin( additionalAuthorsPlugin.name, additionalAuthorsPlugin.settings );
  }
}

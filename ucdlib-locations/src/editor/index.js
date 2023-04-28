import { registerPlugin } from '@wordpress/plugins';
import { registerBlockType } from '@wordpress/blocks';
import { select } from "@wordpress/data";

import pluginBlocks from "./lib/blocks";
import hoursPlugin from "./lib/plugins/hours";
import corePlugin from "./lib/plugins/core";

import "../public/lib/elements/ucdlib-hours/ucdlib-hours";
import "../public/lib/elements/ucdlib-hours-today/ucdlib-hours-today";
import "../public/lib/elements/ucdlib-hours-today-simple/ucdlib-hours-today-simple";
import "../public/lib/elements/ucdlib-hours-today-sign/ucdlib-hours-today-sign";

if ( document.querySelector('meta[name=ucdlib-plugin-active][content=ucdlib-locations]') ) {
  if ( select('core/editor') ){
    pluginBlocks.forEach(block => {
      registerBlockType( block.name, block.settings );
    });
    registerPlugin( corePlugin.name, corePlugin.settings );
    registerPlugin( hoursPlugin.name, hoursPlugin.settings );
     
  }
}
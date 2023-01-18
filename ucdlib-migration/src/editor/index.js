import { registerPlugin } from '@wordpress/plugins';
import { select } from "@wordpress/data";

import metaPlugin from "./lib/plugins/post-meta";

if ( document.querySelector('meta[name=ucdlib-plugin-active][content=ucdlib-migration]') ) {
    if ( select('core/editor') ){
        registerPlugin( metaPlugin.name, metaPlugin.settings );
        }
}

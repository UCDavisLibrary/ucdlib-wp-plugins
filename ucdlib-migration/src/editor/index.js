import { registerPlugin } from '@wordpress/plugins';
import { select } from "@wordpress/data";

import metaPlugin from "./lib/plugins/post-meta";

if ( document.querySelector('ucdlib-plugin[plugin=ucdlib-migration]') ) {
    if ( select('core/editor') ){
        registerPlugin( metaPlugin.name, metaPlugin.settings );
        }
}

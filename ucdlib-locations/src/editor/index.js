import { registerPlugin } from '@wordpress/plugins';
import { select } from "@wordpress/data";

import hoursPlugin from "./lib/plugins/hours";
import corePlugin from "./lib/plugins/core";

if ( document.querySelector('ucdlib-plugin[plugin=ucdlib-locations]') ) {
  if ( select('core/editor') ){
     registerPlugin( hoursPlugin.name, hoursPlugin.settings );
     registerPlugin( corePlugin.name, corePlugin.settings );
    
     // Move panel to top of sidebar
    // There has to be a better way...
    setTimeout(() => {
      const panelClass = "components-panel__body";
      const topPanel = document.querySelector(`.${panelClass}.edit-post-post-status`);
      const hoursPanel = document.querySelector(`.${panelClass}.${hoursPlugin.name}`);
      const corePanel = document.querySelector(`.${panelClass}.${corePlugin.name}`);
      if ( topPanel && hoursPanel ) {
        topPanel.after(hoursPanel);
      }
      if ( topPanel && corePanel ) {
        topPanel.after(corePanel);
      }
    }, 2500)
  }
}
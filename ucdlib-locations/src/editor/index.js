import { registerPlugin } from '@wordpress/plugins';
import { select } from "@wordpress/data";

import hoursPlugin from "./lib/plugins/hours";

if ( document.querySelector('ucdlib-plugin[plugin=ucdlib-locations]') ) {
  if ( select('core/editor') ){
     registerPlugin( hoursPlugin.name, hoursPlugin.settings );
    
     // Move panel to top of sidebar
    // There has to be a better way...
    setTimeout(() => {
      const panelClass = "components-panel__body";
      const topPanel = document.querySelector(`.${panelClass}.edit-post-post-status`);
      const hoursPanel = document.querySelector(`.${panelClass}.${hoursPlugin.name}`);
      if ( topPanel && hoursPanel ) {
        topPanel.after(hoursPanel);
      }
    }, 2500)
  }
}
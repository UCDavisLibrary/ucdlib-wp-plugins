import { UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucdlib-locations/hours-today';
const settings = {
  api_version: 2,
	title: "Today's Hours",
	description: "Display today's hours for a location",
	icon: UCDIcons.renderPublic('fa-clock'),
	category: 'ucdlib-locations',
	keywords: [ 'hours', 'open', 'close', 'occupancy', 'status' ],
  supports: {
    "html": false,
    "customClassName": false
  },
  attributes: {
    locationId: {
      type: 'number',
      default: 0
    },
    hideTitle: {
      type: 'boolean',
      default: false
    },
    widgetTitle: {
      type: 'string',
      default: "Today's Hours"
    },
    showChildren: {
      type: 'boolean',
      default: false
    },
    onlyShowChildren: {
      type: 'boolean',
      default: false
    },
    childFilter: {
      type: 'string',
      default: ''
    },
    seeMoreText: {
      type: 'string',
      default: 'See all library hours'
    },
    hideSeeMore: {
      type: 'boolean',
      default: false
    },
    flush: {
      type: 'boolean',
      default: false
    }
  },
  edit: Edit
};

export default { name, settings };
import { UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucdlib-locations/hours';
const settings = {
  api_version: 2,
	title: "Location Hours",
	description: "Display weekly hours for all locations",
	icon: UCDIcons.renderPublic('fa-calendar-week'),
	category: 'ucdlib-locations',
	keywords: [ 'hours', 'open', 'close', 'occupancy', 'status' ],
  supports: {
    "html": false,
    "customClassName": false
  },
  attributes: {
    surfaceChildren: {
      type: 'array',
      default: []
    }
  },
  edit: Edit
};

export default { name, settings };
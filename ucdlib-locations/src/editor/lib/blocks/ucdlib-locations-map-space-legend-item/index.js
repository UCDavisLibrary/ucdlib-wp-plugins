import { UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucdlib-locations/map-space-legend-item';
const settings = {
  api_version: 2,
	title: "Space Toggle",
  parent: [ 'ucdlib-locations/map-space-legend' ],
	description: "Register a space type, so that it can be toggled on/off in the legend",
	icon: UCDIcons.renderPublic('fa-toggle-on'),
	category: 'ucdlib-locations',
	keywords: [ 'study', 'zone' ],
  supports: {
    "html": false,
    "customClassName": false
  },
  attributes: {
    label: {
      type: 'string',
      default: ''
    },
    icon: {
      type: 'string',
      default: ''
    },
    brandColor: {
      type: "string",
      default: "primary"
    }
  },
  edit: Edit
};

export default { name, settings };
import { UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucdlib-locations/address';
const settings = {
  apiVersion: 3,
	title: "Location Address",
	description: "Display the address for a location",
	icon: UCDIcons.renderPublic('fa-location-dot'),
	category: 'ucdlib-locations',
	keywords: [  ],
  supports: {
    "html": false,
    "customClassName": false
  },
  attributes: {
    text: {
      type: 'string',
      default: ''
    }
  },
  edit: Edit
};

export default { name, settings };
import { UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucdlib-special/exhibit-location';
const settings = {
  api_version: 2,
	title: "Exhibit Location",
	description: "Displays a widget with an exhibit's location",
	icon: UCDIcons.renderPublic('fa-map-location'),
	category: 'ucdlib-special',
	keywords: [ 'map'],
  supports: {
    "html": false,
    "customClassName": false
  },
  attributes: {
  },
  edit: Edit
};

export default { name, settings };
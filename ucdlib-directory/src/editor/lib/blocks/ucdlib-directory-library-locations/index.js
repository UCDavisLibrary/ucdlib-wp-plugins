import { UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucdlib-directory/library-locations';
const settings = {
  api_version: 2,
	title: "Your Library Location",
  parent: [],
	description: "Change your workplace",
	icon: UCDIcons.renderPublic('fa-location-pin'),
	category: 'ucdlib-directory-person',
	keywords: [ 'library', 'libraries', 'location' ],
  supports: {
    "html": false,
    "customClassName": false
  },
  attributes: {
  },
  edit: Edit
};

export default { name, settings };
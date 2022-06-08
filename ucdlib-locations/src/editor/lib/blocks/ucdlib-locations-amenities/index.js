import { UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';
import { Save } from "@ucd-lib/brand-theme-editor/lib/utils";

const name = 'ucdlib-locations/amenities';
const settings = {
  api_version: 2,
	title: "Amenities",
	description: "List of location Amenities",
	icon: UCDIcons.renderPublic('fa-gifts'),
	category: 'ucdlib-locations',
	keywords: [ 'amenity' ],
  supports: {
    "html": false,
    "customClassName": false
  },
  attributes: {
  },
  edit: Edit,
  save: Save
};

export default { name, settings };
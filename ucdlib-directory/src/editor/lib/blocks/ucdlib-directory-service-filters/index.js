import { UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucdlib-directory/service-filters';
const settings = {
  api_version: 2,
	title: "Interactive Service Directory Filters",
	description: "Displays filters. Should be used in conjunction with the Service Results block",
	icon: UCDIcons.renderPublic('fa-filter'),
	category: 'ucdlib-directory',
	keywords: [ 'facet' ],
  supports: {
    "html": false,
    "customClassName": false
  },
  attributes: {
  },
  edit: Edit
};

export default { name, settings };
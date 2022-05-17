import { UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucdlib-directory/bio';
const settings = {
  api_version: 2,
	title: "Your Bio",
  parent: [],
	description: "Change your bio",
	icon: UCDIcons.renderPublic('fa-dna'),
	category: 'ucdlib-directory-person',
	keywords: [ 'about', 'bio', 'blurb' ],
  supports: {
    "html": false,
    "customClassName": false
  },
  attributes: {
  },
  edit: Edit
};

export default { name, settings };
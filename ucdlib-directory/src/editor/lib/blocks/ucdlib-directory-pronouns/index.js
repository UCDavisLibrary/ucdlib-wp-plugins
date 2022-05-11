import { UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucdlib-directory/pronouns';
const settings = {
  api_version: 2,
	title: "Your Preferred Pronoun(s)",
  parent: [],
	description: "Change your preferred pronoun(s).",
	icon: UCDIcons.renderPublic('fa-star'),
	category: 'ucdlib-directory-person',
	keywords: [ 'pronoun' ],
  supports: {
    "html": false,
    "customClassName": false
  },
  attributes: {
  },
  edit: Edit
};

export default { name, settings };
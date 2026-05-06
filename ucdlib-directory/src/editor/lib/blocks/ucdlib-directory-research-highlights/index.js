import { UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucdlib-directory/research-highlights';
const settings = {
  apiVersion: 3,
  title: "Research Highlights",
  parent: [],
  description: "Highlight your research works",
  icon: UCDIcons.renderPublic('fa-flask'),
  category: 'ucdlib-directory',
  keywords: [ 'research', 'highlights', 'works' ],
  supports: {
    "html": false,
    "customClassName": false
  },
  attributes: {},
  edit: Edit
};

export default { name, settings };
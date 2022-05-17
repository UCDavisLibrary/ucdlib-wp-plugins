import { html, SelectUtils } from "@ucd-lib/brand-theme-editor/lib/utils";
import { Fragment } from "@wordpress/element";
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { useDispatch } from "@wordpress/data";
import { BaseControl, TextControl, ToggleControl } from '@wordpress/components';

const name = 'ucdlib-directory-profile';

const Edit = () => {

  // determine when to show panel
  const currentPost = SelectUtils.currentPost();
  const isPerson = currentPost.type == 'person';

  // get page metadata to show in panel
  const meta = SelectUtils.editedPostAttribute('meta');
  const hidePronouns = meta.hide_pronouns ? true : false;
  const hideLibraries = meta.hide_libraries ? true : false;
  const hideDirectoryTags = meta.hide_tags ? true : false;
  const hideExpertiseAreas = meta.hide_expertise_areas ? true : false; 
  const hideBio = meta.hide_bio ? true : false; 
  const { editPost } = useDispatch( 'core/editor', [ hidePronouns, hideLibraries, hideDirectoryTags, hideExpertiseAreas, hideBio ] );


  return html`
    <${Fragment}>
      ${(isPerson) && html`
        <${PluginDocumentSettingPanel}
          className=${name}
          icon=${html`<ucdlib-icon style=${{marginLeft: '8px', width: '18px', minWidth: '18px'}} icon="ucd-public:fa-user-gear"></ucdlib-icon>`}
          title="Profile Settings">
          <${ToggleControl} 
            label="Hide Pronouns"
            checked=${hidePronouns}
            onChange=${() => editPost({meta: { hide_pronouns: !hidePronouns}})}
          />
          <${ToggleControl} 
            label="Hide Library Locations"
            checked=${hideLibraries}
            onChange=${() => editPost({meta: { hide_libraries: !hideLibraries}})}
          />
          <${ToggleControl} 
            label="Hide Bio"
            checked=${hideBio}
            onChange=${() => editPost({meta: { hide_bio: !hideBio}})}
          />
          <${ToggleControl} 
            label="Hide Directory Tags"
            checked=${hideDirectoryTags}
            onChange=${() => editPost({meta: { hide_tags: !hideDirectoryTags}})}
          />
          <${ToggleControl} 
            label="Hide Areas of Expertise"
            checked=${hideExpertiseAreas}
            onChange=${() => editPost({meta: { hide_expertise_areas: !hideExpertiseAreas}})}
          />
        </${PluginDocumentSettingPanel}>
      `}

    </${Fragment}>
  `
}

const settings = {render: Edit};
export default { name, settings };
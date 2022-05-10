import { html, SelectUtils } from "@ucd-lib/brand-theme-editor/lib/utils";
import { Fragment } from "@wordpress/element";
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { useDispatch } from "@wordpress/data";
import { BaseControl, TextControl } from '@wordpress/components';

const name = 'ucdlib-directory-user';

const Edit = () => {

  // determine when to show panel
  const currentPost = SelectUtils.currentPost();
  const isAdmin = SelectUtils.isCurrentUserAdmin();
  const isPerson = currentPost.type == 'person';

  // determine what to show in panel
  const meta = SelectUtils.editedPostAttribute('meta');
  const userId = meta.wp_user_id ? meta.wp_user_id : '';
  const kerberos = meta.username ? meta.username : '';
  const user = SelectUtils.user(userId);
  const hasUserAccount = userId ? true : false;
  const helpText = {
    hasAccount: "This person has a linked Wordpress user account. Requests to this account profile will be redirected to this 'person' page.",
    noAccount: "This person does not have a linked Wordpress user account. Enter a WP account id now, or enter a kerberos id, and the account will be linked the first time the user logs in."
  };

  const { editPost } = useDispatch( 'core/editor', [ userId ] );


  return html`
    <${Fragment}>
      ${(isPerson && isAdmin) && html`
        <${PluginDocumentSettingPanel}
          className=${name}
          icon=${html`<ucdlib-icon style=${{marginLeft: '8px', width: '12px', minWidth: '12px'}} icon="ucd-public:fa-user"></ucdlib-icon>`}
          title="User Account">
          ${hasUserAccount ? html`
          <${BaseControl} help=${helpText.hasAccount} />
          ` : html`
            <${BaseControl} help=${helpText.noAccount} />
          `}
          <${TextControl} 
              label="WP Account ID" 
              value=${userId} 
              onChange=${(wp_user_id) => editPost({meta: {wp_user_id}})}/>
          ${hasUserAccount ? html`
            <div>
              <${TextControl} 
                disabled=${true}
                label="Kerberos"
                value=${user && user.username ? user.username : ''}
              />
              <${TextControl} 
                disabled=${true}
                label="UC Path ID"
                value=${user && user.meta && user.meta['ucd-cas_ucpath-id'] ? user.meta['ucd-cas_ucpath-id'] : ''}
              />
              <${TextControl} 
                disabled=${true}
                label="IAM ID"
                value=${user && user.meta && user.meta['ucd-cas_iam-id'] ? user.meta['ucd-cas_ucpath-id'] : ''}
              />
            </div>
          ` : html`
            <${TextControl} 
              label="Kerberos" 
              value=${kerberos} 
              onChange=${(username) => editPost({meta: {username}})}/>
          `}
        </${PluginDocumentSettingPanel}>
      `}

    </${Fragment}>
  `
}

const settings = {render: Edit};
export default { name, settings };
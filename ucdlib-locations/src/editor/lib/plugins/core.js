import { Fragment } from "@wordpress/element";
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { useDispatch } from "@wordpress/data";
import {
  ToggleControl,
  SelectControl,
  TextControl } from '@wordpress/components';
import { html, SelectUtils } from "@ucd-lib/brand-theme-editor/lib/utils";

const {__experimentalLinkControl } = wp.blockEditor;
const LinkControl = __experimentalLinkControl;

const name = 'ucdlib-locations-core';

const Edit = () => {

  // get metadata
  const isLocation = SelectUtils.editedPostAttribute('type') === 'location';
  const meta = SelectUtils.editedPostAttribute('meta');
  const labelShort = meta.label_short ? meta.label_short : '';
  const roomNumber = meta.room_number ? meta.room_number : '';
  const hasAlert = meta.has_alert ? true : false;
  const alertText = meta.alert_text ? meta.alert_text: '';
  const hasRedirect = meta.has_redirect ? true : false;
  const emptyRedirect = {postId: 0, url: ''};
  const redirect = meta.redirect ? meta.redirect : emptyRedirect;
  const locationParent = meta.location_parent ? meta.location_parent : 0;
  const address = meta.display_address ? meta.display_address : '';
  const watchedVars = [
    labelShort,
    roomNumber,
    hasAlert,
    alertText,
    hasRedirect,
    redirect,
    locationParent,
    address
  ];
  const { editPost } = useDispatch( 'core/editor', watchedVars );
  const currentId = SelectUtils.editedPostAttribute('id');

  const locations = SelectUtils.posts({per_page: '-1', orderby: 'title', order: 'asc'}, 'location');
  const parentOptions = [
    { value: 0, label: 'Select a Location'},
    ...locations.map(l => {return {label: l.title.raw, value: l.id}}).filter(l => l.value != currentId)
  ];

  const onRedirectChange = (v) => {
    if ( !v ) {
      editPost({meta: {redirect: emptyRedirect}});
      return;
    }
    let x = {...emptyRedirect};
    if ( v.kind === 'post-type' && v.id ) {
      x.postId = v.id;
    }
    if ( typeof v.url === 'string' ) {
      x.url = v.url;
    }
    editPost({meta: {redirect: x}});
  }

  return html`
    <${Fragment}>
      ${isLocation && html`
        <${PluginDocumentSettingPanel}
          name=${name}
          className=${name}
          icon=${html`<ucdlib-icon style=${{marginLeft: '8px', width: '15px', minWidth: '15px'}} icon="ucd-public:fa-building-circle-exclamation"></ucdlib-icon>`}
          title="This Location">
          <style>
            .ucdlib-locations-core .block-editor-link-control__field {
              margin-left: 0;
            }
            .ucdlib-locations-core .block-editor-link-control__search-input-wrapper {
              max-width: 75%;
            }
            .ucdlib-locations-core .block-editor-link-control__search-item {
              padding-left: 0;
              width: 70%;
            }
          </style>
          <div style=${{marginBottom: '15px'}}>
            <${TextControl}
              value=${labelShort}
              label="Short Label"
              onChange=${label_short => editPost({meta: {label_short}})}
              help="Less than 15 characters or so..."
            />
            <${TextControl}
              value=${address}
              label="Address to Display"
              onChange=${display_address => editPost({meta: {display_address}})}
            />
            <${TextControl}
              value=${roomNumber}
              label="Room Number"
              onChange=${room_number => editPost({meta: {room_number}})}
            />
          </div>
          <div style=${{marginBottom: '15px'}}>
            <${ToggleControl}
              label="Show Alert Notification"
              checked=${hasAlert}
              onChange=${ () => editPost({meta: {has_alert: !hasAlert}})}
              help="Displayed on hours and visit pages."
            />
            ${hasAlert && html`
              <${TextControl}
                label="Notification"
                value=${alertText}
                onChange=${alert_text => editPost({meta: {alert_text}})}
              />
            `}
          </div>
          <div>
            <${ToggleControl}
              label="Custom Location Page"
              checked=${hasRedirect}
              onChange=${ () => editPost({meta: {has_redirect: !hasRedirect}})}
              help="Any requests to this page will be redirected to a custom url"
            />
            ${hasRedirect && html`
              <${LinkControl}
                settings=${[]}
                value=${redirect}
                onRemove=${() => onRedirectChange()}
                onChange=${v => onRedirectChange(v)}/>
            `}
          </div>
          <${SelectControl}
            options=${parentOptions}
            value=${locationParent}
            label="Parent Location"
            help="Nests this location under the selected location on hours and visit pages."
            onChange=${location_parent => editPost({meta: {location_parent}})}
          />
        </${PluginDocumentSettingPanel}>
      `}
    </${Fragment}>
  `
}

const settings = {render: Edit};
export default { name, settings };

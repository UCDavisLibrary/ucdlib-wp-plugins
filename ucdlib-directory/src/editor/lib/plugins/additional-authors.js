import { Fragment } from "@wordpress/element";
import { PluginPostStatusInfo } from '@wordpress/edit-post';
import { useDispatch } from "@wordpress/data";
import { 
    FormTokenField,
    ToggleControl,
    Modal, 
    Button } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { html, SelectUtils } from "@ucd-lib/brand-theme-editor/lib/utils";


/**
 * Allows user to add additional authors to a post by querying the directory
 * Does not modify wp core authorship functionality, but builds on top of it.
 */
 const name = 'ucdlib-directory-additional-authors';
 const Edit = () => {
  if ( !SelectUtils.isPost() )  return html`<${Fragment} />`;

  // retrieve initial data
  const [ peoplePosts, setPeoplePosts ] = useState( [] );
  useEffect(() => {
    const path = `ucdlib-directory/people`;
    apiFetch( {path} ).then( 
      ( r ) => {
        setPeoplePosts(r);
      }, 
      (error) => {
        setPeoplePosts([]);
        console.warn(error);
      })

  }, []);

  const [ modalIsOpen, setModalOpen ] = useState( false );
	const openModal = () => {
    setModalOpen( true )
  };
	const closeModal = () => setModalOpen( false );

  const postMeta = SelectUtils.editedPostAttribute('meta');
  const watchedVars = [
    postMeta.ucd_hide_og_author,
    JSON.stringify(postMeta.ucd_additional_authors)
  ];
  const { editPost } = useDispatch( 'core/editor', watchedVars );
  const authors = postMeta.ucd_additional_authors;
  const hideOgAuthor = postMeta.ucd_hide_og_author;

  // format people the way selector likes
  const people = (() => {
    const out = {
      names: [],
      byId: {},
      byName: {},
      selected: []
    }
    peoplePosts.forEach(p => {
      p.name = `${p.name_first} ${p.name_last}`.trim();
      if ( p.name && p.id ) {
        out.names.push(p.name);
        out.byId[p.id] = p;
        out.byName[p.name] = p
        const i = authors.indexOf(p.id);
        if ( i >= 0 ) out.selected.push({i, name: p.name});
      }
    })
    out.selected = out.selected.sort((a, b) => a.i - b.i).map(x => x.name);
    return out;
  })();
  const hasAdditionalAuthors = authors.length ? true : false;
  const buttonLabel = hasAdditionalAuthors ? 'Edit Additional Authors' : 'Assign Additional Authors';

  const onAuthorChange = (authors) => {
    authors = authors.map(x => people.byName[x]).filter(x => x != undefined).map(x => x.id);
    editPost({meta: {ucd_additional_authors: authors}});
  };

  return html`
    <${PluginPostStatusInfo}
      className=${name}
      title="Additional Author">
        <${Button} onClick=${openModal} variant="secondary" className="editor-post-trash components-button">${buttonLabel}</${Button}>
        ${modalIsOpen && html`
          <${Modal} title='Additional Authors' onRequestClose=${closeModal} shouldCloseOnClickOutside=${false}>
            <div>
              <${FormTokenField}
                label='Additional Authors'
                value=${ people.selected }
                suggestions=${ people.names }
                onChange=${ onAuthorChange }
              />
              ${hasAdditionalAuthors && html`
                <${ToggleControl} 
                  label='Hide Original Author'
                  checked=${hideOgAuthor}
                  onChange=${() => {editPost({meta: {ucd_hide_og_author: !postMeta.ucd_hide_og_author}})}}
                  help="Unless checked, the original author will be displayed before the additional authors selected above."
                />
              `}
            </div>
          </${Modal}>
        `}
    </${PluginPostStatusInfo}>
  `;
 }

const settings = {render: Edit};
export default { name, settings };
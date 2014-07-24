/**
 * Implements hook_menu().
 */
function webform_menu() {
  try {
    var items = {};
    items['node/%/webform-results'] = {
      title: 'Results',
      page_callback: 'webform_results_page',
      pageshow: 'webform_results_pageshow',
      page_arguments: [1],
      weight: 10,
      type: 'MENU_LOCAL_TASK',
      access_callback: 'user_access',
      access_arguments: ['access all webform results']
    };
    // @TODO - Once DrupalGap core supports non consecutive argument
    // placeholders, we can use the same page paths that the webform module uses
    // in Drupal (e.g. node/%/submission/%). But until then we need to use a
    // custom path with consecutive argument placeholders
    items['webform/submission/%/%/%'] = {
      title: 'Submission',
      page_callback: 'webform_submission_page',
      pageshow: 'webform_submission_pageshow',
      page_arguments: [2, 3, 4],
      access_callback: 'user_access',
      access_arguments: ['access all webform results']
    };
    return items;
  }
  catch (error) { console.log('webform_menu - ' + error); }
}

/*********
 * Pages *
 ********/

/**
 *
 */
function webform_results_page(nid) {
  try {
    var content = {};
    content['results'] = {
      markup: '<div id="' + webform_results_container_id(nid) + '"></div>'
    };
    return content;
  }
  catch (error) { console.log('webform_results_page - ' + error); }
}

/**
 *
 */
function webform_results_pageshow(nid) {
  try {
    var query = {
      parameters: {
        nid: nid
      }
    };
    webform_submission_index(query, {
        success: function(results) {
          $('#' + webform_results_container_id(nid)).html(
            theme('webform_results', { results: results })
          ).trigger('create');
        }
    });
  }
  catch (error) { console.log('webform_results_page - ' + error); }
}

/**
 *
 */
function webform_submission_page(mode, nid, sid) {
  try {
    var content = {};
    content['results'] = {
      markup: '<div id="' + webform_submission_container_id(mode, nid, sid) + '"></div>'
    };
    return content;
  }
  catch (error) { console.log('webform_submission_page - ' + error); }
}

/**
 *
 */
function webform_submission_pageshow(mode, nid, sid) {
  try {
    node_load(nid, {
        success: function(node) {
          switch (mode) {
            case 'view':
              webform_submission_retrieve(nid, sid, {
                  success: function(result) {
                    $('#' + webform_submission_container_id(mode, nid, sid)).html(
                      theme('webform_submission', {
                        result: result,
                        node: node
                      })
                    ).trigger('create');
                  }
              });
              break;
          }   
        }
    });
  }
  catch (error) { console.log('webform_submission_pageshow - ' + error); }
}

/*******************
 * Theme Functions *
 ******************/

/**
 *
 */
function theme_webform_results(variables) {
  try {
    var header = [];
    header.push({ data: '#' });
    header.push({ data: 'Submitted' });
    header.push({ data: 'User' });
    header.push({ data: 'IP Address' });
    header.push({ data: 'Operations' });
    var rows = [];
    $.each(variables.results, function(index, result) {
        rows.push([
          result.sid,
          date('Y-m-d h:i:s', result.submitted),
          l(result.uid, 'user/' + result.uid),
          result.remote_addr,
          theme('button_link', {
              text: 'View',
              path: 'webform/submission/view/' + result.nid + '/' + result.sid,
              attributes: {
                'data-icon': 'search'
              }
          })/* +
          theme('button_link', {
              text: 'Edit',
              path: 'node/' + result.nid + '/submission/' + result.sid + '/edit',
              attributes: {
                'data-icon': 'edit'
              }
          }) +
          theme('button_link', {
              text: 'Delete',
              path: 'node/' + result.nid + '/submission/' + result.sid + '/delete',
              attributes: {
                'data-icon': 'delete'
              }
          })*/
        ]);
    });
    var table_data = {
      header: header,
      rows: rows,
      attributes: {
        border: 1
      }
    };
    return theme('jqm_table', table_data);
  }
  catch (error) { console.log('theme_webform_results - ' + error); }
}

/**
 *
 */
function theme_webform_submission(variables) {
  try {
    dpm(variables);
    var html = '';
    var header = [];
    header.push({ data: '#' });
    header.push({ data: 'Submitted' });
    header.push({ data: 'User' });
    header.push({ data: 'IP Address' });
    var rows = [];
    rows.push([
        variables.result.sid,
        date('Y-m-d h:i:s', variables.result.submitted),
        l(variables.result.uid, 'user/' + variables.result.uid),
        variables.result.remote_addr
    ]);
    var table_data = {
      header: header,
      rows: rows,
      attributes: {
        border: 1
      }
    };
    html += theme('jqm_table', table_data);
    $.each(variables.result.data, function(cid, data) {
        html += '<h3>' + variables.node.webform.components[cid].name + '</h3>';
        $.each(data.value, function(delta, value) {
            html += '<p>' + value + '</p>';
        });
    });
    return html;
  }
  catch (error) { console.log('theme_webform_submission - ' + error); }
}

/********************
 * Helper Functions *
 *******************/
 
/**
 *
 */
function webform_results_container_id(nid) {
  try {
    return 'webform_results_container_' + nid;
  }
  catch (error) { console.log('webform_results_container_id - ' + error); }
}

/**
 *
 */
function webform_submission_container_id(mode, nid, sid) {
  try {
    return 'webform_submission_container_' + mode + '_' + nid + '_' + sid;
  }
  catch (error) { console.log('webform_results_container_id - ' + error); }
}

/************
 * Services *
 ***********/

/**
 * Creates a webform_submission.
 * @param {Number} nid
 * @param {Object} webform_submission
 * @param {Object} options
 */
function webform_submission_create(nid, webform_submission, options) {
  try { 
    options.method = 'POST';
    options.data = JSON.stringify({
      nid: nid,
      webform_submission: webform_submission
    });
    options.path = 'webform_submission.json';
    options.service = 'webform_submission';
    options.resource = 'create';
    Drupal.services.call(options);
  }
  catch (error) { console.log('webform_submission_create - ' + error); }
}

/**
 * Retrieves a webform_submission.
 * @param {Number} nid
 * @param {Number} sid
 * @param {Object} options
 */
function webform_submission_retrieve(nid, sid, options) {
  try {
    options.method = 'GET';
    options.path = 'webform_submission/' + nid + '/' + sid + '.json';
    options.service = 'webform_submission';
    options.resource = 'retrieve';
    Drupal.services.call(options);
  }
  catch (error) { console.log('webform_submission_retrieve - ' + error); }
}

/**
 * Update a webform_submission.
 * @param {Number} nid
 * @param {Number} sid
 * @param {Object} webform_submission
 * @param {Object} options
 */
function webform_submission_update(nid, sid, webform_submission, options) {
  try {
  }
  catch (error) { console.log('webform_submission_update - ' + error); }
}

/**
 * Delete a webform_submission.
 * @param {Number} nid
 * @param {Number} sid
 * @param {Object} options
 */
function webform_submission_delete(nid, sid, options) {
  try {
  }
  catch (error) { console.log('webform_submission_delete - ' + error); }
}

/**
 * Perform a webform_submission index.
 * @param {Object} query
 * @param {Object} options
 */
function webform_submission_index(query, options) {
  try {
    var query_string;
    if (typeof query === 'object') {
      query_string = entity_index_build_query_string(query);
    }
    else if (typeof query === 'string') {
      query_string = query;
    }
    if (query_string) { query_string = '&' + query_string; }
    else { query_string = ''; }
    Drupal.services.call({
        method: 'GET',
        path: 'webform_submission.json' + query_string,
        service: 'webform_submission',
        resource: 'index',
        success: function(result) {
          try {
            if (options.success) { options.success(result); }
          }
          catch (error) { console.log('entity_index - success - ' + error); }
        },
        error: function(xhr, status, message) {
          try {
            if (options.error) { options.error(xhr, status, message); }
          }
          catch (error) { console.log('entity_index - error - ' + error); }
        }
    });
  }
  catch (error) { console.log('webform_submission_index - ' + error); }
}

/**
 * Implements hook_entity_post_render_content().
 */
function webform_entity_post_render_content(entity, entity_type, bundle) {
  try {
    // It seems the form disappears once the title page event handler is called.
    if (typeof entity.webform !== 'undefined') {
      entity.content += drupalgap_form_render(drupalgap_form_load('webform_form', entity, entity_type, bundle));
    }
  }
  catch (error) {
    console.log('webform_entity_post_render_content - ' + error);
  }
}

/**
 * The form builder function for a webform.
 */
function webform_form(form, form_state, entity, entity_type, bundle) {
  try {
    // Place the webform components on the entity content.
    $.each(entity.webform.components, function(cid, component) {
        form.elements[component.form_key] = {
          type: component.type,
          title: component.name,
          required: component.mandatory,
          attributes: {
            cid: component.cid,
            pid: component.pid
          }
        }; 
    });
    return form;
  }
  catch (error) { console.log('webform_form - ' + error); }
}

/**
 * 
 */
function webform_form_submit(form, form_state) {
  try {
    drupalgap_alert('hey now!');
  }
  catch (error) { console.log('webform_form - ' + error); }
}

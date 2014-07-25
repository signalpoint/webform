/*********
 * Hooks *
 ********/

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

/*********
 * Forms *
 ********/

/**
 * The form builder function for a webform.
 */
function webform_form(form, form_state, entity, entity_type, bundle) {
  try {
    /**
     * SUPPORTED COMPONENTS
     * [ ] Date
     * [x] E-mail
     * [ ] Fieldset
     * [ ] File
     * [ ] Grid
     * [ ] Hidden
     * [ ] Markup
     * [x] Number
     * [ ] Page break
     * [ ] Select
     * [x] Textarea
     * [x] Textfield
     * [ ] Time
     */
    dpm(entity.webform);
    // Attach the entity to the form.
    form.webform = entity.webform;
    // Place the webform components on the entity content.
    $.each(entity.webform.components, function(cid, component) {
        dpm(component);
        var type = component.type;
        var options = { };
        var attributes = { };
        // Extract the value.
        var value = component.value;
        // Replace the tokens.
        value = webform_tokens_replace(value);
        // Does the user have access to this component.
        var access = true;
        if (
          component.extra['private'] &&
          !user_access('access all webform results')
        ) { access = false; }
        // Display the label?
        var title = component.name;
        if (component.extra.title_display == 'none') { title = ''; }
        // Some component types map cleanly, others do not, make adjustments here.
        switch (type) {
          case 'number':
            // If it is not set to an integer, turn it into a textfield. If it
            // is an int, then set the step, min and max if they are provided.
            if (!component.extra.integer) { type = 'textfield'; }
            else {
              if (!empty(component.extra.min)) { attributes.min = component.extra.min; }
              if (!empty(component.extra.max)) { attributes.max = component.extra.max; }
              if (!empty(component.extra.step)) { attributes.step = component.extra.step; }
            }
            break;
          case 'select':
            // Extract the items (allowed values).
            var items = component.extra.items.split('\n');
            // @TODO - The shuffle function works, but the DG Forms API places
            // the options in order of e.g. an int value.
            if (component.extra.optrand) { items = shuffle(items); }
            for (var i = 0; i < items.length; i++) {
              var parts = items[i].split('|');
              options[parts[0]] = parts[1];
            }
            // What widget are we using?
            var widget = null;
            // A select list.
            if (component.extra.aslist) {
              if (component.extra.multiple) {
                // @TODO - when this component is required, the fake 'required'
                // option comes up in the jQM multiple select widget. We need to
                // prevent that from happening, in DrupalGap core.
                attributes['data-native-menu'] = 'false';
                attributes['multiple'] = 'multiple';
              }
            }
            // Not a select list.
            else {
              if (component.extra.multiple) {
                type = 'checkboxes';
              }
              else {
                type = 'radios';
              }
            }
            break;
        }
        // Set any attributes onto the options.
        options.attributes = attributes;
        // Build the form element.
        form.elements[component.form_key] = {
          type: type,
          title: title,
          required: parseInt(component.mandatory),
          value: value,
          description: webform_tokens_replace(component.extra.description),
          disabled: component.extra.disabled,
          access: access,
          options: options
        }; 
    });
    var submit_text = empty(entity.webform.submit_text) ? 'Submit' : entity.webform.submit_text;
    form.elements['submit'] = {
      type: 'submit',
      value: submit_text
    };
    return form;
  }
  catch (error) { console.log('webform_form - ' + error); }
}

/**
 * 
 */
function webform_form_submit(form, form_state) {
  try {
    var webform_submission = {
      nid: form.webform.nid,
      uid: Drupal.user.uid,
      data: { }
    };
    $.each(form.webform.components, function(cid, component) {
        webform_submission.data[cid] = form_state['values'][component.form_key]; 
    });
    webform_submission_create(webform_submission.nid, webform_submission, {
        success: function(result) {
          dpm(result);
        }
    });
  }
  catch (error) { console.log('webform_form - ' + error); }
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
                    dpm(result);
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

/**
 *
 */
function webform_tokens_replace(value) {
  try {
    var _value;
    var _token;
    var parts = value.split(' ');
    for (var i = 0; i < parts.length; i++) {
      _value = '';
      _token = '';
      if (parts[i].indexOf('%') == 0) {
        if (parts[i].indexOf('%username') == 0 && Drupal.user.uid != 0) {
          _token = '%username';
          _value = Drupal.user.name;
        }
        else if (parts[i].indexOf('%useremail') == 0 && Drupal.user.uid != 0) {
          _token = '%useremail';
          _value = Drupal.user.mail;
        }
        else if (parts[i].indexOf('%ip_address') == 0) {
          _token = '%ip_address';
          _value = drupalgap_get_ip();
        }
        else if (parts[i].indexOf('%site') == 0) {
          _token = '%site';
          _value = drupalgap.settings.title;
        }
        else if (parts[i].indexOf('%nid') == 0) {
          _token = '%nid';
          _value = entity.nid;
        }
        else if (parts[i].indexOf('%title') == 0) {
          _token = '%title';
          _value = entity.title;
        }
      }
      if (!empty(_value)) { value = value.replace(_token, _value); }
    }
    return value;
  }
  catch (error) { console.log('webform_tokens_replace - ' + error); }
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
    options.data = JSON.stringify({ webform_submission: webform_submission });
    options.path = 'webform_submission/' + nid + '.json';
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


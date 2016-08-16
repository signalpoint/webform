/**
 * Component Widgets
 */

/**
 *
 */
function webform_component_date_widget_form(form, form_state, entity, entity_type, bundle, component, element) {
  try {
    // We'll turn this element into a hidden field, and use children to
    // make the widget(s) to power this component.
    var element_id = element.options.attributes.id;
    element.type = 'hidden';
    // Month field.
    var month = {
      title: element.title, // Place the title on the first child since the parent is hidden.
      type: 'select',
      options: {
        1: 'Jan',
        2: 'Feb',
        3: 'Mar',
        4: 'Apr',
        5: 'May',
        6: 'Jun',
        7: 'Jul',
        8: 'Aug',
        9: 'Sep',
        10: 'Oct',
        11: 'Nov',
        12: 'Dec',
        attributes: {
          id: element_id + '-month',
          onchange: "_webform_date_component_onchange('month', '" + element_id + "');"
        }
      }
    };
    // Day field.
    var day = {
      type: 'select',
      options: {
        attributes: {
          id: element_id + '-day',
          onchange: "_webform_date_component_onchange('day', '" + element_id + "');"
        }
      }
    };
    for (var i = 1; i <= 31; i++) { day.options[i] = i; }
    // Year field.
    var year = {
      options: {
        attributes: {
          id: element_id + '-year',
          onchange: "_webform_date_component_onchange('year', '" + element_id + "');"
        }
      }
    };
    if (component.extra.year_textfield) { year.type = 'number'; }
    else {
      year.type = 'select';
      // Figure out the range of years for the select options.
      var range = webform_date_component_parse_range(component);
      if (range) {
        if (range.start_date.interval != range.end_date.interval) {
          console.log('WARNING: webform_form() - only matching start/end intervals supported (' + range.start_date.interval + ' != ' + range.end_date.interval + ')');
        }
        var low = null;
        var high = null;
        var current_year = parseInt(date('Y'));
        switch (range.start_date.interval) {
          case 'year':
          case 'years':
            low = current_year + range.start_date.value; // Value is negative here, so we add it to get the low.
            high = current_year + range.end_date.value;
            break;
          default:
            console.log('WARNING: webform_form() - unsupported date interval (' + range.start_date.interval + ')');
            break;
        }
      }
      for (var i = low; i <= high; i++) { year.options[i] = i; }
    }
    // Push the children onto the element.
    element.children.push(month);
    element.children.push(day);
    element.children.push(year);
  }
  catch (error) { console.log('webform_component_date_widget_form - ' + error); }
}

/**
 *
 */
function webform_component_fieldset_widget_form(form, form_state, entity, entity_type, bundle, component, element) {
  try {
    element.type = 'hidden';
  }
  catch (error) { console.log('webform_component_fieldset_widget_form - ' + error); }
}

/**
 *
 */
function webform_component_grid_widget_form(form, form_state, entity, entity_type, bundle, component, element) {
  try {
    var element_id = element.options.attributes.id;
    // We'll turn this element into a hidden field, and use children to
    // make the widget(s) to power this component.
    element.type = 'hidden';
    // Attach a value_callback and the form id to the element so we can assemble the user's
    // input into a JSON object for the element's form state value.
    element.value_callback = 'webform_component_grid_value_callback';
    element.form_id = form.id;
    // Extract the options and questions.
    var options = component.extra.options.split('\n');
    var questions = component.extra.questions.split('\n');
    for (var i = 0; i < questions.length; i++) {
      var question = questions[i].split('|');
      if (question.length != 2) { continue; }
      var child = {
        type: 'radios',
        title: question[1],
        prefix: '<fieldset data-role="controlgroup" data-type="horizontal">',
        suffix: '</fieldset>',
        options: {
          attributes: {
            id: element_id + '-question-' + i
          }
        }
      };
      for (var j = 0; j < options.length; j++) {
        var option = options[j].split('|');
        if (option.length != 2) { continue; }
        child.options[option[0]] = option[1];
      }
      element.children.push(child);
    }
  }
  catch (error) { console.log('webform_component_grid_widget_form - ' + error); }
}

/**
 *
 */
function webform_component_markup_widget_form(form, form_state, entity, entity_type, bundle, component, element) {
  try {
    var element_id = element.options.attributes.id;
    element.type = null;
    element.title = '';
    element.markup = component.value;
  }
  catch (error) { console.log('webform_component_markup_widget_form - ' + error); }
}

/**
 *
 */
function webform_component_multifile_widget_form(form, form_state, entity, entity_type, bundle, component, element) {
  try {
    element.type = 'hidden';
  }
  catch (error) { console.log('webform_component_multifile_widget_form - ' + error); }
}

/**
 *
 */
function webform_component_number_widget_form(form, form_state, entity, entity_type, bundle, component, element) {
  try {
    var element_id = element.options.attributes.id;
    // If it is not set to an integer, turn it into a textfield. If it
    // is an int, then set the step, min and max if they are provided.
    if (!component.extra.integer) { element.type = 'textfield'; }
    else {
      if (!empty(component.extra.min)) { element.options.attributes.min = component.extra.min; }
      if (!empty(component.extra.max)) { element.options.attributes.max = component.extra.max; }
      if (!empty(component.extra.step)) { element.options.attributes.step = component.extra.step; }
    }
  }
  catch (error) { console.log('webform_component_number_widget_form - ' + error); }
}

/**
 *
 */
function webform_component_phone_widget_form(form, form_state, entity, entity_type, bundle, component, element) {
  try {
    element.type = 'textfield';
  }
  catch (error) { console.log('webform_component_phone_widget_form - ' + error); }
}

/**
 *
 */
function webform_component_select_widget_form(form, form_state, entity, entity_type, bundle, component, element) {
  try {
    if (webform_component_is_hybrid(component)) {
      webform_hybrid_component_select_widget_form(form, form_state, entity, entity_type, bundle, component, element);
      return;
    }
    var element_id = element.options.attributes.id;
    var select_list = component.extra.aslist;
    // Extract the items (allowed values).
    var items = component.extra.items.split('\n');
    if (select_list) {
      var text = element.required ? t('- Select -') : t('- None -');
      element.options[''] = text;
    }
    // @TODO - The shuffle function works, but the DG Forms API places
    // the options in order of e.g. an int value.
    if (component.extra.optrand) { items = shuffle(items); }
    for (var i = 0; i < items.length; i++) {
      var parts = items[i].split('|');
      if (parts.length != 2) { continue; }
      element.options[parts[0]] = parts[1];
    }
    // A select list.
    if (select_list) {
      if (component.extra.multiple) {
        // @TODO - when this component is required, the fake 'required'
        // option comes up in the jQM multiple select widget. We need to
        // prevent that from happening, in DrupalGap core.
        // @UPDATE - I think this has been taken care of now that we are
        // using an empty string for the fake value.
        element.options.attributes['data-native-menu'] = 'false';
        element.options.attributes['multiple'] = 'multiple';
      }
    }
    // Not a select list.
    else {
      if (component.extra.multiple) { element.type = 'checkboxes'; }
      else { element.type = 'radios'; }
    }
  }
  catch (error) { console.log('webform_component_select_widget_form - ' + error); }
}

/**
 *
 */
function webform_component_time_widget_form(form, form_state, entity, entity_type, bundle, component, element) {
  try {
    // We'll turn this element into a hidden field, and use children to
    // make the widget(s) to power this component.
    element.type = 'hidden';
    var element_id = element.options.attributes.id;
    // Hours
    var hours = {
      type: 'select',
      title: element.title, // Place the title on the first child since the parent is hidden.
      options: {
        attributes: {
          id: element_id + '-hours',
          onchange: "_webform_time_component_onchange('hours', '" + element_id + "');"
        }
      }
    };
    var time_format = null;
    if (component.extra.hourformat == '12-hour') {
      for (var i = 1; i <= 12; i++) { hours.options[i] = i; }
      time_format = {
        type: 'radios',
        value: 'am',
        options: {
          am: 'am',
          pm: 'pm',
          attributes: {
            id: element_id + '-ampm',
            onchange: "_webform_time_component_onchange('ampm', '" + element_id + "');"
          }
        }
      }
    }
    else if (component.extra.hourformat == '24-hour') {
      for (var i = 0; i <= 23; i++) { hours.options[i] = i; }
    }
    // Minutes
    var minutes = {
      type: 'select',
      options: {
        attributes: {
          id: element_id + '-minutes',
          onchange: "_webform_time_component_onchange('minutes', '" + element_id + "');"
        }
      }
    };
    for (var i = 0; i < 60; i += parseInt(component.extra.minuteincrements)) {
      var value = i;
      var label = '' + i;
      if (label.length == 1) { label = "0" + label; }
      minutes.options[value] = label;
    }
    // Add the children.
    element.children.push(hours);
    element.children.push(minutes);
    if (time_format) { element.children.push(time_format); }
  }
  catch (error) { console.log('webform_component_time_widget_form - ' + error); }
}

/**
 * Form Helpers
 */

/**
 *
 */
function _webform_date_component_onchange(which, input) {
  try {
    // @TODO - change this to a value_callback.
    var year = $('#' + input + '-year').val();
    var month = $('#' + input + '-month').val(); if (month.length == 1) { month = "0" + month; }
    var day = $('#' + input + '-day').val(); if (day.length == 1) { day = "0" + day; }
    var date = year + '-' + month + '-' + day;
    $('#' + input).val(date);
  }
  catch (error) { console.log('_webform_date_component_onchange - ' + error); }
}

/**
 *
 */
function _webform_time_component_onchange(which, input) {
  try {
    // @TODO - change this to a value_callback.
    var ampm = $('input[name="' + input + '-ampm"]:checked', 'form#webform_form').val();
    var hours = $('#' + input + '-hours').val();
    if (ampm && ampm == 'pm') { hours = (parseInt(hours) + 12) % 24; }
    var minutes = $('#' + input + '-minutes').val(); if (minutes.length == 1) { minutes = "0" + minutes; }
    var date = hours + ':' + minutes + ':00';
    $('#' + input).val(date);
  }
  catch (error) { console.log('_webform_time_component_onchange - ' + error); }
}

/**
 *
 */
function webform_component_grid_value_callback(id, element) {
  try {
    var value = {};
    var options = element.component.extra.options.split('\n');
    var questions = element.component.extra.questions.split('\n');
    for (var i = 0; i < questions.length; i++) {
      var question = questions[i].split('|');
      if (question.length != 2) { continue; }
      value[question[0]] = $(
          'input[name="' + id + '-question-' + i + '"]:checked',
          'form#' + element.form_id
      ).val();
    }
    if (empty(value)) { return null; }
    return value;
  }
  catch (error) { console.log('webform_component_grid_value_callback - ' + error); }
}


/**
 * The form builder function for a webform.
 */
function webform_form(form, form_state, entity, entity_type, bundle) {
  try {

    // @TODO Add support for component weight (ordering), why doesn't the DGFAPI
    //       handle this? It should, but maybe it only supports fields and extra
    //       fields.
    
    form.options.attributes['class'] += ' webform ';

    /**
     * SUPPORTED COMPONENTS
     * [x] Date
     * [x] E-mail
     * [ ] Fieldset
     * [ ] File
     * [x] Grid
     * [x] Hidden
     * [x] Markup
     * [x] Number
     * [ ] Page break
     * [x] Select
     * [x] Textarea
     * [x] Textfield
     * [x] Time
     */

    //console.log('webform_form', form, entity.webform);
    
    // Append the entity type and id to the form id, otherwise we won't have a
    // unique form id when loading multiple webforms across multiple pages.
    form.id += '_' + entity_type + '_' + entity[entity_primary_key(entity_type)];

    // Attach the webform and the uuid to the form.
    form.webform = entity.webform;
    form.uuid = entity.uuid;

    // Place each webform components on the form.
    $.each(entity.webform.components, function(cid, component) {

        //dpm(component.name);
        //dpm(component);

        // Preset some component element variables.
        var title = component.name;
        if (component.extra.title_display == 'none') { title = ''; }
        var required = parseInt(component.required) == 1 ? true : false;
        var markup = null;
        var access = (component.extra['private'] && !user_access('access all webform results')) ? false : true;
        
        // Build the form element basics.
        form.elements[component.form_key] = {
          component: component,
          type: component.type,
          title: (component.extra.description_above) ? '' : title,
          required: required,
          value: webform_tokens_replace(component.value),
          description: (component.extra.description_above) ? '' : webform_tokens_replace(component.extra.description),
          prefix: (component.extra.description_above) ?
            theme('form_element_label', {'element': {'title': title}}) +
            '<div class="description">' + webform_tokens_replace(component.extra.description) + '</div>' : '',
          disabled: component.extra.disabled,
          access: access,
          options: {
            attributes: {
              id: drupalgap_form_get_element_id(component.form_key, form.id) // without this, does the DGFAPI add an id?
            }
          },
          children: [],
          weight: parseInt(component.weight) // Not working...
        };
        
        // Some component types map cleanly, others do not. For those that don't
        // send them off to the component widget form handler.
        var function_name = 'webform_component_' + component.type + '_widget_form';
        if (function_exists(function_name)) {
          var fn = window[function_name];
          fn(form, form_state, entity, entity_type, bundle, component, form.elements[component.form_key]);
        }

    });
    
    // Handle the hybrid component, if it's present.
    if (typeof form.elements['webform_hybrid_component'] !== 'undefined') {
      _webform_hybrid_nid = entity.nid;
      var hybrid_component = webform_hybrid_load(entity.nid);
      //console.log('hybrid element present', hybrid_component);
      $.each(hybrid_component.collapsible_items, function(delta, collapsible) {
          form.elements['webform_hybrid_component'].children.push({
            markup: theme('collapsible', collapsible)
          });
      });
      form.elements['webform_hybrid_component'].children.push({
        markup:
          drupalgap_jqm_page_event_script_code({
              page_id: drupalgap_get_page_id(),
              jqm_page_event: 'pageshow',
              jqm_page_event_callback: 'webform_hybrid_component_pageshow',
              jqm_page_event_args: JSON.stringify({
                  nid: entity.nid
              })
          })
      });
    }

    // Submit button.    
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
function webform_form_pageshow(options) {
  try {
    //return; // temporarily disabled while we work on local_forms
    
    // Has the user already submitted the form?
    var query = {
      parameters: {
        uid: Drupal.user.uid
      }
    };
    webform_submissions(options.uuid, query, {
        success: function(submissions) {
          //dpm('webform_submissions');
          //console.log(submissions);
        }
    });
  }
  catch (error) { console.log('webform_form_pageshow - ' + error); }
}

/**
 * 
 */
function webform_form_validate(form, form_state) {
  try {

    //dpm('webform_form_validate');
    //console.log(form);
    //console.log(form_state);
    
    // If a hybrid component is present, build the form state values.
    if (typeof form_state.values.webform_hybrid_component !== 'undefined') {
      //console.log('webform_hybrid_components', webform_hybrid_components);
      $.each(form.webform.components, function(cid, component) {
          var hybrid = webform_hybrid_load_component(form.webform.nid, cid);
          form_state['values'][component.form_key] = hybrid.extra.drupalgap_webform_hybrid_values;
      });
    }

  }
  catch (error) { console.log('webform_form_validate - ' + error); }
}

/**
 * 
 */
function webform_form_submit(form, form_state) {
  try {

    //console.log('webform_form_submit', form, form_state);

    // Prepare the submission data.
    var submission = {
      uid: Drupal.user.uid, // @TODO not sure if this is used server side, yet.
      data: { }
    };
    
    // Attach the form state values to the submission data. We need to
    // wrap string values in an array for whatever reason(s).
    $.each(form.webform.components, function(cid, component) {
        var values = form_state['values'][component.form_key];
        if (typeof values === 'string') { values = [values]; }
        submission.data[cid] = { values: values };
    });

    var resource = !form.webform_submission_update ? webform_submission_create : webform_submission_update;
    //console.log(!form.webform_submission_update ? 'creating' : 'updating');
    
    // Create (or update) the submission.
    resource(form.uuid, submission, {
        success: function(result) {
          //console.log(result);

          // Depending on the webform's "Redirection location" settings, move
          // the user along and notify them accordingly.
          switch (form.webform.redirect_url) {
            //case '<confirmation>': // Confirmation page
            //case '<none>': // No redirect (reload current page)
            default:
              var msg = form.webform.confirmation;
              if (!empty(msg)) { drupalgap_set_message(msg); }
              if (form.action !== false) {
                var destination = drupalgap_path_get();
                if (typeof form.action === 'string') { destination = form.action; }
                drupalgap_goto(destination, { reloadPage: true });
              }
              break;
          }

        },
        error: function(xhr, status, message) {
          message = JSON.parse(message);
          if (message && message.form_errors) {
            var _messages = '';
            $.each(message.form_errors, function(component, _message) {
                _messages += _message + '\n';
            });
            drupalgap_alert(_messages);
          }
          else { drupalgap_alert(message); }
        }
    });

  }
  catch (error) { console.log('webform_form_submit - ' + error); }
}

/**
 * GLOBALS
 */
var _webform_hybrid_nid = null;

/**
 * HELPERS
 */

/**
 * Given a date component, this will return a JSON object containing the date
 * range.
 */
function webform_date_component_parse_range(component) {
  try {
    var parts = {};
    var keys = ['start_date', 'end_date'];
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (component.extra[key]) {
        var _parts = component.extra[key].split(' ');
        parts[key] = {
          value: parseInt(_parts[0].replace('+', '')),
          interval: _parts[1]
        };
      } 
    }
    if (empty(parts)) { return null; }
    return parts;
  }
  catch (error) { console.log('webform_date_component_parse_range - ' + error); }
}

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
    if (!value) { return ''; }
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
      else if (parts[i].indexOf('[current-page:query:') == 0) {
        var name = parts[i].replace('[current-page:query:', '').replace(']', '');
        _token = '[current-page:query:' + name + ']';
        _value = _GET(name);
      }
      if (!empty(_value)) { value = value.replace(_token, _value); }
    }
    return value;
  }
  catch (error) { console.log('webform_tokens_replace - ' + error); }
}

/**
 * Given a webform select component, this will return a JSON object of the key
 * value pairs, as property value pairs.
 */
function webform_select_component_get_options(component) {
  try {
    if (!component || !component.extra || !component.extra.items) { return null; }
    var options = {};
    var items = component.extra.items.split('\n');
    for (var i = 0; i < items.length; i++) {
      var parts = items[i].split('|');
      if (parts.length != 2) { continue; }
      options[parts[0]] = parts[1];
    }
    return options;
  }
  catch (error) { console.log('webform_select_component_get_options - ' + error); }
}

/**
 *
 */
function webform_load_from_current_page() {
  try {
    return webform_load_form_from_page().webform;
  }
  catch (error) { console.log('webform_load_from_current_page - ' + error); }
}

/**
 *
 */
function webform_load_form_from_page(form_id) {
  try {
    if (!form_id) { form_id = $('#' + drupalgap_get_page_id() + ' form.webform').attr('id'); }
    return drupalgap_form_local_storage_load(form_id);
  }
  catch (error) { console.log('webform_load_from_current_page - ' + error); }
}

/**
 *
 */
function webform_load_component(webform, cid) {
  try {
    var component = null;
    $.each(webform.components, function(component_index, _component) {
        if (_component.cid == cid) {
          component = _component;
          return false;
        }
    });
    return component;
  }
  catch (error) { console.log('webform_load_component - ' + error); }
}

/**
 *
 */
function webform_submission_result_is_empty(values) {
  try {
    var is_empty = false;
    if ($.isArray(values) && values.length === 0) { is_empty = true; }
    else if ($.isEmptyObject(values)) { is_empty = true; }
    return is_empty;
  }
  catch (error) { console.log('webform_submission_result_is_empty - ' + error); }
}

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
    if (typeof entity.webform !== 'undefined') {
      //dpm('webform_entity_post_render_content');
      //dpm('webform_entity_post_render_content');
      //console.log(entity);
      entity.content +=
        drupalgap_form_render(
          drupalgap_form_load('webform_form', entity, entity_type, bundle)
        ) +
        drupalgap_jqm_page_event_script_code({
            page_id: drupalgap_get_page_id(),
            jqm_page_event: 'pageshow',
            jqm_page_event_callback: 'webform_form_pageshow',
            jqm_page_event_args: JSON.stringify({
                nid: entity.nid,
                uuid: entity.uuid
            })
        });
    }
    else {
      console.log('webform was undefined for ' + bundle + ' ' + entity.nid);
    }
  }
  catch (error) {
    console.log('webform_entity_post_render_content - ' + error);
  }
}

/**
 * Implements hook_services_preprocess().
 */
function webform_services_preprocess(options) {
  try {
    // When creating or updating a submission, replace empty array values with an empty object, or the value won't get
    // saved properly in Drupal.
    if (options.service == 'submission' && in_array(options.resource, ['create', 'update'])) {
      var data = JSON.parse(options.data);
      $.each(data.submission.data, function(cid, _data) {
        if ($.isArray(_data.values) && _data.values.length == 0) {
          data.submission.data[cid] = {};
        }
      });
      options.data = JSON.stringify(data);
    }
  }
  catch (error) { console.log('webform_services_preprocess - ' + error); }
}

/**
 * Implements hook_services_postprocess().
 */
function webform_services_postprocess(options, result) {
  try {
    if (options.service == 'webform' && options.resource == 'submissions') {

      //console.log('webform_services_postprocess', result);

      // @NOTE - this is only used to handle hybrid component submission values
      // at this time...
      
      if (result.length == 0) { return; }
      
      // Warn if there is more than one submission, we only handle one at this
      // point.
      if (result.length > 1) {
        console.log('NOTE: webform_services_postprocess only handles the first submission');
      }
      
      // Grab the webform node.
      var webform = webform_load_from_current_page();
      //console.log(webform);
      
      // Extract the submission then iterate over each component.
      var submission = result[0];
      //console.log(submission);
      $.each(submission.data, function(cid, data) {

          //console.log(data.type, data.form_key, data);
          
          // Get the full component from the webform, then pull out the values
          // from this result. If the component fails to load, or it is not
          // a hybrid component then skip it. Then load the hybrid component.
          var component = webform_load_component(webform, data.cid);
          if (!component || !webform_component_is_hybrid(component)) { return; }
          var values = data.values;
          var hybrid = webform_hybrid_load_component(webform.nid, component.cid);
          hybrid.extra.drupalgap_webform_hybrid_values = []; // Make an empty array by default.
          
          // Skip any empty values.
          if (webform_submission_result_is_empty(values)) { return; }
          
          // Place the values onto the hybrid component.
          hybrid.extra.drupalgap_webform_hybrid_values = values;
          
      });
    }
  }
  catch (error) { console.log('webform_services_postprocess - ' + error); }
}

var webform_hybrid_components = {};

/**
 *
 */
function webform_component_is_hybrid(component) {
  try {
    //dpm('webform_component_is_hybrid');
    //console.log(component);
    if (typeof component.extra.drupalgap_webform_select_hybrid !== 'undefined') {
      return component.extra.drupalgap_webform_select_hybrid;
    }
    return false;
  }
  catch (error) { console.log('webform_component_is_hybrid - ' + error); }
}

/**
 *
 */
function webform_hybrid_load(nid) {
  try {
    // Set up a object to house the hybrid components for this node, if it
    // hasn't been already. 
    if (typeof webform_hybrid_components[nid] === 'undefined') {
      webform_hybrid_components[nid] = {
        components: { },
        items: {},
        collapsible_items: []
      };
    }
    return webform_hybrid_components[nid];
  }
  catch (error) { console.log('webform_hybrid_load - ' + error); }
}

/**
 *
 */
function webform_hybrid_load_component(nid, cid) {
  try {
    var hybrid_component = webform_hybrid_load(nid);
    return typeof hybrid_component.components[cid] === 'undefined' ?
      null : hybrid_component.components[cid];
  }
  catch (error) { console.log('webform_hybrid_load_component - ' + error); }
}

/**
 *
 */
function webform_hybrid_component_select_widget_form(form, form_state, entity, entity_type, bundle, component, element) {
  try {
    //dpm('webform_hybrid_component_select_widget_form');
    //console.log(arguments);
    
    var nid = component.nid;
    var cid = component.cid;
    
    // Load the hybrid component.
    var hybrid_component = webform_hybrid_load(nid);
    
    // Then place this component into the object.
    hybrid_component.components[cid] = component;
    
    // Set up the hybrid form element, if it wasn't already.
    if (typeof form.elements['webform_hybrid_component'] === 'undefined') {
      form.elements['webform_hybrid_component'] = {
        type: 'autocomplete',
        items: [],
        weight: element.weight - 1,
        item_onclick: 'webform_hybrid_component_select_item_onclick',
        children: []
      };
    }
    
    // Extract and add the items (allowed values) to the hybrid element, sort
    // the options alphabetically for this component.
    // @WARNING this sort is a bit hacky, if a label has ridiculous characters
    // in it, this may break.
    var options = webform_select_component_get_options(component);
    var _options = { };
    $.each(options, function(value, label) { _options[label] = value; });
    $.each(_options, function(label, value) {
        form.elements['webform_hybrid_component'].items.push({
          value: value,
          label: label,
          attributes: {
            cid: component.cid
          }
      });
    });
    
    // Now add a collapsible item for this component.
    hybrid_component.collapsible_items.push({
        header: component.name,
        content: '<p></p>',
        attributes: {
          cid: cid,
          'class': 'webform_hybrid_component'
        }
    });
    
    // Remove the original component's element from the form.
    delete form.elements[component.form_key];
    
    //var element_id = element.options.attributes.id;

    // A select list.
    /*if (component.extra.aslist) {
      if (component.extra.multiple) {
        // @TODO - when this component is required, the fake 'required'
        // option comes up in the jQM multiple select widget. We need to
        // prevent that from happening, in DrupalGap core.
        // @UPDATE - I think this has been taken care of now that we are
        // using an empty string for the fake value.
        element.options.attributes['data-native-menu'] = 'false';
        element.options.attributes['multiple'] = 'multiple';
      }
    }
    // Not a select list.
    else {
      if (component.extra.multiple) { element.type = 'checkboxes'; }
      else { element.type = 'radios'; }
    }*/

  }
  catch (error) { console.log('webform_hybrid_component_select_widget_form - ' + error); }
}

var _webform_hybrid_expanding = false; // Helps stop a double collapse/expand event on the jQM collapsible.

/**
 *
 */
function webform_hybrid_component_pageshow(options) {
  try {
    var nid = options.nid;
    
    // When a collapsed header is clicked, inject the component options into the
    // expanded widget as checkboxes.
    // @TODO - add radio support
    $('.webform_hybrid_component').on("collapsibleexpand", function(event, ui) {

      if (_webform_hybrid_expanding) { return; }

        var cid = $(event.target).attr('cid');
        
        // Load the options for this component.
        var component = webform_hybrid_load_component(nid, cid);
        var options = webform_select_component_get_options(component);
        //console.log(component, options);
        
        // If there are any options, build an item list of checkboxes, one for
        // each option, then inject the list into the expanded widget's
        // container.
        if (options) {
          var items = [];
          
          // Build the checkboxes.
          $.each(options, function(value, label) {

              // Build the checkbox.
              var checkbox = {
                title: label,
                attributes: {
                  id: nid + '-' + cid + '-' + value,
                  value: value,
                  onclick: 'webform_hybrid_checkbox_click(this)'
                }
              };
              //console.log(value, label);
              //console.log(component.extra.drupalgap_webform_hybrid_values);
              //console.log(typeof component.extra.drupalgap_webform_hybrid_values);

            var is_array = $.isArray(component.extra.drupalgap_webform_hybrid_values);
              
              // Determine if the box is checked or not.
              // @WARNING when the values come back from Drupal they are in an
              // object, but when they come back from the hybrid component in
              // the app, they are in an array, so we cover both cases here.
              if (is_array && in_array(value, component.extra.drupalgap_webform_hybrid_values)) {
                checkbox.attributes.checked = '';
              }
              else if (!is_array && typeof component.extra.drupalgap_webform_hybrid_values === 'object') {
                $.each(component.extra.drupalgap_webform_hybrid_values, function(_index, _value) {
                    if (_index == value && _value != '0') {
                      checkbox.attributes.checked = '';
                      return false;
                    }
                });
              }

              // Build the checkbox label.
              var checkbox_label = { element: checkbox };
              checkbox_label.element.id = checkbox.attributes.id;

              // Render the checkbox and label, then stick it on the items list.
              items.push(
                theme('checkbox', checkbox) +
                theme('form_element_label', checkbox_label)
              );

          });
          
          // Finally, inject the item list into the container.
          _webform_hybrid_expanding = true;
          setTimeout(function() {
            $(event.target).find('p').html(theme('jqm_item_list', {
              items: items,
              attributes: {
                'data-theme': 'b'
              }
            })).trigger('create');
            _webform_hybrid_expanding = false;
          }, 50);

        }
        
    });

  }
  catch (error) { console.log('webform_hybrid_component_pageshow - ' + error); }
}


/**
 * Handles clicks on an autocomplete result item.
 */
function webform_hybrid_component_select_item_onclick(id, item) {
  try {
    var value = $(item).attr('value');
    var cid = $(item).attr('cid');
    //console.log('List id: ' + id + ', value: ' + value + ', cid: ' + cid);
    var page_id = drupalgap_get_page_id();
    
    // Locate the collapsible widget for this option's parent component.
    var collapsible = $('#' + page_id + ' div[cid="' + cid + '"]');
    //$(collapsible).collapsible( "option", "collapsed", false );
    $(collapsible).collapsible("expand");

    setTimeout(function() {
      // Locate the checkbox.
      var selector = '#' + page_id + ' input#' + _webform_hybrid_nid + '-' + cid + '-' + value;
      var checkbox = $(selector);
      //$(checkbox).prop('checked', true).checkboxradio('refresh');;

      // Scroll to the checkbox.
      var input_height = 84; // @TODO needs to by dynamic based on height.
      $('html, body').animate({ scrollTop: $(checkbox).offset().top - input_height }, 1000);

    }, 50);

  }
  catch (error) { console.log('webform_hybrid_component_select_item_onclick - ' + error); }
}

/**
 * Handles clicks on checkboxes inside the collapsibles.
 */
function webform_hybrid_checkbox_click(_checkbox) {
  try {
    
    // Prep the checkbox and determine its checked status.
    var checkbox = $(_checkbox);
    var checked = checkbox.is(':checked');
    
    // Extract the nid, cid and value.
    var parts = checkbox.attr('id').split('-');
    var nid = parts[0];
    var cid = parts[1];
    var value = parts[2];
    
    // Load up the hybrid's component.
    var hybrid = webform_hybrid_load_component(nid, cid);
    
    // Init the hybrid values if they don't exist.
    if (typeof hybrid.extra.drupalgap_webform_hybrid_values === 'undefined') {
      hybrid.extra.drupalgap_webform_hybrid_values = {};
    }
    
    if (checked) {

      // The box is checked...

      // Add the value to the drupalgap_webform_hybrid_values array inside the
      // hybrid component.
      if ($.isArray(hybrid.extra.drupalgap_webform_hybrid_values)) {
        hybrid.extra.drupalgap_webform_hybrid_values.push(value);
      }
      else if (typeof hybrid.extra.drupalgap_webform_hybrid_values === 'object') {
        hybrid.extra.drupalgap_webform_hybrid_values[value] = '' + value;
      }

    }
    else {

      // The box is unchecked...

      // Remove the value from the drupalgap_webform_hybrid_values array
      // inside the hybrid component.
      if ($.isArray(hybrid.extra.drupalgap_webform_hybrid_values)) {
        var index = hybrid.extra.drupalgap_webform_hybrid_values.indexOf(value);
        if (index != -1) { hybrid.extra.drupalgap_webform_hybrid_values.splice(index, 1); }
      }
      else if (typeof hybrid.extra.drupalgap_webform_hybrid_values === 'object') {
        hybrid.extra.drupalgap_webform_hybrid_values[value] = '0';
      }

    }

    //console.log('drupalgap_webform_hybrid_values', hybrid.extra.drupalgap_webform_hybrid_values);

    module_invoke_all('webform_hybrid_checkbox_click', _checkbox);
    
    // Submit the form.
    //$('.webform .dg_form_submit_button').click();
    
  }
  catch (error) { console.log('webform_hybrid_checkbox_click - ' + error); }
}

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


/**
 * SERVICES
 */

/**
 * Creates a webform_submission.
 * @param {Number} uuid
 * @param {Object} submission
 * @param {Object} options
 */
function webform_submission_create(uuid, submission, options) {
  try {
    options.method = 'POST';
    options.data = JSON.stringify({
      webform: uuid,
      submission: submission
    });
    options.path = 'submission.json';
    options.service = 'submission';
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
    options.service = 'submission';
    options.resource = 'retrieve';
    Drupal.services.call(options);
  }
  catch (error) { console.log('webform_submission_retrieve - ' + error); }
}

/**
 * Update a webform_submission.
 * @param {String} uuid
 * @param {Object} submission
 * @param {Object} options
 */
function webform_submission_update(uuid, submission, options) {
  try {
    options.method = 'PUT';
    options.data = JSON.stringify({
      submission: submission
    });
    options.path = 'submission/' + uuid + '.json';
    options.service = 'submission';
    options.resource = 'update';
    Drupal.services.call(options);
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
    console.log('WARNING: webform_submission_delete() not implemented yet!');
  }
  catch (error) { console.log('webform_submission_delete - ' + error); }
}

/**
 *
 */
function webform_submissions(uuid, query, options) {
  try {
    options.method = 'GET';
    options.path = 'webform/' + uuid + '/submissions.json' + webform_prepare_query_string(query);
    options.service = 'webform';
    options.resource = 'submissions';
    Drupal.services.call(options);
  }
  catch (error) { console.log('webform_submissions - ' + error); }
}

/**
 * Perform a webform_submission index.
 * @deprecated
 * @param {Object} query
 * @param {Object} options
 */
function webform_submission_index(query, options) {
  try {
    alert('webform_submission_index is deprecated! Use webform_submissions() instead.');
    return;
    var query_string = webform_prepare_query_string(query);
    Drupal.services.call({
        method: 'GET',
        path: 'submission.json' + query_string,
        service: 'submission',
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
 *
 */
function webform_prepare_query_string(query) {
  try {
    var query_string = '';
    if (typeof query === 'object') {
      query_string = entity_index_build_query_string(query);
    }
    else if (typeof query === 'string') {
      query_string = query;
    }
    if (query_string) { query_string = '&' + query_string; }
    else { query_string = ''; }
    return query_string;
  }
  catch (error) { console.log('webform_prepare_query_string - ' + error); }
}

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


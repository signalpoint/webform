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

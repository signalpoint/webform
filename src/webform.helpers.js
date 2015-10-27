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

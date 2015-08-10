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


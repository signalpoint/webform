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


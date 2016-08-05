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
    var query = {};
    node_load(nid, {
      success: function (node) {
        webform_submissions(node.uuid, query, {
          success: function (submissions) {
            $('#' + webform_results_container_id(nid)).html(
              theme('webform_results', {results: submissions})
            ).trigger('create');
          }
        });
      }
    });
  }
  catch (error) { console.log('webform_results_page - ' + error); }
}

/**
 *
 */
function webform_submission_page(mode, uuid) {
  try {
    var content = {};
    content['results'] = {
      markup: '<div id="' + webform_submission_container_id(mode, uuid) + '"></div>'
    };
    return content;
  }
  catch (error) { console.log('webform_submission_page - ' + error); }
}

/**
 *
 */
function webform_submission_pageshow(mode, uuid) {
  try {
    webform_submission_retrieve(uuid, {
      success: function (result) {
        switch (mode) {
          case 'view':
            // get webform uuid from submission
            var webform_url_split = result.webform.split('/');
            var webform_uuid = webform_url_split[webform_url_split.length - 1];
            webform_webform_retrieve(webform_uuid, {
              success: function (webform) {
                $('#' + webform_submission_container_id(mode, uuid)).html(
                  theme('webform_submission', {
                    result: result,
                    webform: webform
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


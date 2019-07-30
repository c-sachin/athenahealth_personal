/* eslint-disable eqeqeq */
import $ from 'jquery';
const helpers = {
  setMsg: function(loading, error) {
    let msg = [
      {
        msgLoading: loading,
        msgError: error,
      },
    ];

    return msg;
  },
  
  /**
   * Call search url using axios & previous request cancellation mechanism
   *
   * @param {string} apiUrl API Url.
   *
   * @returns {string} API Url
   */
  callSearchApi: function(apiUrl) {
    let result = apiUrl;
    return result;
  },
  /**
   * Generate error message for exception caught in try-catch block.
   *
   * @param {object} err Error object caught in try-catch block.
   *
   * @returns {string} Error Message Json
   */
  errMessage: function(err) {
    let errorMsg = 'Network Error';
    if (err.message != 'Network Error') {
      errorMsg = err.response.data.error;
    }
    let msgErr = this.setMsg('', errorMsg);
    return msgErr;
  },

  /**
   * Get datatable configuration
   * @param {string} sortColumnColunm on which default sort will apply. Default is 'id' column.
   * @param {string} sortOrder Sorting order for default sort. Default is asc
   * @param {boolean} tblStriped stripe color the odd rows. Default is true.
   * @param {boolean} tblHighlightOnHover if rows are to be highlighted on hover. Default is true.
   * @param {boolean} tblResponsive makes the table horizontally scrollable on smaller screen widths. Default is true
   * @param {string} tblHeader removes the table header. title, contextTitle and contextActions will be ignored. Default is true
   * @param {string} tblClassName override the className on the Table wrapper.
   * @param {object} tblCustomTheme Override the default theme, by overriding specifc props. Your changes will be merged. See Theming for more information
   */
  getDatatableConfig: (
    sortColumn = 'id',
    sortOrder = 'asc',
    tblStriped = true,
    tblHighlightOnHover = true,
    tblResponsive = true,
    tblHeader = true,
    tblClassName = 'table table-striped table-bordered table-hover table-condensed',
    tblCustomTheme = {}
  ) => {
    var config = {
      sort: { column: sortColumn, order: sortOrder },
      striped: tblStriped,
      highlightOnHover: tblHighlightOnHover,
      responsive: tblResponsive,
      noHeader: tblHeader,
      className: tblClassName,
      customTheme: tblCustomTheme,
    };
    return config;
  },

  /**
   * Reset datatable pagination to 1st page
   * @param {string} btnId Button selector
   */
  resetDatatablePagination: (btnId = '#pagination-first-page') => {
    $(btnId).trigger('click');
  },
};

export default helpers;

/* eslint-disable eqeqeq */
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
   * Get API path for Patient Daily Query & Before After Analysis Search functionally.
   *
   * @param {string} basePath API Base path.
   * @param {number} type Intervention or measure type. Refer following list.
   * 1. Lab Component
   * 2. Vital Signs
   * 3. Medication
   * 4. Imaging
   * 5. Admission
   * 7. Procedure
   *
   * @returns {string} API Url
   */
  getSearchApiUrl: function(basePath, type) {
    var apiUrl = '';
    if (type == 1) {
      // For Lab Component
      apiUrl = `${basePath}search/lab-component`;
    }
    if (type == 2) {
      // For Vital Signs
      apiUrl = `${basePath}search/vital-signs`;
    }
    if (type == 3) {
      // For Medication
      apiUrl = `${basePath}search/medication`;
    }
    if (type == 4) {
      // For Imaging
      apiUrl = `${basePath}search/imaging`;
    }
    if (type == 5) {
      // For Admission
      apiUrl = `${basePath}search/admission`;
    }
    if (type == 7) {
      // For Procedure
      apiUrl = `${basePath}search/procedure`;
    }
    return apiUrl;
  },
  /**
   * Get API path for Patient Search Query Search functionally.
   *
   * @param {string} basePath API Base path.
   * @param {number} type Intervention or measure type. Refer following list.
   * 1. Patient Demographics
   * 2. Procedure
   * 3. Lab Component
   * 4. Diagnosis
   * 5. Medication
   *
   * @returns {string} API Url
   */
  getSearchApiUrlForPsq: function(basePath, type) {
    var apiUrl = '';
    if (type == 1) {
      // For Patient Demographics
      apiUrl = `${basePath}search/patient-demographics`;
    }
    if (type == 2) {
      // For Procedure
      apiUrl = `${basePath}search/procedure`;
    }
    if (type == 3) {
      // For Lab Component
      apiUrl = `${basePath}search/lab-component`;
    }
    if (type == 4) {
      // For Diagnosis
      apiUrl = `${basePath}search/diagnosis`;
    }
    if (type == 5) {
      // For Medication
      apiUrl = `${basePath}search/medication`;
    }
    return apiUrl;
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
};

export default helpers;

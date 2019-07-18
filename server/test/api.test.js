require('dotenv').config();
const apiFunction = require('./index');
jest.mock('./index');

describe('Login test', () => {
    it('user should login', done => {
        apiFunction
            .login()
            .then(response => {
                expect(response.messages[0]).toMatchObject({
                    message: 'Login successful.',
                });
                done();
            })
            .catch(error => done(error));
    });
});

describe('Facility api test', () => {
    it('should get facility', done => {
        apiFunction
            .facilityGet()
            .then(response => {
                expect(response[0]).toMatchObject({
                    m_facility_id: 1,
                    m_facility_nm: 'Test Facility',
                    m_facility_app_id: 'R7k7hXLgjGY8pdr',
                    m_facility_owner_nm: 'Test Facility',
                    m_added: null,
                    is_deleted: 0,
                    m_facility_active: 0,
                });
                done();
            })
            .catch(error => done(error));
    });
});

describe('Facility user api test', () => {
    it('Get facility users', done => {
        apiFunction
            .facilityUsers()
            .then(response => {
                expect(response.status).toEqual(200);
                expect(response.data[0]).toHaveProperty('m_facility_user_name');
                expect(response.data[0]).toHaveProperty('m_facility_epicuser_id');
                done();
            })
            .catch(error => done(error));
    });
});

describe('Patient search api test', () => {
    it('Should return patient screening', done => {
        apiFunction
            .patientScreening()
            .then(response => {
                expect(response.status).toEqual(200);
                expect(response.data).toContainEqual({
                    m_facility_user_name: 'Patient Screening1',
                    paramCount: 1,
                    psq_created_timestamp: '2019-06-11T14:12:24.000Z',
                    psq_id: 2,
                    psq_name: 'Female',
                    query_run_updated_at: '2019-06-13T17:21:38.000Z',
                    solar_query_reponse_patients_cnt: '586',
                });
                done();
            })
            .catch(error => done(error));
    });

    describe('parameters table values list', () => {
        it('Should return parameters table values 1', done => {
            apiFunction
                .getParametersTableValues(1)
                .then(response => {
                    expect(response.status).toEqual(200);
                    expect(response.data).toContainEqual({
                        parameter_name: 'Age',
                        parameter_id: 'Age',
                        return_type: 'dropdown',
                    });
                    done();
                })
                .catch(error => done(error));
        });

        it('Should return parameters table values 2', done => {
            apiFunction
                .getParametersTableValues(2)
                .then(response => {
                    expect(response.status).toEqual(200);
                    expect(response.data).toContainEqual({
                        parameter_name:
                            '1007-4:DIRECT ANTIGLOBULIN TEST.POLY SPECIFIC REAGENT:ACNC:PT:RBC:ORD|1007-4',
                        parameter_id:
                            '1007-4:DIRECT ANTIGLOBULIN TEST.POLY SPECIFIC REAGENT:ACNC:PT:RBC:ORD|1007-4',
                        return_type: 'value',
                    });
                    done();
                })
                .catch(error => done(error));
        });

        it('Should return parameters table values 3', done => {
            apiFunction
                .getParametersTableValues(3)
                .then(response => {
                    expect(response.status).toEqual(200);
                    expect(response.data).toContainEqual({
                        parameter_name: 'DLCO',
                        parameter_id: 'DLCO',
                        return_type: 'value',
                    });
                    done();
                })
                .catch(error => done(error));
        });

        it('Should return parameters table values 4', done => {
            apiFunction
                .getParametersTableValues(4)
                .then(response => {
                    expect(response.status).toEqual(200);
                    expect(response.data).toContainEqual({
                        parameter_name:
                            'Injury of musculoskeletal system (disorder)|105606008',
                        parameter_id:
                            'Injury of musculoskeletal system (disorder)|105606008',
                        return_type: 'value',
                    });
                    done();
                })
                .catch(error => done(error));
        });

        it('Should return parameters table values 5', done => {
            apiFunction
                .getParametersTableValues(5)
                .then(response => {
                    expect(response.status).toEqual(200);
                    expect(response.data).toContainEqual({
                        parameter_name:
                            'ACETAMINOPHEN-CODEINE #2 300-15 MG PO TABS|65991002050310',
                        parameter_id:
                            'ACETAMINOPHEN-CODEINE #2 300-15 MG PO TABS|65991002050310',
                        return_type: 'value',
                    });
                    done();
                })
                .catch(error => done(error));
        });
    });

    it('Should return patient query list', done => {
        apiFunction
            .patientQueryList()
            .then(response => {
                expect(response.status).toEqual(200);
                expect(response.data).toContainEqual({
                    paramCount: 'Labs,Medication Given,Vital Signs,Imaging',
                    pdq_id: 1,
                    pdq_name: 'Test PDQ 1',
                    pdq_created_timestamp: '2019-06-11T14:12:24.000Z',
                    pdq_user_id: 1,
                    pdq_active: '1',
                    pdq_screening_id: null,
                    is_deleted: 0,
                    m_facility_user_id: 1,
                    f_facility_id: null,
                    user_type: 0,
                    m_facility_user_name: 'Master Admin',
                    m_facility_epicuser_id: null,
                    m_facility_user_active: null,
                    remember_token: null,
                    m_added: '2019-05-29T00:27:36.000Z',
                });
                done();
            })
            .catch(error => done(error));
    });
});

describe('DailyQuery api data', () => {
    it('Should return patient daily query list', done => {
        apiFunction
            .patientDailyQueryList()
            .then(response => {
                expect(response.status).toBe(200);
                expect(response.data).toContainEqual({
                    paramCount: 'Labs,Medication Given,Vital Signs,Imaging',
                    pdq_id: 1,
                    pdq_name: 'Test PDQ 1',
                    pdq_created_timestamp: '2019-06-11T14:12:24.000Z',
                    pdq_user_id: 1,
                    pdq_active: '1',
                    pdq_screening_id: null,
                    is_deleted: 0,
                    m_facility_user_id: 1,
                    f_facility_id: null,
                    user_type: 0,
                    m_facility_user_name: 'Master Admin',
                    m_facility_epicuser_id: null,
                    m_facility_user_active: null,
                    remember_token: null,
                    m_added: '2019-05-29T00:27:36.000Z',
                });
                done();
            })
            .catch(error => done(error));
    });

    describe('Should return variable values', () => {
        it('Should return variable values 1', done => {
            apiFunction
                .getVariableValues(1)
                .then(response => {
                    expect(response.status).toBe(200);
                    expect(response.data).toContainEqual({
                        paramCount: 'Labs,Medication Given,Vital Signs,Imaging',
                        pdq_id: 1,
                        pdq_name: 'Test PDQ 1',
                        pdq_created_timestamp: '2019-06-11T14:12:24.000Z',
                        pdq_user_id: 1,
                        pdq_active: '1',
                        pdq_screening_id: null,
                        is_deleted: 0,
                        m_facility_user_id: 1,
                        f_facility_id: null,
                        user_type: 0,
                        m_facility_user_name: 'Master Admin',
                        m_facility_epicuser_id: null,
                        m_facility_user_active: null,
                        remember_token: null,
                        m_added: '2019-05-29T00:27:36.000Z',
                    });
                    done();
                })
                .catch(error => done(error));
        });

        it('Should return variable values 2', done => {
            apiFunction
                .getVariableValues(2)
                .then(response => {
                    expect(response.status).toBe(200);
                    expect(response.data).toContainEqual({
                        parameter_name: 'PULSE OXIMETRY',
                        parameter_id: 'PULSE OXIMETRY|1',
                        return_type: 'value',
                    });
                    done();
                })
                .catch(error => done(error));
        });

        it('Should return variable values 3', done => {
            apiFunction
                .getVariableValues(3)
                .then(response => {
                    expect(response.status).toBe(200);
                    expect(response.data).toContainEqual({
                        parameter_name:
                            'ACETAMINOPHEN-CODEINE #2 300-15 MG PO TABS|65991002050310',
                        parameter_id:
                            'ACETAMINOPHEN-CODEINE #2 300-15 MG PO TABS|65991002050310',
                        return_type: 'value',
                    });
                    done();
                })
                .catch(error => done(error));
        });

        it('Should return variable values 4', done => {
            apiFunction
                .getVariableValues(4)
                .then(response => {
                    expect(response.status).toBe(200);
                    expect(response.data).toContainEqual({
                        parameter_name: 'RESPIRATORY|76895',
                        parameter_id: 'RESPIRATORY|76895',
                        return_type: 'value',
                    });
                    done();
                })
                .catch(error => done(error));
        });

        it('Should return variable values 5', done => {
            apiFunction
                .getVariableValues(5)
                .then(response => {
                    expect(response.status).toBe(200);
                    expect(response.data).toContainEqual({
                        parameter_name: 'Inpatient',
                        parameter_id: 'Inpatient|1',
                        return_type: 'value',
                    });
                    done();
                })
                .catch(error => done(error));
        });
    });
});

describe('beforeAfterAnalysis api data', () => {
    it('Should return variable values', done => {
        apiFunction
            .getVariableValuesBaa(1)
            .then(response => {
                expect(response.status).toBe(200);
                expect(response.data).toContainEqual({
                    parameter_name: 'DLCO|*Unspecified',
                    parameter_id: 'DLCO|*Unspecified',
                    return_type: 'value',
                });
                done();
            })
            .catch(error => done(error));
        // done(error));
    });
    it('Should return variable values', done => {
        apiFunction
            .getVariableValuesBaa(2)
            .then(response => {
                expect(response.status).toBe(200);
                expect(response.data).toContainEqual({
                    parameter_name: 'PULSE OXIMETRY|1',
                    parameter_id: 'PULSE OXIMETRY|1',
                    return_type: 'value',
                });
                done();
            })
            .catch(error => done(error));
        // done(error));
    });
    it('Should return variable values', done => {
        apiFunction
            .getVariableValuesBaa(3)
            .then(response => {
                expect(response.status).toBe(200);
                expect(response.data).toContainEqual({
                    parameter_name:
                        'ACETAMINOPHEN-CODEINE #2 300-15 MG PO TABS|65991002050310',
                    parameter_id:
                        'ACETAMINOPHEN-CODEINE #2 300-15 MG PO TABS|65991002050310',
                    return_type: 'value',
                });
                done();
            })
            .catch(error => done(error));
        // done(error));
    });
    it('Should return variable values', done => {
        apiFunction
            .getVariableValuesBaa(4)
            .then(response => {
                expect(response.status).toBe(200);
                expect(response.data).toContainEqual({
                    parameter_name: 'RESPIRATORY|76895',
                    parameter_id: 'RESPIRATORY|76895',
                    return_type: 'value',
                });
                done();
            })
            .catch(error => done(error));
        // done(error));
    });
    it('Should return variable values', done => {
        apiFunction
            .getVariableValuesBaa(5)
            .then(response => {
                expect(response.status).toBe(200);
                expect(response.data).toContainEqual({
                    parameter_name: 'Inpatient',
                    parameter_id: 'Inpatient|1',
                    return_type: 'value',
                });
                done();
            })
            .catch(error => done(error));
        // done(error));
    });
    it('Should return variable values', done => {
        apiFunction
            .getVariableValuesBaa(6)
            .then(response => {
                expect(response.status).toBe(200);
                expect(response.data).toContainEqual({
                    parameter_name: 'Inpatient',
                    parameter_id: 'Inpatient|1',
                    return_type: 'value',
                });
                done();
            })
            .catch(error => done(error));
        // done(error));
    });
    it('Should return variable values', done => {
        apiFunction
            .getVariableValuesBaa(7)
            .then(response => {
                expect(response.status).toBe(200);
                expect(response.data).toContainEqual({
                    parameter_name:
                        '1007-4:DIRECT ANTIGLOBULIN TEST.POLY SPECIFIC REAGENT:ACNC:PT:RBC:ORD|1007-4',
                    parameter_id:
                        '1007-4:DIRECT ANTIGLOBULIN TEST.POLY SPECIFIC REAGENT:ACNC:PT:RBC:ORD|1007-4',
                    return_type: 'value',
                });
                done();
            })
            .catch(error => done(error));
    });

    it('Should return patient before after list', done => {
        apiFunction
            .patientBeforeAfterList(7)
            .then(response => {
                expect(response.status).toBe(200);
                expect(response.data).toContainEqual({
                    paramCount: 1,
                    baa_id: 1,
                    baa_name: 'Medication + Labs',
                    baa_user_id: 1,
                    baa_created_timestamp: '2019-06-11T14:12:24.000Z',
                    baa_intervention_timestamp: '2019-06-11T14:12:24.000Z',
                    baa_active: '1',
                    m_facility_user_id: 1,
                    f_facility_id: null,
                    user_type: 0,
                    m_facility_user_name: 'Master Admin',
                    m_facility_epicuser_id: null,
                    m_facility_user_active: null,
                    remember_token: null,
                    m_added: '2019-05-29T00:27:36.000Z',
                    is_deleted: 0,
                });
                done();
            })
            .catch(error => done(error));
    });

    it('Should return variable range 1', done => {
        apiFunction
            .getVariableRange(1)
            .then(response => {
                expect(response.status).toBe(200);
                expect(response.data).toContainEqual({
                    parameter_name: 'Retrieve all values',
                    parameter_id: 'Retrieve all values|1',
                    return_type: 'value',
                });
                done();
            })
            .catch(error => done(error));
    });

    it('Should return variable range 2', done => {
        apiFunction
            .getVariableRange(2)
            .then(response => {
                expect(response.status).toBe(200);
                expect(response.data).toContainEqual({
                    parameter_name: 'Retrieve all values',
                    parameter_id: 'Retrieve all values|1',
                    return_type: 'value',
                });
                done();
            })
            .catch(error => done(error));
    });

    it('Should return variable range 3', done => {
        apiFunction
            .getVariableRange(3)
            .then(response => {
                expect(response.status).toBe(200);
                expect(response.data).toContainEqual({
                    parameter_name: 'Was medication given',
                    parameter_id: 'Was medication given|7',
                    return_type: 'value',
                });
                done();
            })
            .catch(error => done(error));
    });

    it('Should return variable range 4', done => {
        apiFunction
            .getVariableRange(4)
            .then(response => {
                expect(response.status).toBe(200);
                expect(response.data).toContainEqual({
                    parameter_name: 'Was medication given',
                    parameter_id: 'Was medication given|7',
                    return_type: 'value',
                });
                done();
            })
            .catch(error => done(error));
    });
});

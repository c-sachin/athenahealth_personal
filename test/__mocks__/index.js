const index = {
    login: () => {
        return Promise.resolve({
            messages: [
                {
                    message: 'Login successful.',
                },
            ],
        });
    },

    facilityGet: () => {
        return Promise.resolve([
            {
                m_facility_id: 1,
                m_facility_nm: 'Test Facility',
                m_facility_app_id: 'R7k7hXLgjGY8pdr',
                m_facility_owner_nm: 'Test Facility',
                m_added: null,
                is_deleted: 0,
                m_facility_active: 0,
            },
        ]);
    },

    facilityUsers: () => {
        return Promise.resolve({
            status: 200,
            data: [
                {
                    m_facility_user_id: 3,
                    f_facility_id: 1,
                    user_type: null,
                    m_facility_user_name: 'Test facility user',
                    m_facility_epicuser_id: 'uDvtrx7qKIAHGt6',
                    m_facility_user_active: 1,
                    remember_token: null,
                    m_added: null,
                    is_deleted: 0,
                },
            ],
        });
    },

    patientScreening: () => {
        return Promise.resolve({
            status: 200,
            data: [
                {
                    m_facility_user_name: 'Master Admin',
                    paramCount: 1,
                    psq_created_timestamp: '2019-06-11T14:12:24.000Z',
                    psq_id: 1,
                    psq_name: 'Male',
                    query_run_updated_at: '2019-06-13T17:21:38.000Z',
                    solar_query_reponse_patients_cnt: '962',
                },
                {
                    m_facility_user_name: 'Patient Screening1',
                    paramCount: 1,
                    psq_created_timestamp: '2019-06-11T14:12:24.000Z',
                    psq_id: 2,
                    psq_name: 'Female',
                    query_run_updated_at: '2019-06-13T17:21:38.000Z',
                    solar_query_reponse_patients_cnt: '586',
                },
                {
                    m_facility_user_name: 'Patient Screening2',
                    paramCount: 1,
                    psq_created_timestamp: '2019-06-11T15:05:54.000Z',
                    psq_id: 3,
                    psq_name: 'Test Male 2',
                    query_run_updated_at: '2019-06-11T15:05:54.000Z',
                    solar_query_reponse_patients_cnt: '962',
                },
                {
                    m_facility_user_name: 'Patient Screening3',
                    paramCount: 1,
                    psq_created_timestamp: '2019-06-11T15:05:54.000Z',
                    psq_id: 4,
                    psq_name: 'Test Female 2',
                    query_run_updated_at: '2019-06-11T15:05:54.000Z',
                    solar_query_reponse_patients_cnt: '586',
                },
                {
                    m_facility_user_name: 'Patient Screening4',
                    paramCount: 1,
                    psq_created_timestamp: '2019-06-11T15:05:54.000Z',
                    psq_id: 5,
                    psq_name: 'Test Male 3',
                    query_run_updated_at: '2019-06-13T17:21:38.000Z',
                    solar_query_reponse_patients_cnt: '962',
                },
            ],
        });
    },

    getParametersTableValues: value => {
        if (value == 1) {
            return Promise.resolve({
                status: 200,
                data: [
                    {
                        parameter_name: 'Age',
                        parameter_id: 'Age',
                        return_type: 'dropdown',
                    },
                    {
                        parameter_name: 'Sex',
                        parameter_id: 'Sex',
                        return_type: 'dropdown',
                    },
                    {
                        parameter_name: 'Race',
                        parameter_id: 'Race',
                        return_type: 'dropdown',
                    },
                    {
                        parameter_name: 'Marital Status',
                        parameter_id: 'Marital Status',
                        return_type: 'dropdown',
                    },
                ],
            });
        }
        if (value == 2) {
            return Promise.resolve({
                status: 200,
                data: [
                    {
                        parameter_name:
                            '1007-4:DIRECT ANTIGLOBULIN TEST.POLY SPECIFIC REAGENT:ACNC:PT:RBC:ORD|1007-4',
                        parameter_id:
                            '1007-4:DIRECT ANTIGLOBULIN TEST.POLY SPECIFIC REAGENT:ACNC:PT:RBC:ORD|1007-4',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            'S WAVE DURATION.LEAD II:TIME:PT:HEART:QN:EKG|10074-3',
                        parameter_id:
                            'S WAVE DURATION.LEAD II:TIME:PT:HEART:QN:EKG|10074-3',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            'S WAVE DURATION.LEAD III:TIME:PT:HEART:QN:EKG|10075-0',
                        parameter_id:
                            'S WAVE DURATION.LEAD III:TIME:PT:HEART:QN:EKG|10075-0',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            'S WAVE DURATION.LEAD V1:TIME:PT:HEART:QN:EKG|10076-8',
                        parameter_id:
                            'S WAVE DURATION.LEAD V1:TIME:PT:HEART:QN:EKG|10076-8',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            'S WAVE DURATION.LEAD V2:TIME:PT:HEART:QN:EKG|10077-6',
                        parameter_id:
                            'S WAVE DURATION.LEAD V2:TIME:PT:HEART:QN:EKG|10077-6',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            'S WAVE DURATION.LEAD V3:TIME:PT:HEART:QN:EKG|10078-4',
                        parameter_id:
                            'S WAVE DURATION.LEAD V3:TIME:PT:HEART:QN:EKG|10078-4',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            'S WAVE DURATION.LEAD V4:TIME:PT:HEART:QN:EKG|10079-2',
                        parameter_id:
                            'S WAVE DURATION.LEAD V4:TIME:PT:HEART:QN:EKG|10079-2',
                        return_type: 'value',
                    },
                    {
                        parameter_name: '100-8:CEFOPERAZONE:SUSC:PT:ISLT:ORDQN:MIC|100-8',
                        parameter_id: '100-8:CEFOPERAZONE:SUSC:PT:ISLT:ORDQN:MIC|100-8',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            'S WAVE DURATION.LEAD V5:TIME:PT:HEART:QN:EKG|10080-0',
                        parameter_id:
                            'S WAVE DURATION.LEAD V5:TIME:PT:HEART:QN:EKG|10080-0',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            'S WAVE DURATION.LEAD V6:TIME:PT:HEART:QN:EKG|10081-8',
                        parameter_id:
                            'S WAVE DURATION.LEAD V6:TIME:PT:HEART:QN:EKG|10081-8',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            '1008-2:INDIRECT ANTIGLOBULIN TEST.POLY SPECIFIC REAGENT:ACNC:PT:SER/PLAS:ORD|1008-2',
                        parameter_id:
                            '1008-2:INDIRECT ANTIGLOBULIN TEST.POLY SPECIFIC REAGENT:ACNC:PT:SER/PLAS:ORD|1008-2',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            '10082-6:ST INITIAL AMPLITUDE 6 MS.LEAD AVF:ELPOT:PT:HEART:QN:EKG|10082-6',
                        parameter_id:
                            '10082-6:ST INITIAL AMPLITUDE 6 MS.LEAD AVF:ELPOT:PT:HEART:QN:EKG|10082-6',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            '10083-4:ST INITIAL AMPLITUDE 6 MS.LEAD AVL:ELPOT:PT:HEART:QN:EKG|10083-4',
                        parameter_id:
                            '10083-4:ST INITIAL AMPLITUDE 6 MS.LEAD AVL:ELPOT:PT:HEART:QN:EKG|10083-4',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            '10084-2:ST INITIAL AMPLITUDE 6 MS.LEAD AVR:ELPOT:PT:HEART:QN:EKG|10084-2',
                        parameter_id:
                            '10084-2:ST INITIAL AMPLITUDE 6 MS.LEAD AVR:ELPOT:PT:HEART:QN:EKG|10084-2',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            '10085-9:ST INITIAL AMPLITUDE 6 MS.LEAD I:ELPOT:PT:HEART:QN:EKG|10085-9',
                        parameter_id:
                            '10085-9:ST INITIAL AMPLITUDE 6 MS.LEAD I:ELPOT:PT:HEART:QN:EKG|10085-9',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            '10086-7:ST INITIAL AMPLITUDE 6 MS.LEAD II:ELPOT:PT:HEART:QN:EKG|10086-7',
                        parameter_id:
                            '10086-7:ST INITIAL AMPLITUDE 6 MS.LEAD II:ELPOT:PT:HEART:QN:EKG|10086-7',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            '10087-5:ST INITIAL AMPLITUDE 6 MS.LEAD III:ELPOT:PT:HEART:QN:EKG|10087-5',
                        parameter_id:
                            '10087-5:ST INITIAL AMPLITUDE 6 MS.LEAD III:ELPOT:PT:HEART:QN:EKG|10087-5',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            '10088-3:ST INITIAL AMPLITUDE 6 MS.LEAD V1:ELPOT:PT:HEART:QN:EKG|10088-3',
                        parameter_id:
                            '10088-3:ST INITIAL AMPLITUDE 6 MS.LEAD V1:ELPOT:PT:HEART:QN:EKG|10088-3',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            '10089-1:ST INITIAL AMPLITUDE 6 MS.LEAD V2:ELPOT:PT:HEART:QN:EKG|10089-1',
                        parameter_id:
                            '10089-1:ST INITIAL AMPLITUDE 6 MS.LEAD V2:ELPOT:PT:HEART:QN:EKG|10089-1',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            '1009-0:DIRECT ANTIGLOBULIN TEST.POLY SPECIFIC REAGENT:ACNC:PT:RBC:ORD|1009-0',
                        parameter_id:
                            '1009-0:DIRECT ANTIGLOBULIN TEST.POLY SPECIFIC REAGENT:ACNC:PT:RBC:ORD|1009-0',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            '10090-9:ST INITIAL AMPLITUDE 6 MS.LEAD V3:ELPOT:PT:HEART:QN:EKG|10090-9',
                        parameter_id:
                            '10090-9:ST INITIAL AMPLITUDE 6 MS.LEAD V3:ELPOT:PT:HEART:QN:EKG|10090-9',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            '10091-7:ST INITIAL AMPLITUDE 6 MS.LEAD V4:ELPOT:PT:HEART:QN:EKG|10091-7',
                        parameter_id:
                            '10091-7:ST INITIAL AMPLITUDE 6 MS.LEAD V4:ELPOT:PT:HEART:QN:EKG|10091-7',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            '10092-5:ST INITIAL AMPLITUDE 6 MS.LEAD V5:ELPOT:PT:HEART:QN:EKG|10092-5',
                        parameter_id:
                            '10092-5:ST INITIAL AMPLITUDE 6 MS.LEAD V5:ELPOT:PT:HEART:QN:EKG|10092-5',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            '10093-3:ST INITIAL AMPLITUDE 6 MS.LEAD V6:ELPOT:PT:HEART:QN:EKG|10093-3',
                        parameter_id:
                            '10093-3:ST INITIAL AMPLITUDE 6 MS.LEAD V6:ELPOT:PT:HEART:QN:EKG|10093-3',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            '10094-1:ST SLOPE.LEAD AVF:ELPOTRAT:PT:HEART:QN:EKG|10094-1',
                        parameter_id:
                            '10094-1:ST SLOPE.LEAD AVF:ELPOTRAT:PT:HEART:QN:EKG|10094-1',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            '10095-8:ST SLOPE.LEAD AVL:ELPOTRAT:PT:HEART:QN:EKG|10095-8',
                        parameter_id:
                            '10095-8:ST SLOPE.LEAD AVL:ELPOTRAT:PT:HEART:QN:EKG|10095-8',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            '10096-6:ST SLOPE.LEAD AVR:ELPOTRAT:PT:HEART:QN:EKG|10096-6',
                        parameter_id:
                            '10096-6:ST SLOPE.LEAD AVR:ELPOTRAT:PT:HEART:QN:EKG|10096-6',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            '10097-4:ST SLOPE.LEAD I:ELPOTRAT:PT:HEART:QN:EKG|10097-4',
                        parameter_id:
                            '10097-4:ST SLOPE.LEAD I:ELPOTRAT:PT:HEART:QN:EKG|10097-4',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            '10098-2:ST SLOPE.LEAD II:ELPOTRAT:PT:HEART:QN:EKG|10098-2',
                        parameter_id:
                            '10098-2:ST SLOPE.LEAD II:ELPOTRAT:PT:HEART:QN:EKG|10098-2',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            '10099-0:ST SLOPE.LEAD III:ELPOTRAT:PT:HEART:QN:EKG|10099-0',
                        parameter_id:
                            '10099-0:ST SLOPE.LEAD III:ELPOTRAT:PT:HEART:QN:EKG|10099-0',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            '10100-6:ST SLOPE.LEAD V1:ELPOTRAT:PT:HEART:QN:EKG|10100-6',
                        parameter_id:
                            '10100-6:ST SLOPE.LEAD V1:ELPOTRAT:PT:HEART:QN:EKG|10100-6',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            '10101-4:ST SLOPE.LEAD V2:ELPOTRAT:PT:HEART:QN:EKG|10101-4',
                        parameter_id:
                            '10101-4:ST SLOPE.LEAD V2:ELPOTRAT:PT:HEART:QN:EKG|10101-4',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            '10102-2:ST SLOPE.LEAD V3:ELPOTRAT:PT:HEART:QN:EKG|10102-2',
                        parameter_id:
                            '10102-2:ST SLOPE.LEAD V3:ELPOTRAT:PT:HEART:QN:EKG|10102-2',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            '10103-0:ST SLOPE.LEAD V4:ELPOTRAT:PT:HEART:QN:EKG|10103-0',
                        parameter_id:
                            '10103-0:ST SLOPE.LEAD V4:ELPOTRAT:PT:HEART:QN:EKG|10103-0',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            '10104-8:ST SLOPE.LEAD V5:ELPOTRAT:PT:HEART:QN:EKG|10104-8',
                        parameter_id:
                            '10104-8:ST SLOPE.LEAD V5:ELPOTRAT:PT:HEART:QN:EKG|10104-8',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            '10105-5:ST SLOPE.LEAD V6:ELPOTRAT:PT:HEART:QN:EKG|10105-5',
                        parameter_id:
                            '10105-5:ST SLOPE.LEAD V6:ELPOTRAT:PT:HEART:QN:EKG|10105-5',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            '10106-3:ST WAVE DISPLACEMENT.END.LEAD AVF:ELPOT:PT:HEART:QN:EKG|10106-3',
                        parameter_id:
                            '10106-3:ST WAVE DISPLACEMENT.END.LEAD AVF:ELPOT:PT:HEART:QN:EKG|10106-3',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            '10107-1:ST WAVE DISPLACEMENT.END.LEAD AVL:ELPOT:PT:HEART:QN:EKG|10107-1',
                        parameter_id:
                            '10107-1:ST WAVE DISPLACEMENT.END.LEAD AVL:ELPOT:PT:HEART:QN:EKG|10107-1',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            '1010-8:E LITTLE W AB:ACNC:PT:SER/PLAS^BPU:ORD|1010-8',
                        parameter_id:
                            '1010-8:E LITTLE W AB:ACNC:PT:SER/PLAS^BPU:ORD|1010-8',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            '10108-9:ST WAVE DISPLACEMENT.END.LEAD AVR:ELPOT:PT:HEART:QN:EKG|10108-9',
                        parameter_id:
                            '10108-9:ST WAVE DISPLACEMENT.END.LEAD AVR:ELPOT:PT:HEART:QN:EKG|10108-9',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            '10109-7:ST WAVE DISPLACEMENT.END.LEAD I:ELPOT:PT:HEART:QN:EKG|10109-7',
                        parameter_id:
                            '10109-7:ST WAVE DISPLACEMENT.END.LEAD I:ELPOT:PT:HEART:QN:EKG|10109-7',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            '10110-5:ST WAVE DISPLACEMENT.END.LEAD II:ELPOT:PT:HEART:QN:EKG|10110-5',
                        parameter_id:
                            '10110-5:ST WAVE DISPLACEMENT.END.LEAD II:ELPOT:PT:HEART:QN:EKG|10110-5',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            '10111-3:ST WAVE DISPLACEMENT.END.LEAD III:ELPOT:PT:HEART:QN:EKG|10111-3',
                        parameter_id:
                            '10111-3:ST WAVE DISPLACEMENT.END.LEAD III:ELPOT:PT:HEART:QN:EKG|10111-3',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            '10112-1:ST WAVE DISPLACEMENT.END.LEAD V1:ELPOT:PT:HEART:QN:EKG|10112-1',
                        parameter_id:
                            '10112-1:ST WAVE DISPLACEMENT.END.LEAD V1:ELPOT:PT:HEART:QN:EKG|10112-1',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            '10113-9:ST WAVE DISPLACEMENT.END.LEAD V2:ELPOT:PT:HEART:QN:EKG|10113-9',
                        parameter_id:
                            '10113-9:ST WAVE DISPLACEMENT.END.LEAD V2:ELPOT:PT:HEART:QN:EKG|10113-9',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            'T WAVE AMPLITUDE.LEAD AVF:ELPOT:PT:HEART:QN:EKG|10130-3',
                        parameter_id:
                            'T WAVE AMPLITUDE.LEAD AVF:ELPOT:PT:HEART:QN:EKG|10130-3',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            'T WAVE AMPLITUDE.LEAD AVL:ELPOT:PT:HEART:QN:EKG|10131-1',
                        parameter_id:
                            'T WAVE AMPLITUDE.LEAD AVL:ELPOT:PT:HEART:QN:EKG|10131-1',
                        return_type: 'value',
                    },
                    {
                        parameter_name: '1013-2:E LITTLE W AG:ACNC:PT:RBC^BPU:ORD|1013-2',
                        parameter_id: '1013-2:E LITTLE W AG:ACNC:PT:RBC^BPU:ORD|1013-2',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            'T WAVE AMPLITUDE.LEAD AVR:ELPOT:PT:HEART:QN:EKG|10132-9',
                        parameter_id:
                            'T WAVE AMPLITUDE.LEAD AVR:ELPOT:PT:HEART:QN:EKG|10132-9',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            'T WAVE AMPLITUDE.LEAD I:ELPOT:PT:HEART:QN:EKG|10133-7',
                        parameter_id:
                            'T WAVE AMPLITUDE.LEAD I:ELPOT:PT:HEART:QN:EKG|10133-7',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'PR DEBRIDE NECROTIC SKIN/ TISSUE, ABD WALL|11005',
                        parameter_id: 'PR DEBRIDE NECROTIC SKIN/ TISSUE, ABD WALL|11005',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'PR TRANSPLANT,PREP DONOR LIVER/VENOUS|47146',
                        parameter_id: 'PR TRANSPLANT,PREP DONOR LIVER/VENOUS|47146',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'PR DRAINAGE OF PELVIC ABSCESS|45000',
                        parameter_id: 'PR DRAINAGE OF PELVIC ABSCESS|45000',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'PR I&D RECTAL SUBMUCOSAL ABSCESS|45005',
                        parameter_id: 'PR I&D RECTAL SUBMUCOSAL ABSCESS|45005',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'PR DRAINAGE OF DEEP RECTAL ABSCESS|45020',
                        parameter_id: 'PR DRAINAGE OF DEEP RECTAL ABSCESS|45020',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'PR BIOPSY OF RECTUM|45100',
                        parameter_id: 'PR BIOPSY OF RECTUM|45100',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'PR ANORECTAL MYOMECTOMY|45108',
                        parameter_id: 'PR ANORECTAL MYOMECTOMY|45108',
                        return_type: 'value',
                    },
                ],
            });
        }
        if (value == 3) {
            return Promise.resolve({
                status: 200,
                data: [
                    {
                        parameter_name: '*Deleted',
                        parameter_id: '*Deleted',
                        return_type: 'value',
                    },
                    {
                        parameter_name: '*Not Applicable',
                        parameter_id: '*Not Applicable',
                        return_type: 'value',
                    },
                    {
                        parameter_name: '*Unspecified',
                        parameter_id: '*Unspecified',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'DLCO',
                        parameter_id: 'DLCO',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'CD13',
                        parameter_id: 'CD13',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Influenza A AG, DFA',
                        parameter_id: 'Influenza A AG, DFA',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'BCR/ABL Normal',
                        parameter_id: 'BCR/ABL Normal',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'BCR/ABL t(9;22) Rearrangement',
                        parameter_id: 'BCR/ABL t(9;22) Rearrangement',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'BCR/ABL Total Cell',
                        parameter_id: 'BCR/ABL Total Cell',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Influenza B AG,DFA',
                        parameter_id: 'Influenza B AG,DFA',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'BCR/ABL t(9;22) Rearrangement',
                        parameter_id: 'BCR/ABL t(9;22) Rearrangement',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'BCR/ABL t(9;22)',
                        parameter_id: 'BCR/ABL t(9;22)',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'ISCN',
                        parameter_id: 'ISCN',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Zika PCR QUANT',
                        parameter_id: 'Zika PCR QUANT',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Zika Result',
                        parameter_id: 'Zika Result',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Middle Brook Agar',
                        parameter_id: 'Middle Brook Agar',
                        return_type: 'value',
                    },
                    { parameter_name: 'MAC', parameter_id: 'MAC', return_type: 'value' },
                    {
                        parameter_name: 'Choc CO2',
                        parameter_id: 'Choc CO2',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'A LENGTH (OD)',
                        parameter_id: 'A LENGTH (OD)',
                        return_type: 'value',
                    },
                    { parameter_name: 'CNA', parameter_id: 'CNA', return_type: 'value' },
                    {
                        parameter_name: 'Inhibitory Mold Agar',
                        parameter_id: 'Inhibitory Mold Agar',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'JEMBEC',
                        parameter_id: 'JEMBEC',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Thio',
                        parameter_id: 'Thio',
                        return_type: 'value',
                    },
                    { parameter_name: 'SXT', parameter_id: 'SXT', return_type: 'value' },
                    { parameter_name: 'PEA', parameter_id: 'PEA', return_type: 'value' },
                    {
                        parameter_name: 'Mycosel Bottle',
                        parameter_id: 'Mycosel Bottle',
                        return_type: 'value',
                    },
                    { parameter_name: 'MTM', parameter_id: 'MTM', return_type: 'value' },
                    { parameter_name: 'TM', parameter_id: 'TM', return_type: 'value' },
                    {
                        parameter_name: 'CNA CO2',
                        parameter_id: 'CNA CO2',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Case Report',
                        parameter_id: 'Case Report',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Mueller-Hinton Broth',
                        parameter_id: 'Mueller-Hinton Broth',
                        return_type: 'value',
                    },
                    { parameter_name: 'KV', parameter_id: 'KV', return_type: 'value' },
                    { parameter_name: 'EMB', parameter_id: 'EMB', return_type: 'value' },
                    { parameter_name: 'CIN', parameter_id: 'CIN', return_type: 'value' },
                    {
                        parameter_name: 'CVA (Campy)',
                        parameter_id: 'CVA (Campy)',
                        return_type: 'value',
                    },
                    { parameter_name: 'XLD', parameter_id: 'XLD', return_type: 'value' },
                    {
                        parameter_name: 'V Agar',
                        parameter_id: 'V Agar',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'TH Broth',
                        parameter_id: 'TH Broth',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'GN Broth',
                        parameter_id: 'GN Broth',
                        return_type: 'value',
                    },
                    { parameter_name: 'BAP', parameter_id: 'BAP', return_type: 'value' },
                    {
                        parameter_name: 'A LENGTH (OS)',
                        parameter_id: 'A LENGTH (OS)',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Chocolate',
                        parameter_id: 'Chocolate',
                        return_type: 'value',
                    },
                    { parameter_name: 'HE', parameter_id: 'HE', return_type: 'value' },
                    {
                        parameter_name: 'Fused Signals (Normal)',
                        parameter_id: 'Fused Signals (Normal)',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Adjacent + Green',
                        parameter_id: 'Adjacent + Green',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Green + Orange',
                        parameter_id: 'Green + Orange',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Adjacent + Orange',
                        parameter_id: 'Adjacent + Orange',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'AC IOL (OD)',
                        parameter_id: 'AC IOL (OD)',
                        return_type: 'value',
                    },
                    {
                        parameter_name: '% Adjacent/Fused',
                        parameter_id: '% Adjacent/Fused',
                        return_type: 'value',
                    },
                    {
                        parameter_name: '% Adjacent + Green',
                        parameter_id: '% Adjacent + Green',
                        return_type: 'value',
                    },
                    {
                        parameter_name: '% Green + Orange',
                        parameter_id: '% Green + Orange',
                        return_type: 'value',
                    },
                    {
                        parameter_name: '% Adjacent + Orange',
                        parameter_id: '% Adjacent + Orange',
                        return_type: 'value',
                    },
                    {
                        parameter_name: '% Positive Cells',
                        parameter_id: '% Positive Cells',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Interpretation',
                        parameter_id: 'Interpretation',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'ALK Rearrangement',
                        parameter_id: 'ALK Rearrangement',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Metamyelocytes %',
                        parameter_id: 'Metamyelocytes %',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'BLOOD CULTURE BOTTLE',
                        parameter_id: 'BLOOD CULTURE BOTTLE',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Creatinine',
                        parameter_id: 'Creatinine',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Promyelocytes %',
                        parameter_id: 'Promyelocytes %',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'HLA-B*57:01',
                        parameter_id: 'HLA-B*57:01',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'TPMT PHENOTYPE',
                        parameter_id: 'TPMT PHENOTYPE',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Atypical Lymphocytes %',
                        parameter_id: 'Atypical Lymphocytes %',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Protein, Ur',
                        parameter_id: 'Protein, Ur',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Metamyelocytes Absolute',
                        parameter_id: 'Metamyelocytes Absolute',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Metamyelocytes Manual',
                        parameter_id: 'Metamyelocytes Manual',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Promyelocytes Absolute',
                        parameter_id: 'Promyelocytes Absolute',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Promyelocytes Manual',
                        parameter_id: 'Promyelocytes Manual',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Atypical Lymphs Absolute',
                        parameter_id: 'Atypical Lymphs Absolute',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Atypical Lymphocytes Manual',
                        parameter_id: 'Atypical Lymphocytes Manual',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'AC IOL (OS)',
                        parameter_id: 'AC IOL (OS)',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'ARDEN RATIO (OD)',
                        parameter_id: 'ARDEN RATIO (OD)',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'ARDEN RATIO (OS)',
                        parameter_id: 'ARDEN RATIO (OS)',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Left arm BP',
                        parameter_id: 'Left arm BP',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Right arm BP',
                        parameter_id: 'Right arm BP',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Left posterior tibial',
                        parameter_id: 'Left posterior tibial',
                        return_type: 'value',
                    },
                ],
            });
        }
        if (value == 4) {
            return Promise.resolve({
                status: 200,
                data: [
                    {
                        parameter_name:
                            'Injury of musculoskeletal system (disorder)|105606008',
                        parameter_id:
                            'Injury of musculoskeletal system (disorder)|105606008',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Open wound of limb (disorder)|105616000',
                        parameter_id: 'Open wound of limb (disorder)|105616000',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            'Disorder of connective tissue (disorder)|105969002',
                        parameter_id: 'Disorder of connective tissue (disorder)|105969002',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Musculoskeletal finding (finding)|106028002',
                        parameter_id: 'Musculoskeletal finding (finding)|106028002',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Finding of upper limb (finding)|116307009',
                        parameter_id: 'Finding of upper limb (finding)|116307009',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Finding by site (finding)|118234003',
                        parameter_id: 'Finding by site (finding)|118234003',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Disorder of upper extremity (disorder)|118947000',
                        parameter_id: 'Disorder of upper extremity (disorder)|118947000',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Bone finding (finding)|118953000',
                        parameter_id: 'Bone finding (finding)|118953000',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Disorder by body site (disorder)|123946008',
                        parameter_id: 'Disorder by body site (disorder)|123946008',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Injury of forearm (disorder)|125597008',
                        parameter_id: 'Injury of forearm (disorder)|125597008',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Fracture of bone (disorder)|125605004',
                        parameter_id: 'Fracture of bone (disorder)|125605004',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Open wound (disorder)|125643001',
                        parameter_id: 'Open wound (disorder)|125643001',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Open wound of forearm (disorder)|125649002',
                        parameter_id: 'Open wound of forearm (disorder)|125649002',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Injury of upper extremity (disorder)|127278005',
                        parameter_id: 'Injury of upper extremity (disorder)|127278005',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Disorder of forearm (disorder)|128132009',
                        parameter_id: 'Disorder of forearm (disorder)|128132009',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Disorder of extremity (disorder)|128605003',
                        parameter_id: 'Disorder of extremity (disorder)|128605003',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'SNOMED CT Concept (SNOMED RT+CTV3)|138875005',
                        parameter_id: 'SNOMED CT Concept (SNOMED RT+CTV3)|138875005',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Open fracture of upper limb (disorder)|18336000',
                        parameter_id: 'Open fracture of upper limb (disorder)|18336000',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Wound finding (finding)|225552003',
                        parameter_id: 'Wound finding (finding)|225552003',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Fracture of upper limb (disorder)|23406007',
                        parameter_id: 'Fracture of upper limb (disorder)|23406007',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Fracture of shaft of ulna (disorder)|263204007',
                        parameter_id: 'Fracture of shaft of ulna (disorder)|263204007',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Bone injury (disorder)|284003005',
                        parameter_id: 'Bone injury (disorder)|284003005',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Finding of bone of upper limb (finding)|298756009',
                        parameter_id: 'Finding of bone of upper limb (finding)|298756009',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Finding of body region (finding)|301857004',
                        parameter_id: 'Finding of body region (finding)|301857004',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Finding of limb structure (finding)|302293008',
                        parameter_id: 'Finding of limb structure (finding)|302293008',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            'Musculoskeletal and connective tissue disorder (disorder)|312225001',
                        parameter_id:
                            'Musculoskeletal and connective tissue disorder (disorder)|312225001',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Disorder of body system (disorder)|362965005',
                        parameter_id: 'Disorder of body system (disorder)|362965005',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Open fracture of ulna (disorder)|37449000',
                        parameter_id: 'Open fracture of ulna (disorder)|37449000',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Injury of connective tissue (disorder)|385424001',
                        parameter_id: 'Injury of connective tissue (disorder)|385424001',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Open fracture (disorder)|397181002',
                        parameter_id: 'Open fracture (disorder)|397181002',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Clinical finding (finding)|404684003',
                        parameter_id: 'Clinical finding (finding)|404684003',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Wound (disorder)|416462003',
                        parameter_id: 'Wound (disorder)|416462003',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            'Traumatic AND/OR non-traumatic injury (disorder)|417163006',
                        parameter_id:
                            'Traumatic AND/OR non-traumatic injury (disorder)|417163006',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Traumatic injury (disorder)|417746004',
                        parameter_id: 'Traumatic injury (disorder)|417746004',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            'Open fracture of shaft of ulna (disorder)|42760000',
                        parameter_id: 'Open fracture of shaft of ulna (disorder)|42760000',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Injury of ulna (disorder)|429197005',
                        parameter_id: 'Injury of ulna (disorder)|429197005',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Open fracture of bone (disorder)|439987009',
                        parameter_id: 'Open fracture of bone (disorder)|439987009',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Fracture of ulna (disorder)|54556006',
                        parameter_id: 'Fracture of ulna (disorder)|54556006',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Traumatic injury by site (disorder)|609336008',
                        parameter_id: 'Traumatic injury by site (disorder)|609336008',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            'Traumatic and/or non-traumatic injury of anatomical site (disorder)|609411003',
                        parameter_id:
                            'Traumatic and/or non-traumatic injury of anatomical site (disorder)|609411003',
                        return_type: 'value',
                    },
                ],
            });
        }
        if (value == 5) {
            return Promise.resolve({
                status: 200,
                data: [
                    {
                        parameter_name:
                            'ACETAMINOPHEN-CODEINE #2 300-15 MG PO TABS|65991002050310',
                        parameter_id:
                            'ACETAMINOPHEN-CODEINE #2 300-15 MG PO TABS|65991002050310',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'THSC AMOXICILLIN 250 MG PO CAPS|1200010100105',
                        parameter_id: 'THSC AMOXICILLIN 250 MG PO CAPS|1200010100105',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'SURGICAL DEPILATORIES EX CREA|90748510003700',
                        parameter_id: 'SURGICAL DEPILATORIES EX CREA|90748510003700',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            'ADEN-INOS-NA PYRU-NAPH-NAPHDIB VI SOLN|85278005202020',
                        parameter_id:
                            'ADEN-INOS-NA PYRU-NAPH-NAPHDIB VI SOLN|85278005202020',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            'SODIUM CITRATE DIHYDRATE 2.2 % VI SOLN|83400080102011',
                        parameter_id:
                            'SODIUM CITRATE DIHYDRATE 2.2 % VI SOLN|83400080102011',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            'ANTICOAGULANT SODIUM CITRATE 46.7 % VI CONC|83400080101320',
                        parameter_id:
                            'ANTICOAGULANT SODIUM CITRATE 46.7 % VI CONC|83400080101320',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'INDINAVIR SULFATE 400 MG PO CAPS|12104530200140',
                        parameter_id: 'INDINAVIR SULFATE 400 MG PO CAPS|12104530200140',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'INDINAVIR SULFATE 200 MG PO CAPS|12104530200120',
                        parameter_id: 'INDINAVIR SULFATE 200 MG PO CAPS|12104530200120',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'TI-SCREEN SPF15 EX LOTN|90920000004100',
                        parameter_id: 'TI-SCREEN SPF15 EX LOTN|90920000004100',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'NIVEA SKIN EX OIL|90976000001700',
                        parameter_id: 'NIVEA SKIN EX OIL|90976000001700',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'STERILE DILUENT FOR FLOLAN IV SOLN|98401006002020',
                        parameter_id: 'STERILE DILUENT FOR FLOLAN IV SOLN|98401006002020',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'AQUAZ GENTLE FACIAL WASH EX LIQD|90973000000900',
                        parameter_id: 'AQUAZ GENTLE FACIAL WASH EX LIQD|90973000000900',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'CHLORZOXAZONE 500 MG PO TABS|75100040000310',
                        parameter_id: 'CHLORZOXAZONE 500 MG PO TABS|75100040000310',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'GLYCINE DILUENT IV SOLN|98401006002020',
                        parameter_id: 'GLYCINE DILUENT IV SOLN|98401006002020',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            'CODAL-DH 5-8.33-1.66 MG/5ML PO SYRP|43995303521210',
                        parameter_id: 'CODAL-DH 5-8.33-1.66 MG/5ML PO SYRP|43995303521210',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'SENNA 30 MG PO MISC|46200060106330',
                        parameter_id: 'SENNA 30 MG PO MISC|46200060106330',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'ALCOHOL, USP 95 % SOLN|96201020002095',
                        parameter_id: 'ALCOHOL, USP 95 % SOLN|96201020002095',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            'PHENYLPROPANOLAMINE BIT-ASA 20-325 MG PO TBEF|43991002230820',
                        parameter_id:
                            'PHENYLPROPANOLAMINE BIT-ASA 20-325 MG PO TBEF|43991002230820',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'VITAMINS B1 B6 B12 PO CHEW|78106000000500',
                        parameter_id: 'VITAMINS B1 B6 B12 PO CHEW|78106000000500',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'PAROXETINE HCL 40 MG PO TABS|58160060000340',
                        parameter_id: 'PAROXETINE HCL 40 MG PO TABS|58160060000340',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'PAROXETINE HCL 10 MG PO TABS|58160060000310',
                        parameter_id: 'PAROXETINE HCL 10 MG PO TABS|58160060000310',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            'CHLORPHENIRAMINE-DM 4-30 MG PO TABS|43995702100320',
                        parameter_id: 'CHLORPHENIRAMINE-DM 4-30 MG PO TABS|43995702100320',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'ACETAMINOPHEN-DM 325-15 MG PO CAPS|43995502200115',
                        parameter_id: 'ACETAMINOPHEN-DM 325-15 MG PO CAPS|43995502200115',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'CHLORZOXAZONE 250 MG PO TABS|75100040000305',
                        parameter_id: 'CHLORZOXAZONE 250 MG PO TABS|75100040000305',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'CORRECTOL HERBAL TEA 30 MG PO MISC|46200060106330',
                        parameter_id: 'CORRECTOL HERBAL TEA 30 MG PO MISC|46200060106330',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            'DRIXORAL COUGH/SORE THROAT 325-15 MG PO CAPS|43995502200115',
                        parameter_id:
                            'DRIXORAL COUGH/SORE THROAT 325-15 MG PO CAPS|43995502200115',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            'CORICIDIN HBP COUGH/COLD 4-30 MG PO TABS|43995702100320',
                        parameter_id:
                            'CORICIDIN HBP COUGH/COLD 4-30 MG PO TABS|43995702100320',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'ETHYL ALCOHOL 95 % SOLN|96201020002095',
                        parameter_id: 'ETHYL ALCOHOL 95 % SOLN|96201020002095',
                        return_type: 'value',
                    },
                    {
                        parameter_name: '3M DURABLE MOISTURIZING EX CREA|90650000003700',
                        parameter_id: '3M DURABLE MOISTURIZING EX CREA|90650000003700',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'PAXIL 40 MG PO TABS|58160060000340',
                        parameter_id: 'PAXIL 40 MG PO TABS|58160060000340',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'PAXIL 10 MG PO TABS|58160060000310',
                        parameter_id: 'PAXIL 10 MG PO TABS|58160060000310',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'NIVEA SHOWER/BATH EX GEL|90400000004000',
                        parameter_id: 'NIVEA SHOWER/BATH EX GEL|90400000004000',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            'COPPERTONE SKIN SELECTS DRY EX LOTN|90920000004100',
                        parameter_id: 'COPPERTONE SKIN SELECTS DRY EX LOTN|90920000004100',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'COPPERTONE SKIN SELECTS EX LOTN|90920000004100',
                        parameter_id: 'COPPERTONE SKIN SELECTS EX LOTN|90920000004100',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'CHLORTHALIDONE 50 MG PO TABS|37600025000310',
                        parameter_id: 'CHLORTHALIDONE 50 MG PO TABS|37600025000310',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'PREGESTIMIL PO LIQD|81100000000900',
                        parameter_id: 'PREGESTIMIL PO LIQD|81100000000900',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'MARTEN-TAB 50-325 MG PO TABS|64991002120310',
                        parameter_id: 'MARTEN-TAB 50-325 MG PO TABS|64991002120310',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            'COPPERTONE SKIN SELECTS OILY EX LOTN|90920000004100',
                        parameter_id: 'COPPERTONE SKIN SELECTS OILY EX LOTN|90920000004100',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'DENTAL NEEDLE 30GX32MM MISC|97500540306332',
                        parameter_id: 'DENTAL NEEDLE 30GX32MM MISC|97500540306332',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'DENTAL NEEDLE 30GX21MM MISC|97500540306321',
                        parameter_id: 'DENTAL NEEDLE 30GX21MM MISC|97500540306321',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'DENTAL NEEDLE 27GX21MM MISC|97500540276321',
                        parameter_id: 'DENTAL NEEDLE 27GX21MM MISC|97500540276321',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'DENTAL NEEDLE 25GX21MM MISC|97500540256321',
                        parameter_id: 'DENTAL NEEDLE 25GX21MM MISC|97500540256321',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'DENTAL NEEDLE 30GX12MM MISC|97500540306312',
                        parameter_id: 'DENTAL NEEDLE 30GX12MM MISC|97500540306312',
                        return_type: 'value',
                    },
                ],
            });
        }
    },

    patientQueryList: () => {
        return Promise.resolve({
            status: 200,
            data: [
                {
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
                },
                {
                    paramCount: 'Labs,Medication Given,Vital Signs,Imaging',
                    pdq_id: 2,
                    pdq_name: 'Test PDQ 2',
                    pdq_created_timestamp: '2019-06-11T15:05:54.000Z',
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
                },
                {
                    paramCount: 'Labs,Medication Given,Vital Signs,Imaging',
                    pdq_id: 3,
                    pdq_name: 'Test PDQ 3',
                    pdq_created_timestamp: '2019-06-11T15:05:54.000Z',
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
                },
            ],
        });
    },

    patientDailyQueryList: () => {
        return Promise.resolve({
            status: 200,
            data: [
                {
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
                },
                {
                    paramCount: 'Labs,Medication Given,Vital Signs,Imaging',
                    pdq_id: 2,
                    pdq_name: 'Test PDQ 2',
                    pdq_created_timestamp: '2019-06-11T15:05:54.000Z',
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
                },
                {
                    paramCount: 'Labs,Medication Given,Vital Signs,Imaging',
                    pdq_id: 3,
                    pdq_name: 'Test PDQ 3',
                    pdq_created_timestamp: '2019-06-11T15:05:54.000Z',
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
                },
            ],
        });
    },

    getVariableValues: value => {
        if (value == 1) {
            return Promise.resolve({
                status: 200,
                data: [
                    {
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
                    },
                ],
            });
        }

        if (value == 2) {
            return Promise.resolve({
                status: 200,
                data: [
                    {
                        parameter_name: 'PULSE OXIMETRY',
                        parameter_id: 'PULSE OXIMETRY|1',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'MAP',
                        parameter_id: 'MAP|2',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Respiratory rate',
                        parameter_id: 'Respiratory rate|3',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Temperature',
                        parameter_id: 'Temperature|4',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'O2 saturation',
                        parameter_id: 'O2 saturation|5',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Blood Pressure',
                        parameter_id: 'Blood Pressure|6',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Heart Rate',
                        parameter_id: 'Heart Rate|7',
                        return_type: 'value',
                    },
                ],
            });
        }

        if (value == 3) {
            return Promise.resolve({
                status: 200,
                data: [
                    {
                        parameter_name:
                            'ACETAMINOPHEN-CODEINE #2 300-15 MG PO TABS|65991002050310',
                        parameter_id:
                            'ACETAMINOPHEN-CODEINE #2 300-15 MG PO TABS|65991002050310',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'THSC AMOXICILLIN 250 MG PO CAPS|1200010100105',
                        parameter_id: 'THSC AMOXICILLIN 250 MG PO CAPS|1200010100105',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'SURGICAL DEPILATORIES EX CREA|90748510003700',
                        parameter_id: 'SURGICAL DEPILATORIES EX CREA|90748510003700',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            'ADEN-INOS-NA PYRU-NAPH-NAPHDIB VI SOLN|85278005202020',
                        parameter_id:
                            'ADEN-INOS-NA PYRU-NAPH-NAPHDIB VI SOLN|85278005202020',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            'SODIUM CITRATE DIHYDRATE 2.2 % VI SOLN|83400080102011',
                        parameter_id:
                            'SODIUM CITRATE DIHYDRATE 2.2 % VI SOLN|83400080102011',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            'ANTICOAGULANT SODIUM CITRATE 46.7 % VI CONC|83400080101320',
                        parameter_id:
                            'ANTICOAGULANT SODIUM CITRATE 46.7 % VI CONC|83400080101320',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'INDINAVIR SULFATE 400 MG PO CAPS|12104530200140',
                        parameter_id: 'INDINAVIR SULFATE 400 MG PO CAPS|12104530200140',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'INDINAVIR SULFATE 200 MG PO CAPS|12104530200120',
                        parameter_id: 'INDINAVIR SULFATE 200 MG PO CAPS|12104530200120',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'TI-SCREEN SPF15 EX LOTN|90920000004100',
                        parameter_id: 'TI-SCREEN SPF15 EX LOTN|90920000004100',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'NIVEA SKIN EX OIL|90976000001700',
                        parameter_id: 'NIVEA SKIN EX OIL|90976000001700',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'STERILE DILUENT FOR FLOLAN IV SOLN|98401006002020',
                        parameter_id: 'STERILE DILUENT FOR FLOLAN IV SOLN|98401006002020',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'AQUAZ GENTLE FACIAL WASH EX LIQD|90973000000900',
                        parameter_id: 'AQUAZ GENTLE FACIAL WASH EX LIQD|90973000000900',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'CHLORZOXAZONE 500 MG PO TABS|75100040000310',
                        parameter_id: 'CHLORZOXAZONE 500 MG PO TABS|75100040000310',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'GLYCINE DILUENT IV SOLN|98401006002020',
                        parameter_id: 'GLYCINE DILUENT IV SOLN|98401006002020',
                        return_type: 'value',
                    },
                ],
            });
        }

        if (value == 4) {
            return Promise.resolve({
                status: 200,
                data: [
                    {
                        parameter_name: 'RESPIRATORY|76895',
                        parameter_id: 'RESPIRATORY|76895',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'ULTRASOUND B|79108',
                        parameter_id: 'ULTRASOUND B|79108',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'ULTRASOUND B|79111',
                        parameter_id: 'ULTRASOUND B|79111',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'BREAST TOMOS|79112',
                        parameter_id: 'BREAST TOMOS|79112',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'BREAST TOMOS|79114',
                        parameter_id: 'BREAST TOMOS|79114',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'BREAST TOMOS|79115',
                        parameter_id: 'BREAST TOMOS|79115',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'DXA BONE DEN|79117',
                        parameter_id: 'DXA BONE DEN|79117',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'FRACTURE ASS|79119',
                        parameter_id: 'FRACTURE ASS|79119',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'TELETHX ISOD|79121',
                        parameter_id: 'TELETHX ISOD|79121',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'TELETHX ISOD|79122',
                        parameter_id: 'TELETHX ISOD|79122',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'BRACHYTX ISO|79124',
                        parameter_id: 'BRACHYTX ISO|79124',
                        return_type: 'value',
                    },
                ],
            });
        }

        if (value == 5) {
            return Promise.resolve({
                status: 200,
                data: [
                    {
                        parameter_name: 'Inpatient',
                        parameter_id: 'Inpatient|1',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Discharged',
                        parameter_id: 'Discharged|2',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Outpatient visit',
                        parameter_id: 'Outpatient visit|3',
                        return_type: 'value',
                    },
                ],
            });
        }
    },

    getVariableValuesBaa: value => {
        if (value == 1) {
            return Promise.resolve({
                status: 200,
                data: [
                    {
                        parameter_name: 'DLCO|*Unspecified',
                        parameter_id: 'DLCO|*Unspecified',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'CD13|*Unspecified',
                        parameter_id: 'CD13|*Unspecified',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Influenza A AG, DFA|*Unspecified',
                        parameter_id: 'Influenza A AG, DFA|*Unspecified',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'BCR/ABL Normal|*Unspecified',
                        parameter_id: 'BCR/ABL Normal|*Unspecified',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'BCR/ABL t(9;22) Rearrangement|*Unspecified',
                        parameter_id: 'BCR/ABL t(9;22) Rearrangement|*Unspecified',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'BCR/ABL Total Cell|*Unspecified',
                        parameter_id: 'BCR/ABL Total Cell|*Unspecified',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Influenza B AG,DFA|*Unspecified',
                        parameter_id: 'Influenza B AG,DFA|*Unspecified',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'BCR/ABL t(9;22) Rearrangement|*Unspecified',
                        parameter_id: 'BCR/ABL t(9;22) Rearrangement|*Unspecified',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'BCR/ABL t(9;22)|*Unspecified',
                        parameter_id: 'BCR/ABL t(9;22)|*Unspecified',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'ISCN|*Unspecified',
                        parameter_id: 'ISCN|*Unspecified',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Zika PCR QUANT|*Unspecified',
                        parameter_id: 'Zika PCR QUANT|*Unspecified',
                        return_type: 'value',
                    },
                ],
            });
        }
        if (value == 2) {
            return Promise.resolve({
                status: 200,
                data: [
                    {
                        parameter_name: 'PULSE OXIMETRY|1',
                        parameter_id: 'PULSE OXIMETRY|1',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'MAP|2',
                        parameter_id: 'MAP|2',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Respiratory rate|3',
                        parameter_id: 'Respiratory rate|3',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Temperature|4',
                        parameter_id: 'Temperature|4',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'O2 saturation|5',
                        parameter_id: 'O2 saturation|5',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Blood Pressure|6',
                        parameter_id: 'Blood Pressure|6',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Heart Rate|7',
                        parameter_id: 'Heart Rate|7',
                        return_type: 'value',
                    },
                ],
            });
        }
        if (value == 3) {
            return Promise.resolve({
                status: 200,
                data: [
                    {
                        parameter_name:
                            'ACETAMINOPHEN-CODEINE #2 300-15 MG PO TABS|65991002050310',
                        parameter_id:
                            'ACETAMINOPHEN-CODEINE #2 300-15 MG PO TABS|65991002050310',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'THSC AMOXICILLIN 250 MG PO CAPS|1200010100105',
                        parameter_id: 'THSC AMOXICILLIN 250 MG PO CAPS|1200010100105',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'SURGICAL DEPILATORIES EX CREA|90748510003700',
                        parameter_id: 'SURGICAL DEPILATORIES EX CREA|90748510003700',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            'ADEN-INOS-NA PYRU-NAPH-NAPHDIB VI SOLN|85278005202020',
                        parameter_id:
                            'ADEN-INOS-NA PYRU-NAPH-NAPHDIB VI SOLN|85278005202020',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            'SODIUM CITRATE DIHYDRATE 2.2 % VI SOLN|83400080102011',
                        parameter_id:
                            'SODIUM CITRATE DIHYDRATE 2.2 % VI SOLN|83400080102011',
                        return_type: 'value',
                    },
                ],
            });
        }
        if (value == 4) {
            return Promise.resolve({
                status: 200,
                data: [
                    {
                        parameter_name: 'RESPIRATORY|76895',
                        parameter_id: 'RESPIRATORY|76895',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'ULTRASOUND B|79108',
                        parameter_id: 'ULTRASOUND B|79108',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'ULTRASOUND B|79111',
                        parameter_id: 'ULTRASOUND B|79111',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'BREAST TOMOS|79112',
                        parameter_id: 'BREAST TOMOS|79112',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'BREAST TOMOS|79114',
                        parameter_id: 'BREAST TOMOS|79114',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'BREAST TOMOS|79115',
                        parameter_id: 'BREAST TOMOS|79115',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'DXA BONE DEN|79117',
                        parameter_id: 'DXA BONE DEN|79117',
                        return_type: 'value',
                    },
                ],
            });
        }
        if (value == 5) {
            return Promise.resolve({
                status: 200,
                data: [
                    {
                        parameter_name: 'Inpatient',
                        parameter_id: 'Inpatient|1',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Discharged',
                        parameter_id: 'Discharged|2',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Outpatient visit',
                        parameter_id: 'Outpatient visit|3',
                        return_type: 'value',
                    },
                ],
            });
        }
        if (value == 6) {
            return Promise.resolve({
                status: 200,
                data: [
                    {
                        parameter_name: 'Inpatient',
                        parameter_id: 'Inpatient|1',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Discharged',
                        parameter_id: 'Discharged|2',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Outpatient visit',
                        parameter_id: 'Outpatient visit|3',
                        return_type: 'value',
                    },
                ],
            });
        }
        if (value == 7) {
            return Promise.resolve({
                status: 200,
                data: [
                    {
                        parameter_name:
                            '1007-4:DIRECT ANTIGLOBULIN TEST.POLY SPECIFIC REAGENT:ACNC:PT:RBC:ORD|1007-4',
                        parameter_id:
                            '1007-4:DIRECT ANTIGLOBULIN TEST.POLY SPECIFIC REAGENT:ACNC:PT:RBC:ORD|1007-4',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            'S WAVE DURATION.LEAD II:TIME:PT:HEART:QN:EKG|10074-3',
                        parameter_id:
                            'S WAVE DURATION.LEAD II:TIME:PT:HEART:QN:EKG|10074-3',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            'S WAVE DURATION.LEAD III:TIME:PT:HEART:QN:EKG|10075-0',
                        parameter_id:
                            'S WAVE DURATION.LEAD III:TIME:PT:HEART:QN:EKG|10075-0',
                        return_type: 'value',
                    },
                    {
                        parameter_name:
                            'S WAVE DURATION.LEAD V1:TIME:PT:HEART:QN:EKG|10076-8',
                        parameter_id:
                            'S WAVE DURATION.LEAD V1:TIME:PT:HEART:QN:EKG|10076-8',
                        return_type: 'value',
                    },
                ],
            });
        }
    },

    patientBeforeAfterList: () => {
        return Promise.resolve({
            status: 200,
            data: [
                {
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
                },
                {
                    paramCount: 1,
                    baa_id: 2,
                    baa_name: 'Medication + Medication ',
                    baa_user_id: 1,
                    baa_created_timestamp: '2019-06-11T14:28:05.000Z',
                    baa_intervention_timestamp: '2019-06-11T14:28:05.000Z',
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
                },
            ],
        });
    },

    getVariableRange: param => {
        if (param == 1 || param == 2) {
            return Promise.resolve({
                status: 200,
                data: [
                    {
                        parameter_name: 'Retrieve all values',
                        parameter_id: 'Retrieve all values|1',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Highest',
                        parameter_id: 'Highest|2',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Lowest',
                        parameter_id: 'Lowest|3',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Mean',
                        parameter_id: 'Mean|4',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'Median',
                        parameter_id: 'Median|5',
                        return_type: 'value',
                    },
                ],
            });
        }

        if (param == 3) {
            return Promise.resolve({
                status: 200,
                data: [
                    {
                        parameter_name: 'Was medication given',
                        parameter_id: 'Was medication given|7',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'How much was given',
                        parameter_id: 'How much was given|8',
                        return_type: 'value',
                    },
                ],
            });
        }

        if (param == 4) {
            return Promise.resolve({
                status: 200,
                data: [
                    {
                        parameter_name: 'Was medication given',
                        parameter_id: 'Was medication given|7',
                        return_type: 'value',
                    },
                    {
                        parameter_name: 'How much was given',
                        parameter_id: 'How much was given|8',
                        return_type: 'value',
                    },
                ],
            });
        }
    },
};

module.exports = index;

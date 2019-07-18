import React from 'react';

const Patients = ({ patients }) => {
  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <h3 className="text-center p15">Patient List</h3>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-striped table-bordered table-hover table-sm">
            <thead>
              <tr>
                <th>Patient Id</th>
                <th>Preferred Name</th>
                <th>Age</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {patients.map(patient => (
                <tr>
                  <td>{patient.Patient_id}</td>
                  <td>{patient.PreferredName}</td>
                  <td>{patient.Age}</td>
                  <td>
                    <a
                      href="#!"
                      className="btn btn-indigo btn-sm waves-effect waves-light"
                    >
                      View
                    </a>
                    &nbsp;
                    <a
                      href="#!"
                      className="btn btn-indigo btn-sm waves-effect waves-light"
                    >
                      Edit
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    /**/
  );
};

export default Patients;

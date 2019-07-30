import React from 'react';
import { MDBRow, MDBCol, MDBCardBody } from 'mdbreact';

const DatatableNoData = ({ msg, columns }) => {
  var columnCount = columns.length;
  return (
    <MDBCardBody>
      <MDBRow>
        <MDBCol size="12" lg="12">
          <table className="table table-striped table-bordered table-hover table-sm">
            <thead>
              <tr>
                {columns.map(column => (
                  <th>{column.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={columnCount}>
                  <p className="text-center text-bold">{msg}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </MDBCol>
      </MDBRow>
    </MDBCardBody>
  );
};

const DatatableLoading = ({ msg = 'Processing...' }) => {
  return (
    <p className="text-center pT15">
      {msg} <i className="fa fa-spinner fa-pulse fa-fw" />
    </p>
  );
};

export { DatatableNoData, DatatableLoading };

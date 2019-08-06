import React from 'react';
import { Route, Switch } from 'react-router-dom';
import {
  MDBEdgeHeader,
  MDBFreeBird,
  MDBCol,
  MDBRow,
  MDBCardBody,
} from 'mdbreact';

import FacilityPage from './pages/facilityPage';
import FacilityCreatePage from './pages/facilityCreatePage';
import FacilityEditPage from './pages/facilityEditPage';
import facilityAppointmentPage from './pages/facilityAppointmentPage';
import facilityDepartmentPage from './pages/facilityDepartmentPage';
import FacilitykitAcessPage from './pages/facilitykitAcessPage';
import FacilityKitListPage from './pages/facilityKitListPage';
import FacilitykitAcessEditPage from './pages/facilitykitAcessEditPage';
import Login from './pages/login';
import ChangePassword from './pages/changePassword';
import Welcome from './pages/welcome';
import UnauthorizedPage from './pages/unauthorizedPage';
import LogoutPage from './pages/logoutPage';

class Routes extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Welcome} />
        <Route exact path="/unauthorized" component={UnauthorizedPage} />
        <Route exact path="/master/login" component={Login} />
        <Route exact path="/facilityCreate" component={FacilityCreatePage} />
        <Route exact path="/FacilityPage" component={FacilityPage} />
        <Route exact path="/edit/:id" component={FacilityEditPage} />
        <Route exact path="/facilityAppointment/:id" component={facilityAppointmentPage} />
        <Route exact path="/facilityDepartment/:id" component={facilityDepartmentPage} />
        <Route exact path="/FacilitykitAcessPage/:id" component={FacilitykitAcessPage}/>
        <Route exact path="/facilityKitListPage" component={FacilityKitListPage}/>
        <Route exact path="/editkitAcess/:id" component={FacilitykitAcessEditPage}/>
        
        {/* <Route exact path="/patientScreening" component={PatientScreening} />
        <Route
          exact
          path="/PatientScreeningPage"
          component={PatientScreeningPage}
        />
        <Route
          exact
          path="/patientScreeningEdit/:id"
          component={PatientScreeningEdit}
        />
        <Route
          exact
          path="/before-after-analysis"
          component={BeforeAfterAnalysisList}
        />
        <Route
          exact
          path="/add-before-after-analysis"
          component={BeforeAfterAnalysisAdd}
        /> */}
        {/* <Route
          exact
          path="/edit-before-after-analysis/:id"
          component={BeforeAfterAnalysisEdit}
        />
        <Route exact path="/dailyquery" component={DailyQuery} />
        <Route exact path="/createdailyquery" component={CreateDailyQuery} />
        <Route exact path="/dailyqueryedit/:id" component={DailyQueryEdit} />
        <Route exact path="/PdqResult/:id" component={PdqResult} />
        <Route exact path="/add-chart-review" component={AddChartReview} />
        <Route exact path="/add-chart-review/:id" component={AddChartReview} />
        <Route
          exact
          path="/chart-review-report"
          component={ChartReviewReport}
        />
        <Route exact path="/add-gender" component={AddGender} />
        <Route exact path="/add-race" component={AddRace} />
        <Route
          exact
          path="/before-after-analysis/patient/:patient_id"
          component={BaaResult}
        /> */}
        <Route exact path="/change-password" component={ChangePassword} />
        <Route exact path="/logout" component={LogoutPage} />
        <Route
          render={function() {
            return (
              <div>
                <MDBEdgeHeader color="indigo darken-3" />
                <MDBFreeBird>
                  <MDBRow>
                    <MDBCol
                      md="10"
                      className="mx-auto float-none white z-depth-1 py-2 px-2"
                    >
                      <MDBCardBody>
                        <h2 className="h2-responsive mb-4 text-center">
                          <strong></strong>
                        </h2>
                      </MDBCardBody>
                      <MDBRow className="d-flex flex-row justify-content-center row">
                        <p className="pb-4 text-danger">
                          <i className="fa fa-exclamation-triangle fa-fw" />{' '}
                          Path not found.
                        </p>
                      </MDBRow>
                    </MDBCol>
                  </MDBRow>
                </MDBFreeBird>
              </div>
            );
          }}
        />
      </Switch>
    );
  }
}

export default Routes;

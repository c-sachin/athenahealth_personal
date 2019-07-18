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
import FacilityUserCreatePage from './pages/facilityUserCreatePage';
import FacilityUserPage from './pages/facilityUserPage';
import FacilityUserEditPage from './pages/facilityUserEditPage';
import FacilitykitAcessPage from './pages/facilitykitAcessPage';
import FacilityKitListPage from './pages/facilityKitListPage';
import FacilitykitAcessEditPage from './pages/facilitykitAcessEditPage';
import PatientScreening from './pages/patientScreening';
import Login from './pages/login';
import ChangePassword from './pages/changePassword';
import PatientScreeningPage from './pages/patientScreeningPage';
import Welcome from './pages/welcome';
import UnauthorizedPage from './pages/unauthorizedPage';
import LogoutPage from './pages/logoutPage';
import PatientScreeningEdit from './pages/patientScreeningEdit';
import DailyQuery from './pages/dailyQuery';
import CreateDailyQuery from './pages/createDailyQuery';
import DailyQueryEdit from './pages/dailyQueryEdit';
import BeforeAfterAnalysisList from './pages/beforeAfterAnalysisList';
import BeforeAfterAnalysisAdd from './pages/beforeAfterAnalysisAdd';
import BeforeAfterAnalysisEdit from './pages/beforeAfterAnalysisEdit';
import PdqResult from './pages/pdqResult';
import BaaResult from './pages/baaResult';
import AddChartReview from './pages/addChartReview';
import ChartReviewReport from './pages/chartReviewReport';
import AddGender from './pages/addGender';
import AddRace from './pages/addRace';
import Gender from './pages/genderList';
import GenderEdit from './pages/genderEdit';
import GenderCreate from './pages/genderCreate';
import MaritalStatusAdd from './pages/maritalStatusCreate';
import MaritalStatusEdit from './pages/maritalStatusEdit';
import MaritalStatus from './pages/maritalStatusList';
import RaceList from './pages/raceList';
import RaceCreate from './pages/raceCreate';
import RaceEdit from './pages/raceEdit';
import ImagingList from './pages/imagingList';
import ImagingEdit from './pages/imagingEdit';
import ImagingCreate from './pages/imagingCreate';

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
        <Route
          exact
          path="/facilityUserCreate/:id"
          component={FacilityUserCreatePage}
        />
        <Route
          exact
          path="/facilityuseredit/:facility_id/:facility_user_id"
          component={FacilityUserEditPage}
        />
        <Route exact path="/facilityUser/:id" component={FacilityUserPage} />
        <Route
          exact
          path="/FacilitykitAcessPage/:id"
          component={FacilitykitAcessPage}
        />
        <Route
          exact
          path="/facilityKitListPage"
          component={FacilityKitListPage}
        />
        <Route
          exact
          path="/editkitAcess/:id"
          component={FacilitykitAcessEditPage}
        />
        <Route exact path="/patientScreening" component={PatientScreening} />
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
        />
        <Route
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
        />
        <Route exact path="/change-password" component={ChangePassword} />
        <Route exact path="/logout" component={LogoutPage} />
        <Route exact path="/gender" component={Gender} />
        <Route exact path="/editGender/:id" component={GenderEdit} />
        <Route exact path="/createGender" component={GenderCreate} />
        <Route exact path="/editGender/:id" component={GenderEdit} />
        <Route exact path="/createGender" component={GenderCreate} />
        <Route exact path="/marital-status" component={MaritalStatus} />
        <Route exact path="/marital-status-add" component={MaritalStatusAdd} />
        <Route
          exact
          path="/marital-status-edit/:id"
          component={MaritalStatusEdit}
        />
        <Route exact path="/race" component={RaceList} />
        <Route exact path="/race-add" component={RaceCreate} />
        <Route exact path="/editRace/:id" component={RaceEdit} />
        <Route exact path="/imaging" component={ImagingList} />
        <Route exact path="/editImaging/:id" component={ImagingEdit} />
        <Route exact path="/createImaging" component={ImagingCreate} />

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
                          <strong>AGORA Healthcare</strong>
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

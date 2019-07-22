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
        <Route exact path="/facilityUserCreate/:id" component={FacilityUserCreatePage}
        />
        <Route exact path="/facilityuseredit/:facility_id/:facility_user_id" component={FacilityUserEditPage}
        />
        <Route exact path="/facilityUser/:id" component={FacilityUserPage} />
        <Route exact path="/FacilitykitAcessPage/:id" component={FacilitykitAcessPage}
        />
        <Route exact path="/facilityKitListPage" component={FacilityKitListPage}
        />
        <Route exact path="/editkitAcess/:id" component={FacilitykitAcessEditPage}
        />
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

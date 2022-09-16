import { PilotArea, PilotRoute } from './dist';
import * as HomePage from './pages';
import * as DashboardPage from './pages/dashboard';

export default function App() {
  return (
		<PilotArea>
			<PilotRoute path={'/'} component={HomePage.default} default={true}/>
			<PilotRoute path={'/dashboard'} component={DashboardPage.default}/>
		</PilotArea>
  );
}

import { combineReducers } from 'redux';
import widgets from './widgets.reducer';
import widgets1 from './widgets1.reducer';
import projects from './projects.reducer';

const reducer = combineReducers({
    widgets,
    projects,
    widgets1
});

export default reducer;

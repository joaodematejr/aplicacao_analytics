import { combineReducers } from 'redux';
import widgets from './widgets.reducer';
import widgets1 from './widgets1.reducer';
import widgets11 from './widgets11.reducer';
import projects from './projects.reducer';

const reducer = combineReducers({
    widgets,
    projects,
    widgets1,
    widgets11
});

export default reducer;

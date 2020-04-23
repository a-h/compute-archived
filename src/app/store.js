import { configureStore } from '@reduxjs/toolkit';
import questionnaireReducer from '../features/questionnaire/questionnaireSlice';

export default configureStore({
  reducer: {
    questionnaire: questionnaireReducer,
  },
});

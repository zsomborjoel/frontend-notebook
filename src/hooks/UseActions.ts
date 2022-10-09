import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state';

// Helper hook for cleaner code
export const useActions = (): any => {
    const dispatch = useDispatch();

    return useMemo(() => bindActionCreators(actionCreators, dispatch), [dispatch]);
};

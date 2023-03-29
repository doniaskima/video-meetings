import {useReducer , useCallback } from "react";

const reducer = (previousState ={} , updateState={})=>{
    return {...previousState , ...updateState} ;
};

const useUseState = (initialState={})=>{
    const [state , dispatch] = useReducer(reducer , initialState);

    const setState = useCallback(
        (updateState)=>{
            dispatch(updateState)
        },
        [dispatch]
    );
    return [state , setState]
}

export default  useUseState ;
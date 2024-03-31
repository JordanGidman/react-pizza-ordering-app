import { getAddress } from '../../services/apiGeocoding';

function getPosition() {
    return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

//createAsyncThunk needs 2 things to work the action name and an async function that will return the payload for the reducer later. This must return a promise hence the async function.
//this will produce 3 additional action types for pending fulfilled and rejected which we then handle in our reducers.
export const fetchAddress = createAsyncThunk(
    `user/fetchAddress`,
    async function () {
        // 1) We get the user's geolocation position
        const positionObj = await getPosition();
        const position = {
            latitude: positionObj.coords.latitude,
            longitude: positionObj.coords.longitude,
        };

        // 2) Then we use a reverse geocoding API to get a description of the user's address, so we can display it the order form, so that the user can correct it if wrong
        const addressObj = await getAddress(position);
        const address = `${addressObj?.locality}, ${addressObj?.city} ${addressObj?.postcode}, ${addressObj?.countryName}`;

        // 3) Then we return an object with the data that we are interested in
        return { position, address };
    }
);

const initialState = {
    username: '',
    status: 'idle',
    position: {},
    address: '',
    error: '',
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateName(state, action) {
            state.username = action.payload;
        },
    },
    //we need to use extra reducers to handle our async thunk
    extraReducers: (builder) =>
        builder
            .addCase(fetchAddress.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchAddress.fulfilled, (state, action) => {
                state.position = action.payload.position;
                state.address = action.payload.address;
                state.status = 'idle';
            })
            .addCase(fetchAddress.rejected, (state, action) => {
                state.status = 'error';
                state.error =
                    'Your Geolocation services may be turned off. Please fill the address in manually.';
            }),
});

export const { updateName } = userSlice.actions;
export default userSlice.reducer;

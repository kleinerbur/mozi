import './App.css';

import * as React from 'react';

import FilmsTable from './FilmsTable';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Backdrop, CircularProgress } from '@mui/material';
import dayjs from 'dayjs';

const port = 2525;

function App() {
    const today = new Date();
    const [date, setDate] = React.useState(new Date());
    const [films, setFilms] = React.useState([])
    const [showings, setShowings] = React.useState([]);
    const [backdrop, enableBackdrop] = React.useState(false);

    function handleDateChange(date) {
        setDate(date);
        setFilms([]);
        setShowings([]);
    };

    React.useEffect(() => {
        async function fetchData() {
            enableBackdrop(true);
            let data = await fetch(`http://localhost:${port}/date/${date.toISOString().split('T')[0]}`).then(response => response.json())
            setFilms(data.films);
            setShowings(data.showings);
            enableBackdrop(false);
        }
        fetchData();
    }, [date]);

    return (
    <div className="App">
        <div className="App-header">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker className='datePicker'
                    value={dayjs(date)}
                    minDate={dayjs(today)}
                    format="YYYY-MM-DD"
                    formatDensity="spacious"
                    onChange={(newValue) => handleDateChange(newValue)}/>
            </LocalizationProvider>
        </div>
        <div className="App-body">
            <Backdrop open={backdrop}>
                <CircularProgress color="inherit" size="5em"/>
            </Backdrop>
            <FilmsTable films={films} showings={showings}/>
        </div>
    </div>
    );
}

export default App;
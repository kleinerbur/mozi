import * as React from 'react';
import FilmRow from "./FilmRow";

import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';

function FilmsTable(props) {
    const {films, showings} = props;
    return(
        <React.Fragment>
            <TableContainer>
                <Table className='mainTable' align='center'>
                    <TableBody>
                        {films.map(film =>
                            <FilmRow film={film} showings={showings.filter(showing => film === showing.title)} key={film}/>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </React.Fragment>
    )
}

export default FilmsTable;
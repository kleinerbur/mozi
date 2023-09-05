import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import Looks3Icon from '@mui/icons-material/Looks3';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import SubtitlesOffIcon from '@mui/icons-material/SubtitlesOff';
import SubtitlesIcon from '@mui/icons-material/Subtitles';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';

function FilmRow(props) {
    const {film, showings} = props;
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment key="rowContainer">
            <TableRow className={open ? 'selectedRow' : 'filmTitleRow'} onClick={() => setOpen(!open)}>
                <TableCell width='1%' align='center'>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        disabled
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    <Typography className='title'>{film}</Typography>
                </TableCell>
            </TableRow>
            <TableRow className="subTableContainer">
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box>
                            <Table className='subTable' width='100%' size="small" aria-label="purchases">
                                <TableHead className='tableHead'>
                                    <TableRow className='tableRow'>
                                        <TableCell align='center'><p>Időpont</p></TableCell>
                                        <TableCell align='center'><p>Mozi</p></TableCell>
                                        <TableCell align='center'><p>Terem</p></TableCell>
                                        <TableCell align='center'><p>Előadástípus</p></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {showings.map((showing) => (
                                    <TableRow className='showingRow' key={showing.bookingLink}>
                                        <TableCell align='center'>
                                            {new Date(showing.startTime).getTime() > new Date().getTime()
                                                ? <a href={showing.bookingLink}>
                                                    <p>
                                                        {new Date(showing.startTime).toTimeString().substring(0,5).trim()/* HH:MM */}
                                                    </p>
                                                </a>
                                                : <p className='obsolete'>
                                                    {new Date(showing.startTime).toTimeString().substring(0,5).trim()/* HH:MM */}
                                                </p>
                                            }
                                        </TableCell>
                                        <TableCell align='center'>
                                            {showing.cinema}
                                        </TableCell>
                                        <TableCell align='center'>
                                            {showing.auditorium}
                                        </TableCell>
                                        <TableCell align='center'>
                                            {showing.is3d
                                                ? <Tooltip title='3D'><Looks3Icon color='error'/></Tooltip>
                                                : <Tooltip title='2D'><LooksTwoIcon/></Tooltip>
                                            }
                                            {showing.isSubbed
                                                ? <Tooltip title='Feliratos'><SubtitlesIcon/></Tooltip>
                                                : showing.isDubbed
                                                    ? <Tooltip title='Szinkronizált / magyarul beszélő'><RecordVoiceOverIcon/></Tooltip>
                                                    : <Tooltip title='Eredeti verzió (felirat nélkül)'><SubtitlesOffIcon/></Tooltip>
                                            }
                                        </TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    )
}

export default FilmRow;
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Avatar, Divider, Grid, Link, List, ListItemAvatar, ListItemButton, TextField, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useCallback } from 'react';
import ResultNotFound from './ResultNotFound';
import ServerError from './ServerError';
import ListItemTextWithHighlightedText from './ListItemTextWithHighlightedText';
import SearchIcon from '@mui/icons-material/Search';

const throwMandatoryAttributeError = (name, value) => {
    if (!value)
        throw new Error(`${name} is a mandatory attribute for HSSearchPage`)
}

export default function SearchBar({
    indexId,
    apiKey,
    onTypeSearch,
    targetURL,
    iconURL,
    secondaryText,
    primaryText,
}) {
    // throw error
    throwMandatoryAttributeError("indexId", indexId);
    throwMandatoryAttributeError("apiKey", apiKey);
    throwMandatoryAttributeError("targetURL", targetURL);
    throwMandatoryAttributeError("primaryText", primaryText);

    // UseState
    const [isOpen, setIsOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchResultDocuments, setSearchResultDocuments] = useState([]);
    const [isSearchServerFailed, setIsSearchServerFailed] = useState(false);

    const handleClickOpen = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    function debounce(callback, timeout) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                callback.apply(this, args);
            }, timeout);
        };
    }

    const handleSearchJsonData = (searchText) => {
        const simpleSearchEndpoint = searchText
            ? `https://${indexId}.hoppysearch.com/v1/search?q=${searchText}`
            : `https://${indexId}.hoppysearch.com/v1/search`;

        axios.get(simpleSearchEndpoint, {
            headers: {
                'Authorization': apiKey
            }
        }
        ).then((response) => {
            if (response?.data?.documents) {
                setSearchResultDocuments(response?.data?.documents)
            } else {
                setSearchResultDocuments([])
            }
        }).catch((err) => {
            console.log(err)
            setIsSearchServerFailed(true)
        })
    }

    // useCallback
    const handleSearchJsonDataOnType = useCallback(
        debounce((searchText) => handleSearchJsonData(searchText), 500),
        []
    );

    // useEffect
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.ctrlKey && event.key === 'k') {
                event.preventDefault();
                setIsOpen(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        handleSearchJsonData(searchText);
    },[])


    return (
        <React.Fragment>
            <Button
                variant="outlined"
                onClick={handleClickOpen}
                startIcon={<SearchIcon />}
            >
                Search...
                <div
                    style={{
                        padding: '3px',
                        color: "#000000",
                        marginLeft: "50px",
                        border: '1px solid #757575',
                        borderRadius: '5px',
                    }}
                ><Typography variant='body2'>ctrl+k</Typography></div>
            </Button>
            <Dialog
                open={isOpen}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        width: "100%",
                        minWidth: "520px!important",
                    },
                }}
            >
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    <Grid
                        container
                        spacing={1}
                        sx={{
                            backgroundColor: "#ffffff",
                            width: "93%",
                        }}
                    >
                        <Grid item xs={12} md={11}>
                            {onTypeSearch ?
                                <TextField
                                    id="outlined-full-width"
                                    label="Search"
                                    placeholder="Search"
                                    fullWidth
                                    margin="normal"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            handleSearchJsonData(event.target.value);
                                        }
                                    }}
                                    onKeyUp={(event) => handleSearchJsonDataOnType(event.target.value)}
                                /> :
                                <TextField
                                    id="outlined-full-width"
                                    label="Search"
                                    placeholder="Search"
                                    fullWidth
                                    margin="normal"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            handleSearchJsonData(event.target.value);
                                        }
                                    }}
                                />
                            }
                        </Grid>
                        <Grid item xs={12} md={1}>
                            <Button
                                variant="outlined"
                                style={{
                                    color: '#673ab7',
                                    height: 55,
                                    width: 80,
                                    borderColor:
                                        '#673ab7',
                                    marginTop: 17
                                }}
                                onClick={() => handleSearchJsonData(searchText)}
                            >
                                <SearchIcon></SearchIcon>
                            </Button>
                        </Grid>
                    </Grid>
                </DialogTitle>
                <DialogContent>
                    <Grid item xs={12}>
                        {isSearchServerFailed ? <ServerError /> :
                            <List sx={{ width: '100%' }}>
                                {(searchResultDocuments.length) === 0 && <ResultNotFound searchText={searchText} />}
                                {
                                    searchResultDocuments.map((document, index) => <React.Fragment key={index}>
                                        <ListItemButton
                                            component={Link}
                                            href={document?.[targetURL]}
                                            sx={{
                                                '&:hover': {
                                                    border: '2px solid #2196f3',
                                                    borderRadius: '4px',
                                                    boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                                                    backgroundColor: '#e3f2fd',
                                                    cursor: 'pointer'
                                                },
                                            }}
                                        >
                                            {iconURL && <ListItemAvatar>
                                                <Avatar alt={document?.[primaryText]} src={document?.[iconURL]} />
                                            </ListItemAvatar>}
                                            <ListItemTextWithHighlightedText
                                                primary={document?.[primaryText]}
                                                secondary={secondaryText ? document?.[secondaryText] : ""}
                                                highlightedWords={searchText.toLowerCase().split(" ")}
                                            />
                                        </ListItemButton >
                                        <Divider />
                                    </React.Fragment>)
                                }
                            </List>}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

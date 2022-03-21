import React, { useCallback, useRef, useState } from 'react';
import MUIAutocomplete from '@mui/material/Autocomplete';
import MUICircularProgress from '@mui/material/CircularProgress';
import MUISearchIcon from '@mui/icons-material/Search';
import MUITextField from '@mui/material/TextField';
import MUITypography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router';

import theme from '../../theme';
import useRequest from '../../hooks/request-hook';
import Avatar from '../miscellaneous/Avatar';

const useStyles = makeStyles({
  input: {
    margin: 8,
    minWidth: 300,
    width: 'calc(100% - 16px)',
    '& input[type=text]': {
      color: '#ffffff'
    }
  },
  option: {
    alignItems: 'flex-end',
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'space-between'
  },
  search: {
    [theme.breakpoints.up('md')]: {
      flexGrow: 1
    },
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    borderRadius: theme.shape.borderRadius,
    position: 'relative',
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25)
    }
  }
});

export default function SiteSearchBar({ color, setDrawerOpen }) {
  const searchInput = useRef();
  const { loading, sendRequest } = useRequest();
  const [searchResults, setSearchResults] = useState([]);
  const [timer, setTimer] = useState();
  const classes = useStyles();
  const navigate = useNavigate();

  const searchSite = useCallback(
    (event) => {
      event.persist();
      setTimer(
        setTimeout(async function () {
          if (event.target.value.length < 2) {
            setSearchResults([]);
          } else {
            await sendRequest({
              callback: setSearchResults,
              load: true,
              operation: 'searchSite',
              get body() {
                // https://www.rakeshjesadiya.com/graphql-fields-conflict-return-conflicting-types-use-different-aliases-on-the-fields/
                return {
                  query: `
                    query {
                      ${this.operation}(search: "${event.target.value}") {
                        ... on Document {
                          _id
                          __typename
                        }
                        ... on AccountType {
                          avatar {
                            card_faces {
                              image_uris {
                                art_crop
                              }
                            }
                            image_uris {
                              art_crop
                            }
                          }
                          name
                        }
                        ... on BlogPostType {
                          stringImage: image
                          title
                          subtitle
                        }
                        ... on CubeType {
                          creator {
                            _id
                            avatar {
                              card_faces {
                                image_uris {
                                  art_crop
                                }
                              }
                              image_uris {
                                art_crop
                              }
                            }
                            name
                          }
                          cardImage: image {
                            _id
                            image_uris {
                              art_crop
                            }
                            name
                            card_faces {
                              image_uris {
                                art_crop
                              }
                              name
                            }
                          }
                          name
                        }
                        ... on DeckType {
                          creator {
                            _id
                            avatar {
                              card_faces {
                                image_uris {
                                  art_crop
                                }
                              }
                              image_uris {
                                art_crop
                              }
                            }
                            name
                          }
                          cardImage: image {
                            _id
                            image_uris {
                              art_crop
                            }
                            name
                            card_faces {
                              image_uris {
                                art_crop
                              }
                              name
                            }
                          }
                          name
                        }
                        ... on EventType {
                          createdAt
                          host {
                            _id
                            avatar {
                              card_faces {
                                image_uris {
                                  art_crop
                                }
                              }
                              image_uris {
                                art_crop
                              }
                            }
                            name
                          }
                          name
                        }
                      }
                    }
                  `
                };
              }
            });
          }
        }, 250)
      );
    },
    [sendRequest]
  );

  return (
    <MUIAutocomplete
      className={classes.search}
      clearOnBlur={false}
      clearOnEscape={true}
      getOptionLabel={(option) => {
        if (option.__typename === 'AccountType') return option.name;
        if (option.__typename === 'BlogPostType') return option.title;
        if (option.__typename === 'CubeType') return option.name;
        if (option.__typename === 'DeckType') return option.name;
        if (option.__typename === 'EventType') return option.name;
      }}
      loading={loading}
      onChange={function (event, value, reason) {
        if (reason === 'selectOption') {
          if (value.__typename === 'AccountType') {
            navigate(`/account/${value._id}`);
          }
          if (value.__typename === 'BlogPostType') {
            navigate(`/blog/${value._id}`);
          }
          if (value.__typename === 'CubeType') {
            navigate(`/cube/${value._id}`);
          }
          if (value.__typename === 'DeckType') {
            navigate(`/deck/${value._id}`);
          }
          if (value.__typename === 'EventType') {
            navigate(`/event/${value._id}`);
          }
          setTimeout(() => {
            searchInput.current.parentElement
              .getElementsByClassName('MuiAutocomplete-clearIndicator')[0]
              .click();
            setSearchResults([]);
            setDrawerOpen(false);
          }, 0);
        }
      }}
      options={searchResults}
      renderInput={(params) => (
        <MUITextField
          {...params}
          className={classes.input}
          color={color}
          inputRef={searchInput}
          onKeyUp={(event) => {
            clearTimeout(timer);
            searchSite(event);
          }}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading && <MUICircularProgress color="inherit" size={20} />}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
            startAdornment: <MUISearchIcon style={{ color: 'white' }} />
          }}
        />
      )}
      renderOption={(props, option) => {
        return (
          <React.Fragment key={option._id}>
            {option.__typename === 'AccountType' && (
              <li {...props}>
                <span className={classes.option}>
                  <Avatar alt={option.name} size="small" src={option.avatar} />
                  <span style={{ textAlign: 'right' }}>
                    <MUITypography variant="body1" style={{ fontWeight: 700 }}>
                      User
                    </MUITypography>
                    <MUITypography variant="body1">{option.name}</MUITypography>
                  </span>
                </span>
              </li>
            )}

            {option.__typename === 'BlogPostType' && (
              <li {...props}>
                <span className={classes.option}>
                  <img
                    alt={option.subtitle}
                    // src={option.image}
                    src={option.stringImage}
                    style={{ borderRadius: 4 }}
                    width={75}
                  />
                  <span style={{ textAlign: 'right' }}>
                    <MUITypography variant="body1" style={{ fontWeight: 700 }}>
                      Blog Post
                    </MUITypography>
                    <MUITypography variant="body1">{option.title}</MUITypography>
                  </span>
                </span>
              </li>
            )}

            {option.__typename === 'CubeType' && (
              <li {...props}>
                <span className={classes.option}>
                  {
                    /* option.image */ option.cardImage && (
                      <img
                        // alt={
                        //   option.image.image_uris
                        //     ? option.image.name
                        //     : option.image.card_faces[0].name
                        // }
                        // src={
                        //   option.image.image_uris
                        //     ? option.image.image_uris.art_crop
                        //     : option.image.card_faces[0].image_uris.art_crop
                        // }
                        alt={
                          option.cardImage.image_uris
                            ? option.cardImage.name
                            : option.cardImage.card_faces[0].name
                        }
                        src={
                          option.cardImage.image_uris?.art_crop ??
                          option.cardImage.card_faces[0].image_uris.art_crop
                        }
                        style={{ borderRadius: 4 }}
                        width={75}
                      />
                    )
                  }
                  <span style={{ textAlign: 'right' }}>
                    <MUITypography variant="body1" style={{ fontWeight: 700 }}>
                      Cube
                    </MUITypography>
                    <MUITypography variant="body1">{option.name}</MUITypography>
                  </span>
                </span>
              </li>
            )}

            {option.__typename === 'DeckType' && (
              <li {...props}>
                <span className={classes.option}>
                  {option.cardImage && (
                    <img
                      alt={
                        option.cardImage.image_uris
                          ? option.cardImage.name
                          : option.cardImage.card_faces[0].name
                      }
                      src={
                        option.cardImage.image_uris?.art_crop ??
                        option.cardImage.card_faces[0].image_uris.art_crop
                      }
                      style={{ borderRadius: 4 }}
                      width={75}
                    />
                  )}
                  <span style={{ textAlign: 'right' }}>
                    <MUITypography variant="body1" style={{ fontWeight: 700 }}>
                      Deck
                    </MUITypography>
                    <MUITypography variant="body1">{option.name}</MUITypography>
                  </span>
                </span>
              </li>
            )}

            {option.__typename === 'EventType' && (
              <li {...props}>
                <span className={classes.option}>
                  <div></div>
                  <span style={{ textAlign: 'right' }}>
                    <MUITypography variant="body1" style={{ fontWeight: 700 }}>
                      Event
                    </MUITypography>
                    <MUITypography variant="body1">{option.name}</MUITypography>
                  </span>
                </span>
              </li>
            )}
          </React.Fragment>
        );
      }}
    />
  );
}

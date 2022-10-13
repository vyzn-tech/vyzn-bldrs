import React from 'react'
import {makeStyles, useTheme} from '@mui/styles'


/**
 * @param {Function} onClick function triggered when logo is cliked
 * @return {object} React component
 */
export default function Logo({onClick}) {
  const classes = useStyles(useTheme())
  return (
    <div className={classes.logoGroup}>
      {
        // vyzn customization:
        // Hide the issues control.
      }
      Powered by <a href="https://bldrs.ai/">BLDRS</a>
    </div>
  )
}


const useStyles = makeStyles((theme) => ({
  logoGroup: {
    'position': 'fixed',
    // vyzn customization:
    // Move to the bottom since there is no issues control anymore.
    'bottom': '20px',
    'left': '12px',
    '& svg': {
      'width': '50px',
      '@media (max-width: 900px)': {
        width: '50px',
      },
      '& .left-face': {
        fill: theme.palette.primary.light,
      },
      '& .right-face': {
        fill: theme.palette.primary.dark,
      },
      '& .edges': {
        stroke: theme.palette.primary.contrastText,
      },
    },
  },
}))

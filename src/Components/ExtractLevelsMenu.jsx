
import React, {useState, useEffect} from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import {makeStyles} from '@mui/styles'
import {TooltipIconButton} from './Buttons'
import useStore from '../store/useStore'
import {getModelCenter} from '../utils/cutPlane'
import {addHashParams, getHashParams} from '../utils/location'
import {Vector3} from 'three'
import {useLocation} from 'react-router-dom'
import {removePlanes} from '../utils/cutPlane'
import LevelsIcon from '../assets/2D_Icons/Levels.svg'

/**
 * BasicMenu used when there are several option behind UI button
 * show/hide from the right of the screen.
 * @param {Array} listOfOptions Title for the drawer
 * @return {Object} ItemPropertiesDrawer react component
 */
export default function ExtractLevelsMenu({listOfOptions, icon, title}) {
  const [anchorEl, setAnchorEl] = useState(null)
  const classes = useStyles()
  const open = Boolean(anchorEl)
  const model = useStore((state) => state.modelStore)
  const PLANE_PREFIX = 'p'
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const viewer = useStore((state) => state.viewerStore)
  const location = useLocation()
  const farInt = 1000
  const createFloorplanPlane = (h1, h2) => {
    removePlanes(viewer)
    const modelCenter1 = new Vector3(farInt, h1, farInt)
    const modelCenter2 = new Vector3(farInt, h2, farInt)
    const normal1 = new Vector3(0, 1, 0)
    const normal2 = new Vector3(0, -1, 0)
    viewer.clipper.createFromNormalAndCoplanarPoint(normal1, modelCenter1)
    viewer.clipper.createFromNormalAndCoplanarPoint(normal2, modelCenter2)
  }

  const createPlane = (normalDirection) => {
    const modelCenter = getModelCenter(model)
    const planeHash = getHashParams(location, 'p')
    console.log('in the function modelCenter', modelCenter)
    let normal
    switch (normalDirection) {
      case 'x':
        normal = new Vector3(1, 0, 0)
        break
      case 'y':
        normal = new Vector3(0, 1, 0)
        break
      case 'z':
        normal = new Vector3(0, 0, 1)
        break
      default:
        normal = new Vector3(0, 1, 0)
        break
    }
    console.log('in the function normal', normal)
    if (!planeHash || planeHash !== normalDirection ) {
      addHashParams(window.location, PLANE_PREFIX, {planeAxis: normalDirection})
    }
    return viewer.clipper.createFromNormalAndCoplanarPoint(normal, modelCenter)
  }
  useEffect(() => {
    const planeHash = getHashParams(location, 'p')
    if (planeHash && model && viewer) {
      const modelCenter = getModelCenter(model)
      const planeDirection = planeHash.split(':')[1]
      let normal
      switch (planeDirection) {
        case 'x':
          normal = new Vector3(1, 0, 0)
          break
        case 'y':
          normal = new Vector3(0, 1, 0)
          break
        case 'z':
          normal = new Vector3(0, 0, 1)
          break
        default:
          normal = new Vector3(0, 1, 0)
          break
      }
      console.log(' ------------------------- ')
      console.log('the modelCenter from the useEffect', modelCenter)
      console.log('plane direction', planeDirection)
      console.log('normal', normal)
      console.log(' ------------------------- ')
      createPlane(planeDirection)
      // viewer.clipper.createFromNormalAndCoplanarPoint(normal, modelCenter)
    }
  }, [model])

  let sampleHeights = []


  // PLACEHOLDER VALUES
  /* eslint-disable */
  const EISVOGEL = [
    -2.24, 0, 3.5,
    6.4, 9.5, 12.6,
    15.7, 18.8, 21.81,
    27.12,
  ]

  const sampleHeightsIndex = [0, 1, 2, 3, 4, 5, 6]
  /* eslint-enable */

  sampleHeights = EISVOGEL
  const floorplanMenu = []
  const planeoffset = 0.5
  sampleHeightsIndex.forEach((data) => {
    floorplanMenu.push(
        <MenuItem onClick={() => createFloorplanPlane(sampleHeights[data], sampleHeights[data + 1] - planeoffset)}>  L{data} </MenuItem>)
  })
  return (
    <div>
      <TooltipIconButton
        title={'Extract Levels'}
        icon={<LevelsIcon/>}
        onClick={handleClick}
      />
      <Menu
        elevation={1}
        id='basic-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
        transformOrigin={{vertical: 'top', horizontal: 'center'}}
        className={classes.root}
        PaperProps={{
          style: {
            left: '300px',
            transform: 'translateX(-40px) translateY(-40px)',
          },
        }}
      >
        {floorplanMenu}
      </Menu>
    </div>
  )
}


const useStyles = makeStyles({
  root: {
    '& .MuiMenu-root': {
      position: 'absolute',
      left: '-200px',
      top: '200px',
    },
  },
},
)

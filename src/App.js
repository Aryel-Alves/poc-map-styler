import React, {useState,useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { FacadeOL } from './utils/facade_openlayers.js';
import { request } from "./utils/requests"

const useStyles = makeStyles( theme => ({
  card: {
    position: "fixed",
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}))

export default function App() {
  const classes = useStyles()
  const [facadeOL, setFacadeOL] = useState(new FacadeOL());
  const [state, setState] = useState({
    sld_url: "http://ggt-des.ibge.gov.br/styles/ccar/capitals.sld",
    geojson_url: "http://ggt-des.ibge.gov.br/api/bcim/capitais",
  })
  
  useEffect(() => {
    setFacadeOL(new FacadeOL())
  }, [facadeOL.currentBaseLayerName]) 

  const handleSldUrlChange = event => {
    setState({...state, sld_url: event.target.value})
  }
  
  const handleGeoJsonUrlChange = event => {
    setState({...state, geojson_url: event.target.value})
  }

  async function findGeoJson(url){
    const response = await request(url)
    return response.data
  }

  const handleAddLayer = async () => {
    const GeoJson = await findGeoJson(state.geojson_url)
    let vectorLayer = await facadeOL.addVectorLayerFromGeoJSON(GeoJson)

    const resp = await request(state.sld_url)
    facadeOL.applySLDOnVectorLayer(vectorLayer,resp.data)
    
  }

  return (
    <div>
      <div id="map" style={{position: "fixed", width: "100%", height: "100%",  bottom: 0, zindex: 0 }}></div>

      <Card className={classes.card}>
        <CardContent>
          
          <TextField
            label="SLD URL"
            value={state.sld_url}
            className={classes.textField}
            onChange={handleSldUrlChange}
            margin="normal"
            variant="outlined"
          />

          <TextField
            label="GeoJson URL"
            value={state.geojson_url}
            className={classes.textField}
            onChange={handleGeoJsonUrlChange}
            margin="normal"
            variant="outlined"
          />

        </CardContent>
        <CardActions>
          <Button 
            variant="contained"
            color="primary" 
            size="small"
            onClick={handleAddLayer}
          >
            carregar
          </Button>
        </CardActions>
      </Card>
    </div>
  );
}

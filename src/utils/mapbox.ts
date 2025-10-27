import MapboxGL from '@rnmapbox/maps';

const MAPBOX_ACCESS_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN || 'YOUR_MAPBOX_TOKEN';

MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);

export default MapboxGL;

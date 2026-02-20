import type { AppDispatch } from '../index'
import { setTracks, setLoading, setError } from '../slices/tracksSlice'
import type { Track } from '../../types/music'

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null

export const fetchTracks = () => async (dispatch: AppDispatch) => {
  const fallbackTracks: Track[] = [
    { id: 1, name: 'Blinding Lights', artist: 'The Weeknd' },
    { id: 2, name: 'Shape of You', artist: 'Ed Sheeran' },
    { id: 3, name: 'Someone You Loved', artist: 'Lewis Capaldi' },
    { id: 4, name: 'Watermelon Sugar', artist: 'Harry Styles' },
    { id: 5, name: 'Bad Guy', artist: 'Billie Eilish' },
    { id: 6, name: 'Levitating', artist: 'Dua Lipa' },
    { id: 7, name: 'Good 4 U', artist: 'Olivia Rodrigo' },
    { id: 8, name: 'Stay', artist: 'The Kid LAROI & Justin Bieber' },
    { id: 9, name: 'Heat Waves', artist: 'Glass Animals' },
    { id: 10, name: 'As It Was', artist: 'Harry Styles' },
  ]


  try {
    dispatch(setLoading(true))

    const searchQueries = [
      { query: 'pop hits' },
      { query: 'rock' },
      { query: 'rap' },
      { query: 'rnb' },
      { query: 'chill' },
      { query: 'lofi' },
      { query: 'electronic' },
      { query: 'house' },
      { query: 'deep house' },
      { query: 'techno' },
      { query: 'indie' },
      { query: 'metal' },
      { query: 'jazz' },
      { query: 'blues' },
      { query: 'classical' },
      { query: 'soundtrack' },
      { query: 'gaming' },
      { query: 'ambient' },
      { query: 'dance' },
      { query: 'party' },
      { query: 'reggae' },
      { query: 'country' },
      { query: 'folk' },
      { query: 'punk' },
      { query: 'soul' },
      { query: 'funk' },
      { query: 'disco' },
      { query: 'trap' },
      { query: 'dubstep' },
      { query: 'trance' },
    ]
    
    
    const allTracksData: Track[] = []
    
    const rapidApiKey = import.meta.env.VITE_RAPIDAPI_KEY

    for (const { query } of searchQueries) {
      try {
        const term = query
        const url = `https://deezerdevs-deezer.p.rapidapi.com/search?q=${encodeURIComponent(term)}`
        
        const options: RequestInit = {
          method: 'GET',
          headers: {
            ...(rapidApiKey ? { 'x-rapidapi-key': rapidApiKey } : {}),
            'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com'
          }
        }

        const response = await fetch(url, options)
        
        if (!response.ok) {
          if (response.status === 429) {
            console.warn(`Rate limit for query: ${query}`)
            continue
          }
          console.warn(`Error fetching track "${query}": ${response.status}`)
          continue
        }

        const result: unknown = await response.json()
        const data = isRecord(result) ? result.data : undefined
        
        if (Array.isArray(data) && data.length > 0) {
          const tracksSlice = data.slice(0, 2)
          tracksSlice.forEach((item) => {
            if (!isRecord(item) || allTracksData.length >= 60) return

            const preview = typeof item.preview === 'string' ? item.preview : null
            if (!preview) return

            const id =
              typeof item.id === 'number' || typeof item.id === 'string'
                ? item.id
                : Math.random().toString()

            const name = typeof item.title === 'string' && item.title.trim() ? item.title : query

            const artist =
              isRecord(item.artist) && typeof item.artist.name === 'string' && item.artist.name.trim()
                ? item.artist.name
                : 'Unknown Artist'

            const image =
              isRecord(item.album)
                ? (typeof item.album.cover_medium === 'string' && item.album.cover_medium) ||
                  (typeof item.album.cover_big === 'string' && item.album.cover_big) ||
                  (typeof item.album.cover === 'string' && item.album.cover) ||
                  undefined
                : undefined

            const album =
              isRecord(item.album) && typeof item.album.title === 'string' && item.album.title.trim()
                ? item.album.title
                : 'Unknown Album'

            const duration = typeof item.duration === 'number' ? item.duration : 0

              const trackData: Track = {
                id,
                name,
                artist,
                image,
                preview_url: preview,
                audioUrl: preview,
                album,
                duration,
              }
              allTracksData.push(trackData)
          })
        }
        
        await new Promise(resolve => setTimeout(resolve, 300))
      } catch (fetchError) {
        console.error(`Error fetching track "${query}":`, fetchError)
      }
    }
    
    if (allTracksData.length > 0) {
      dispatch(setTracks(allTracksData))
    } else {
      dispatch(setTracks(fallbackTracks))
    }
  } catch (error) {
    console.error('Error fetching tracks:', error)
    dispatch(setError('Failed to load tracks'))
    dispatch(setTracks(fallbackTracks))
  }
}

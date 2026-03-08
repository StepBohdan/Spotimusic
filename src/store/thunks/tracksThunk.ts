import type { AppDispatch } from '../index'
import { setTracks, setLoading, setError } from '../slices/tracksSlice'
import type { Track } from '../../types/music'

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null

export const fetchTracks = () => async (dispatch: AppDispatch) => {
  const fallbackTracks: Track[] = [
    { id: 1, name: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours' },
    { id: 2, name: 'Shape of You', artist: 'Ed Sheeran', album: '÷ (Divide)' },
    { id: 3, name: 'Someone You Loved', artist: 'Lewis Capaldi', album: 'Divinely Uninspired To a Hellish Extent' },
    { id: 4, name: 'Watermelon Sugar', artist: 'Harry Styles', album: 'Fine Line' },
    { id: 5, name: 'Bad Guy', artist: 'Billie Eilish', album: 'When We All Fall Asleep, Where Do We Go?' },
    { id: 6, name: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia' },
    { id: 7, name: 'Good 4 U', artist: 'Olivia Rodrigo', album: 'SOUR' },
    { id: 8, name: 'Stay', artist: 'The Kid LAROI & Justin Bieber', album: 'F*CK LOVE 3' },
    { id: 9, name: 'Heat Waves', artist: 'Glass Animals', album: 'Dreamland' },
    { id: 10, name: 'As It Was', artist: 'Harry Styles', album: "Harry's House" },
    { id: 11, name: 'Flowers', artist: 'Miley Cyrus', album: 'Endless Summer Vacation' },
    { id: 12, name: 'Unholy', artist: 'Sam Smith & Kim Petras', album: 'Gloria' },
    { id: 13, name: 'Anti-Hero', artist: 'Taylor Swift', album: 'Midnights' },
    { id: 14, name: 'Calm Down', artist: 'Rema & Selena Gomez', album: 'Rave & Roses' },
    { id: 15, name: 'Creepin', artist: 'Metro Boomin, The Weeknd & 21 Savage', album: 'Heroes & Villains' },
  ]

  try {
    dispatch(setLoading(true))

    const rapidApiKey = process.env.EXPO_PUBLIC_RAPIDAPI_KEY

    // If no API key, use fallback tracks immediately
    if (!rapidApiKey) {
      console.log('No RapidAPI key found, using fallback tracks')
      dispatch(setTracks(fallbackTracks))
      dispatch(setLoading(false))
      return
    }

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
    let failedRequests = 0
    const maxFailedRequests = 5 // Stop after 5 consecutive failures

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
          failedRequests++
          if (response.status === 429 || response.status === 401) {
            console.warn(`API error for query "${query}": ${response.status}`)
            // If too many failures, stop trying and use fallback
            if (failedRequests >= maxFailedRequests) {
              console.log('Too many API failures, switching to fallback tracks')
              break
            }
            continue
          }
          console.warn(`Error fetching track "${query}": ${response.status}`)
          continue
        }

        // Reset failed counter on success
        failedRequests = 0

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
      dispatch(setLoading(false))
    } else {
      console.log('No tracks fetched from API, using fallback tracks')
      dispatch(setTracks(fallbackTracks))
      dispatch(setLoading(false))
    }
  } catch (error) {
    console.error('Error fetching tracks:', error)
    dispatch(setError('Failed to load tracks from API. Using fallback tracks.'))
    dispatch(setTracks(fallbackTracks))
    dispatch(setLoading(false))
  }
}

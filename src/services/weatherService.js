/**
 * Weather Service usando a API aberta e gratuita Open-Meteo.
 * Não requer chave de API nem cartão de crédito.
 * Endpoint público: https://api.open-meteo.com/v1/forecast
 */

// Coordenadas padrão (São Paulo - SP), mas pode usar geolocalização do navegador
export const DEFAULT_LOCATION = {
  name: 'São Paulo, SP',
  latitude: -23.5505,
  longitude: -46.6333,
}

export async function fetchWeatherForecast(lat = DEFAULT_LOCATION.latitude, lon = DEFAULT_LOCATION.longitude) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,windgusts_10m_max&timezone=auto`
    const res = await fetch(url)
    if (!res.ok) throw new Error('Falha ao obter dados meteorológicos')
    const data = await res.json()
    return parseWeatherData(data)
  } catch (err) {
    console.warn('Erro ao carregar previsão do tempo:', err)
    return []
  }
}

// Converte códigos meteorológicos da WMO em alertas preventivos domésticos
function parseWeatherData(data) {
  if (!data || !data.daily || !data.daily.time) return []

  const {
    time,
    weathercode,
    temperature_2m_max,
    temperature_2m_min,
    precipitation_sum,
    precipitation_probability_max,
    windgusts_10m_max,
  } = data.daily

  return time.map((dateStr, i) => {
    const code = weathercode[i]
    const precip = precipitation_sum[i] || 0
    const rainProb = precipitation_probability_max[i] || 0
    const wind = windgusts_10m_max[i] || 0
    const tMin = temperature_2m_min[i]
    const tMax = temperature_2m_max[i]

    let alert = null

    // Detecção de tempestades / raios (códigos 95, 96, 99)
    if (code >= 95) {
      alert = {
        type: 'danger',
        icon: '⚡',
        title: 'Alerta de Tempestade & Raios',
        description: 'Risco de descargas elétricas e oscilação de energia. Desconecte eletrodomésticos sensíveis da tomada.',
      }
    }
    // Chuva torrencial ou acúmulo severo (> 25mm ou probabilidade alta com chuva forte)
    else if (precip > 25 || (code >= 65 && code <= 82)) {
      alert = {
        type: 'warning',
        icon: '🌧️',
        title: 'Alerta de Chuva Intensa',
        description: 'Chuva volumosa prevista. Verifique calhas, ralos externos e vedação de janelas para evitar infiltração.',
      }
    }
    // Rajadas de vento forte (> 50 km/h)
    else if (wind > 50) {
      alert = {
        type: 'warning',
        icon: '💨',
        title: 'Alerta de Rajadas de Vento',
        description: `Ventos de até ${Math.round(wind)} km/h. Verifique fixação de telhas, portões e recolha objetos soltos no quintal.`,
      }
    }
    // Onda de frio brusco (< 12°C no Brasil)
    else if (tMin < 13) {
      alert = {
        type: 'info',
        icon: '🥶',
        title: 'Queda de Temperatura',
        description: 'Madrugada fria. Cuidado com sobrecarga na fiação se usar chuveiro no máximo e aquecedores ao mesmo tempo.',
      }
    }

    return {
      date: dateStr, // YYYY-MM-DD
      tMin: Math.round(tMin),
      tMax: Math.round(tMax),
      precip,
      rainProb,
      wind: Math.round(wind),
      alert,
    }
  })
}

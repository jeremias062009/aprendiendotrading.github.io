import { db } from './db';
import { ebooks, tutorials, aiStrategies, marketData } from '@shared/schema';

async function seedDatabase() {
  try {
    console.log('Seeding database with demo data...');

    // Seed eBooks
    const demoEbooks = [
      {
        title: 'Fundamentos del Trading',
        description: 'Aprende los conceptos básicos del trading de criptomonedas, desde qué son las velas japonesas hasta cómo leer gráficos y entender tendencias de mercado.',
        content: {
          chapters: [
            {
              title: 'Introducción al Trading',
              content: 'El trading es el arte de comprar y vender activos financieros...'
            },
            {
              title: 'Velas Japonesas',
              content: 'Las velas japonesas son una forma de representar el precio...'
            }
          ]
        },
        chapters: 8,
        duration: '4h',
        category: 'basics',
        imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
        isPublished: true,
      },
      {
        title: 'Análisis Técnico Avanzado',
        description: 'Domina los indicadores técnicos como RSI, MACD, Bandas de Bollinger y fibonacci. Aprende a identificar patrones y predecir movimientos de precio.',
        content: {
          chapters: [
            {
              title: 'Indicadores de Momentum',
              content: 'Los indicadores de momentum nos ayudan a medir la fuerza...'
            },
            {
              title: 'Fibonacci en Trading',
              content: 'Los niveles de Fibonacci son una herramienta poderosa...'
            }
          ]
        },
        chapters: 12,
        duration: '6h',
        category: 'intermediate',
        imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
        isPublished: true,
      },
      {
        title: 'Estrategias de Riesgo y Gestión',
        description: 'Aprende a gestionar tu capital, establecer stop loss, take profit y desarrollar un plan de trading disciplinado para maximizar ganancias y minimizar pérdidas.',
        content: {
          chapters: [
            {
              title: 'Gestión de Capital',
              content: 'La gestión de capital es la base de todo trading exitoso...'
            }
          ]
        },
        chapters: 6,
        duration: '3h',
        category: 'advanced',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
        isPublished: true,
      },
    ];

    for (const ebook of demoEbooks) {
      await db.insert(ebooks).values(ebook);
    }

    // Seed tutorials
    const demoTutorials = [
      {
        title: 'Cómo registrarse en Binance',
        description: 'Tutorial paso a paso para crear tu cuenta en Binance, verificar tu identidad y realizar tu primer depósito de forma segura.',
        platform: 'binance',
        content: {
          steps: [
            'Visita binance.com',
            'Haz clic en "Registrarse"',
            'Completa el formulario con tu email y contraseña',
            'Verifica tu email',
            'Completa la verificación KYC'
          ]
        },
        steps: [
          { step: 1, title: 'Registro inicial', description: 'Crear cuenta con email' },
          { step: 2, title: 'Verificación', description: 'Completar KYC' },
          { step: 3, title: 'Primer depósito', description: 'Añadir fondos' }
        ],
        videoUrl: '',
        imageUrl: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
        isPublished: true,
      },
      {
        title: 'Trading en Binance: Guía Completa',
        description: 'Aprende a usar la interfaz de trading de Binance, colocar órdenes, leer gráficos y usar herramientas de análisis técnico integradas.',
        platform: 'binance',
        content: {
          steps: [
            'Navegar a Binance Pro',
            'Seleccionar par de trading',
            'Entender la interfaz',
            'Colocar órdenes',
            'Monitorear posiciones'
          ]
        },
        steps: [
          { step: 1, title: 'Interfaz de trading', description: 'Conocer los elementos' },
          { step: 2, title: 'Tipos de órdenes', description: 'Market, Limit, Stop' },
          { step: 3, title: 'Gestión de posiciones', description: 'Monitoreo activo' }
        ],
        videoUrl: '',
        imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
        isPublished: true,
      },
      {
        title: 'Primeros pasos en BingX',
        description: 'Tutorial completo para empezar en BingX: registro, copy trading, herramientas sociales y configuración de tu primera estrategia automatizada.',
        platform: 'bingx',
        content: {
          steps: [
            'Registro en BingX',
            'Explorar copy trading',
            'Configurar perfil',
            'Primera inversión',
            'Seguimiento de traders'
          ]
        },
        steps: [
          { step: 1, title: 'Registro', description: 'Crear cuenta BingX' },
          { step: 2, title: 'Copy Trading', description: 'Seleccionar traders' },
          { step: 3, title: 'Estrategias', description: 'Configurar automatización' }
        ],
        videoUrl: '',
        imageUrl: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
        isPublished: true,
      },
    ];

    for (const tutorial of demoTutorials) {
      await db.insert(tutorials).values(tutorial);
    }

    // Seed market data
    const demoMarketData = [
      {
        symbol: 'BTCUSDT',
        price: '65247.50',
        changePercent: '2.45',
        volume: '18456789.23',
        high24h: '66500.00',
        low24h: '63890.25',
      },
      {
        symbol: 'ETHUSDT',
        price: '3421.75',
        changePercent: '1.85',
        volume: '9876543.21',
        high24h: '3487.50',
        low24h: '3365.90',
      },
      {
        symbol: 'BNBUSDT',
        price: '589.32',
        changePercent: '3.12',
        volume: '4567890.15',
        high24h: '598.75',
        low24h: '571.25',
      },
      {
        symbol: 'ADAUSDT',
        price: '0.4567',
        changePercent: '-1.23',
        volume: '2345678.90',
        high24h: '0.4698',
        low24h: '0.4456',
      },
      {
        symbol: 'DOGEUSDT',
        price: '0.1234',
        changePercent: '4.56',
        volume: '8765432.10',
        high24h: '0.1289',
        low24h: '0.1187',
      },
      {
        symbol: 'DOTUSDT',
        price: '7.89',
        changePercent: '0.75',
        volume: '1234567.89',
        high24h: '8.12',
        low24h: '7.65',
      },
    ];

    for (const data of demoMarketData) {
      await db.insert(marketData).values(data);
    }

    // Seed AI strategies
    const demoStrategies = [
      {
        name: 'Bitcoin Bullish Momentum',
        description: 'Análisis técnico indica una fuerte tendencia alcista en Bitcoin con RSI en niveles saludables y MACD mostrando divergencia positiva.',
        symbol: 'BTCUSDT',
        signal: 'BUY',
        confidence: '87.5',
        analysis: {
          technicalIndicators: {
            rsi: 65.2,
            macd: 'bullish',
            trend: 'uptrend'
          },
          priceTargets: {
            support: 63500,
            resistance: 68000
          },
          summary: 'Condiciones técnicas favorables para entrada en largo'
        },
        isActive: true,
      },
      {
        name: 'Ethereum Consolidation Phase',
        description: 'ETH muestra señales de consolidación lateral con posible ruptura alcista en las próximas sesiones según patrones de volumen.',
        symbol: 'ETHUSDT',
        signal: 'HOLD',
        confidence: '72.3',
        analysis: {
          technicalIndicators: {
            rsi: 58.7,
            macd: 'neutral',
            trend: 'sideways'
          },
          priceTargets: {
            support: 3350,
            resistance: 3500
          },
          summary: 'Esperando confirmación de ruptura direccional'
        },
        isActive: true,
      },
      {
        name: 'ADA Correction Signal',
        description: 'Cardano presenta signos de debilidad técnica con volumen decreciente y divergencia bajista en indicadores de momentum.',
        symbol: 'ADAUSDT',
        signal: 'SELL',
        confidence: '79.1',
        analysis: {
          technicalIndicators: {
            rsi: 34.8,
            macd: 'bearish',
            trend: 'downtrend'
          },
          priceTargets: {
            support: 0.42,
            resistance: 0.47
          },
          summary: 'Presión vendedora persistente con objetivos a la baja'
        },
        isActive: true,
      },
    ];

    for (const strategy of demoStrategies) {
      await db.insert(aiStrategies).values(strategy);
    }

    console.log('✅ Database seeded successfully with demo data!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run the seed function if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log('Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

export { seedDatabase };
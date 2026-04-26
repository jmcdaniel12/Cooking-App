import dynamic from 'next/dynamic'

const App = dynamic(() => import('@/components/App'), {
  ssr: false,
  loading: () => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: '#FAF8F3',
      fontFamily: 'system-ui',
      color: '#A89E93',
      fontSize: '14px',
    }}>
      Loading…
    </div>
  ),
})

export default function Home() {
  return <App />
}

import { Dashboard } from '@/components/kaali/dashboard'
import { KaaliProvider } from '@/components/kaali/store'

export default function Page() {
  return (
    <KaaliProvider>
      <Dashboard />
    </KaaliProvider>
  )
}

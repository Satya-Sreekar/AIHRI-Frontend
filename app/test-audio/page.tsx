import TestAudioDebug from '@/src/test-audio-debug'
import TestTTSEndpoint from '@/src/test-tts-endpoint'
import TestBackendEndpoints from '@/src/test-backend-endpoints'

export default function TestAudioPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Audio System Tests</h1>
        
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">1. Backend Endpoints Test</h2>
            <TestBackendEndpoints />
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">2. TTS Endpoint Test</h2>
            <TestTTSEndpoint />
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">3. Audio Debug Test</h2>
            <TestAudioDebug />
          </div>
        </div>
      </div>
    </div>
  )
}

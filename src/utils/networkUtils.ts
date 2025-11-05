/**
 * Network utilities for detecting local IP address
 */

export async function getLocalIPAddress(): Promise<string | null> {
  try {
    // Try to get IP from RTCPeerConnection (WebRTC)
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    })
    
    return new Promise((resolve) => {
      const candidates: string[] = []
      
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          const candidate = event.candidate.candidate
          const match = candidate.match(/([0-9]{1,3}(\.[0-9]{1,3}){3})/)
          if (match && match[1]) {
            const ip = match[1]
            // Filter out localhost and public IPs
            if (ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
              if (!candidates.includes(ip)) {
                candidates.push(ip)
              }
            }
          }
        } else {
          // No more candidates
          pc.close()
          resolve(candidates[0] || null)
        }
      }
      
      // Create a dummy data channel to trigger candidate gathering
      pc.createDataChannel('')
      pc.createOffer().then(offer => pc.setLocalDescription(offer))
      
      // Timeout after 3 seconds
      setTimeout(() => {
        pc.close()
        resolve(candidates[0] || null)
      }, 3000)
    })
  } catch (error) {
    console.error('Error getting local IP:', error)
    return null
  }
}

export function getNetworkURL(): string {
  const origin = window.location.origin
  const port = window.location.port || '3002'
  
  // If already using network IP, return it
  if (!origin.includes('localhost') && !origin.includes('127.0.0.1')) {
    return origin
  }
  
  // Try to get from localStorage first
  const savedIP = localStorage.getItem('mqt-network-ip')
  if (savedIP) {
    return `http://${savedIP}:${port}`
  }
  
  // Return localhost as fallback
  return origin
}

export function saveNetworkIP(ip: string): void {
  localStorage.setItem('mqt-network-ip', ip)
}

export function getNetworkIP(): string | null {
  return localStorage.getItem('mqt-network-ip')
}



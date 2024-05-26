interface TokenInfo {
  token: string
  expiresAt: Date
}

let issuedTokens: TokenInfo[] = []

export const addToken = (token: string, expiresAt: Date) => {
  issuedTokens.push({ token, expiresAt })
}

export const checkExpiredTokens = () => {
  const now = new Date()
  issuedTokens.forEach((tokenInfo) => {
    if (tokenInfo.expiresAt <= now) {
      console.log(`User session expired at: ${tokenInfo.expiresAt}`)
    }
  })
  // Remove expired tokens from the array
  issuedTokens = issuedTokens.filter((tokenInfo) => tokenInfo.expiresAt > now)
}

export const betPsCs = (payload) => {
  return `query($orderBy: BigInt, $orderDirection: String) {
    betCs(where: {user: "${payload.userAddress}", status: "${payload.status}"}, first: 100, orderBy: $orderBy, orderDirection: $orderDirection) {
      amount
      epoch
      blockNumber
      placePrice
      blockTimestamp
      pnl
      rate
      settledPrice
      symbol
      status
      transactionHash
      user
    }
    betPs(where: {user: "${payload.userAddress}", status: "${payload.status}"} , first: 100, orderBy: $orderBy, orderDirection: $orderDirection) {
      amount
      epoch
      blockNumber
      placePrice
      blockTimestamp
      pnl
      rate
      settledPrice
      symbol
      status
      transactionHash
      user
    }
  }`
}
export const betCs = (payload) => {
  return `
    query($orderBy: BigInt, $orderDirection: String) {
      betCs(where: {user: "${payload.userAddress}", status: "${payload.status}"}, first: 100, orderBy: $orderBy, orderDirection: $orderDirection) {
        amount
        epoch
        blockNumber
        placePrice
        blockTimestamp
        pnl
        rate
        settledPrice
        symbol
        status
        transactionHash
        user
      }
    }`
}
export const betPs = (payload) => {
  return `query($orderBy: BigInt, $orderDirection: String) {
    betPs(where: {user: "${payload.userAddress}", status: "${payload.status}"} , first: 100, orderBy: $orderBy, orderDirection: $orderDirection) {
      amount
      epoch
      blockNumber
      placePrice
      blockTimestamp
      pnl
      rate
      settledPrice
      symbol
      status
      transactionHash
      user
    }
  }`
}



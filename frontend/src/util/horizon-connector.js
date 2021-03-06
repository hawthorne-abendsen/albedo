import {Server} from 'stellar-sdk'
import {resolveNetworkParams} from './network-resolver'

/**
 *
 * @param {String} [network]
 * @param {String} [horizon]
 * @return {Server}
 */
function createHorizon({network, horizon}) {
    const {horizon: selectedHorizon} = resolveNetworkParams({network, horizon})
    return new Server(selectedHorizon)
}

export {createHorizon}
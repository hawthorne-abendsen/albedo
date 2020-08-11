import appSettings from '../state/app-settings'
import {Networks} from 'stellar-sdk'

/**
 * Resolve Stellar network identifier based on the intent settings.
 * @param {String} [network] - Stellar network id or passphrase.
 * @param {String} [horizon] - Horizon server URL (optional for predefined networks).
 * @return {{network: String, horizon: String, networkName: String}}
 */
function resolveNetworkParams({network, horizon}) {
    let selectedNetwork,
        networkName,
        selectedHorizon = horizon
    if (!network) {
        //no network provided - use pubnet settings by default
        network = networkName = 'public'
    }
    //try to find matching predefined network passphrase
    for (const key of Object.keys(Networks)) {
        if (Networks[key] === network) {
            network = networkName = key.toLowerCase()
            break
        }
    }
    //try to fetch network details from the app config by name (predefined are "public" and "testnet")
    const networkSettings = appSettings.networks[network.toLowerCase()]
    if (networkSettings) {
        networkName = network
        //use passphrase from predefined networks
        selectedNetwork = Networks[network.toUpperCase()]
        if (!horizon) {
            //use predefined Horizon URL if none was provided
            selectedHorizon = networkSettings.horizon
        }
    } else {
        //we assume that a client provided network passphrase instead of network identifier - use it as is
        selectedNetwork = network
        //in this case, a client should provide the horizon endpoint explicitly
        if (!selectedHorizon) throw new Error(`No Horizon server endpoint provided with custom network "${network}".`)
        networkName = 'private network'
    }

    return {
        network: selectedNetwork,
        horizon: selectedHorizon,
        networkName
    }
}

function isTestnet({network = 'public'}) {
    return network.toLowerCase() === 'testnet' || network === Networks.TESTNET
}

export {resolveNetworkParams, isTestnet}


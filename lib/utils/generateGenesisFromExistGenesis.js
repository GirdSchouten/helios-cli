const generateGenesisFromExistGenesis = async (genesis, tinyGenesis) => {
    const genesis_json = JSON.parse(genesis);

    genesis_json.app_state.slashing.signing_infos = [];
    genesis_json.app_state.slashing.missed_blocks = [];
    ///////////////////////////////////////////////////////////////////////////////////
    genesis_json.app_state.staking.last_total_power = "1000000000000";
    genesis_json.app_state.staking.last_validator_powers = [];
    ///////////////////////////////////////////////////////////////////////////////////

    // let savedStakingValidator = genesis_json.app_state.staking.validators.find(x => x.operator_address === "heliosvaloper13qhc492qnsf87r08h2pmfhaqp9krmrtewzuy73");
    // savedStakingValidator.tokens = "1000000000000";
    // savedStakingValidator.delegator_shares = "1000000000000";
    // savedStakingValidator.unbonding_ids = [];
    // genesis_json.app_state.staking.validators = [savedStakingValidator];

    // Add boost balances back to the delegator
    let delegationBoosts = genesis_json.app_state.staking.delegation_boosts;
    delegationBoosts.forEach(delegation_boost => {

        const balance = genesis_json.app_state.bank.balances.find(x => x.address === delegation_boost.delegator_address);
        if (balance) {
            const aheliosBalance = balance.coins.find(x => x.denom === "ahelios");
            if (aheliosBalance) {
                aheliosBalance.amount = (new Decimal(aheliosBalance.amount)).plus(new Decimal(delegation_boost.amount)).toFixed(0);
            } else {
                balance.coins.push({
                    denom: "ahelios",
                    amount: delegation_boost.amount
                });
            }
        } else {
            genesis_json.app_state.bank.balances.push({
                address: delegation_boost.delegator_address,
                coins: [{ denom: "ahelios", amount: delegation_boost.amount }]
            });
        }
    });

    // todo remove the delegation_boosts that are marked to be removed
    genesis_json.app_state.staking.delegation_boosts = [];

    // add the delegation to the balance of the delegator
    genesis_json.app_state.staking.delegations.forEach(delegation => {
        const balance = genesis_json.app_state.bank.balances.find(x => x.address === delegation.delegator_address);
        if (balance) {
            delegation.asset_weights.forEach(asset_weight => {
                const existingAssetWeight = balance.coins.find(x => x.denom === asset_weight.denom);
                if (!existingAssetWeight) {
                    balance.coins.push({
                        denom: asset_weight.denom,
                        amount: asset_weight.base_amount
                    });
                } else {
                    existingAssetWeight.amount = (new Decimal(existingAssetWeight.amount)).plus(new Decimal(asset_weight.base_amount)).toFixed(0);
                }
            });
        } else {
            genesis_json.app_state.bank.balances.push({
                address: delegation.delegator_address,
                coins: delegation.asset_weights.map(asset_weight => ({
                    denom: asset_weight.denom,
                    amount: asset_weight.base_amount
                }))
            });
        }
    });

    // sort by denom (cosmos-sdk obligation)
    genesis_json.app_state.bank.balances.forEach(x => {
        x.coins.sort((a, b) => {
            if (a.denom < b.denom) return -1;
            if (a.denom > b.denom) return 1;
            return 0;
        });
        return x;
    })

    genesis_json.app_state.staking.validators = [];
    genesis_json.app_state.staking.delegations = [];

    genesis_json.app_state.bank.balances = genesis_json.app_state.bank.balances.map(balance => {
        if (balance.address === "helios1jv65s3grqf6v6jl3dp4t6c9t9rk99cd8nte205") { // distribution module
            balance.coins = []
        }
        if (balance.address === "helios1fl48vsnmsdzcv85q5d2q4z5ajdha8yu3p05elu") { // staking pool
            balance.coins = []
        }
        if (balance.address === "helios13c59hc2zmcrzzxfgh0umpf077cz86pytvzxda6") { // boosted pool
            balance.coins = []
        }
        return balance;
    });

    genesis_json.app_state.hyperion.sub_states = genesis_json.app_state.hyperion.sub_states.map(x => {
        if (x.batches.length > 0) {
            x.batches = [];
        }
        if (x.unbatched_transfers.length > 0) {
            x.unbatched_transfers = [];
        }
        if (x.batch_confirms.length > 0) {
            x.batch_confirms = [];
        }
        return x;
    })

    genesis_json.consensus.validators = [];

    //bank
    //erc20
    //auth.accounts
    //hyperion
    // let tiny_genesis = fs.readFileSync('tiny_genesis.json', 'utf8').toString();

    const tiny_genesis_json = JSON.parse(tinyGenesis);

    tiny_genesis_json.initial_height = genesis_json.initial_height;
    tiny_genesis_json.app_state.bank = genesis_json.app_state.bank;
    tiny_genesis_json.app_state.erc20 = genesis_json.app_state.erc20;
    tiny_genesis_json.app_state.auth.accounts = genesis_json.app_state.auth.accounts.map(x => {
        if (x.base_account.address === "helios13qhc492qnsf87r08h2pmfhaqp9krmrteeq2ge9") {
            x.base_account.sequence = "0";
        }
        if (x.permissions != undefined && x.permissions.includes("burner") && x.permissions.includes("staking")) {
            tiny_genesis_json.app_state.bank.balances = tiny_genesis_json.app_state.bank.balances.map(balance => {
                if (x.base_account.address === balance.address) {
                    balance.coins = [];
                }
                return balance;
            });
        }
        return x;
    });
    tiny_genesis_json.app_state.hyperion = genesis_json.app_state.hyperion;

    return tiny_genesis_json;

    // fs.writeFileSync('tiny_genesis.json', JSON.stringify(tiny_genesis_json, null, 2));

    // fs.writeFileSync('/Users/jeremyguyet/.heliades/config/genesis.json', JSON.stringify(tiny_genesis_json, null, 2));

    // ['application.db', 'blockstore.db', 'state.db', 'tx_index.db', 'snapshots', 'cs.wal', 'evidence.db'].forEach(file => {
    //     fs.rmSync(`/Users/jeremyguyet/.heliades/data/${file}`, { force: true, recursive: true });
    // });
    // ['gentx'].forEach(file => {
    //     fs.rmSync(`/Users/jeremyguyet/.heliades/config/${file}`, { force: true, recursive: true });
    // });

    // fs.writeFileSync('/Users/jeremyguyet/.heliades/data/priv_validator_state.json', JSON.stringify({
    //     height: genesis_json.initial_height.toFixed(0),
    //     round: 0,
    //     step: 0
    // }, null, 2));
}

module.exports = generateGenesisFromExistGenesis;
var ip = require('ip');
var fs = require('fs');
const localhost = ip.address()
fs.writeFile('../ContractClient/getip.json', JSON.stringify({ localhost }), () => true)

const path = require('path')
const contracts = path.resolve(__dirname, '../dappchain/build/contracts/');
const bin = path.resolve(__dirname, '../dappchain/build/bin');

if (!fs.existsSync(bin)){
    fs.mkdirSync(bin);
}

let builtContracts = fs.readdirSync(contracts);
builtContracts.forEach(contract => {
    let json = JSON.parse(fs.readFileSync(path.resolve(contracts, contract)));
    if(json.networks["default"]) {
        fs.writeFileSync(path.resolve(bin, contract), JSON.stringify({abi: json.abi, address: json.networks["default"]["address"]}));
    }
});
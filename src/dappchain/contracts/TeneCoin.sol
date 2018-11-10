pragma solidity ^0.4.23;

import "../node_modules/zeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import "../node_modules/zeppelin-solidity/contracts/token/ERC20/MintableToken.sol";
import "./AccessMint.sol";
import "../node_modules/zeppelin-solidity/contracts/token/ERC20/BurnableToken.sol";

/**
 * @title TeneCoin
 * @dev Allows user deposit and withdraw ETH
 */
contract TeneCoin is StandardToken, AccessMint, MintableToken, BurnableToken {
    
    string public name;
    string public symbol;
    uint8 public decimals = 18;

    mapping(address => address) public sideAddressToMainAddress;
    event Mint(address indexed to, uint256 amount);
    event Earn(address indexed to, uint256 amount);
    
    constructor(
        uint256 initialSupply,
        string tokenName,
        string tokenSymbol
    ) public payable {
        totalSupply_ = initialSupply * 10 ** uint256(decimals); // Update total supply with the decimal amount
        balances[msg.sender] = totalSupply_;                    // Give the creator all initial tokens
        name = tokenName;                                       // Set the name for display purposes
        symbol = tokenSymbol;                                   // Set the symbol for display purposes
    }

    /**
    * @dev Burns a specific amount of tokens.
    * @dev Trigger when user withdraw ETH from tokens.
    * @param _from The address that will lose the burned tokens.
    * @param _value The amount of token to be burned.
    */
    function burnFrom(address _from, uint256 _value) public onlyOwner {
        _burn(_from, _value);
    }

    /**
     * @dev Give mainAddress permission to withdraw tokens from sideAddress
     * @param mainAddress address
     */
    function setMainAddress(address mainAddress) public {
        sideAddressToMainAddress[msg.sender] = mainAddress;
    }

    // @dev Mint tokens with _amount to the address.
    function earn(address _to, uint256 _amount) 
        onlyAccessMint
        public
        returns (bool)
    {
        require( balances[msg.sender] >= _amount);
        balances[_to] = balances[_to].add(_amount);
        balances[msg.sender] = balances[msg.sender].sub(_amount);
        emit Earn(_to, _amount);
        emit Transfer(msg.sender, _to, _amount);
        return true;
    }

}
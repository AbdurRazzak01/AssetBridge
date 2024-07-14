// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LinkItToken is ERC20, Ownable {
    uint8 private _customDecimals;

    constructor(string memory _name, string memory _symbol, uint8 _decimals, address initialOwner) ERC20(_name, _symbol) Ownable(initialOwner) {
        _customDecimals = _decimals;
        _mint(msg.sender, 1000000 * 10 ** uint256(_decimals));
    }

    function decimals() public view virtual override returns (uint8) {
        return _customDecimals;
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
    }
}

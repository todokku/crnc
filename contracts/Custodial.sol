pragma solidity ^0.4.23;

/**
 * @title Custodial
 * @dev The Custodial contract has an custodian address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Custodial {
    address public custodian;

    event CustodyRenounced(address indexed previousCustodian);
    event CustodyTransferred(
      address indexed previousCustodian,
      address indexed newCustodian
    );

    /**
    * @param _custodian The address that will have rights to pause and unpause the implementing token
    */
    constructor(address _custodian) internal {
        custodian = _custodian;
    }

    /**
    * @dev Throws if called by any account other than the custodian.
    */
    modifier onlyCustodian() {
        require(msg.sender == custodian);
        _;
    }

    /**
    * @dev Allows the current custodian to relinquish custody of the contract.
    */
    function renounceCustody() public onlyCustodian {
        emit CustodyRenounced(custodian);
        custodian = address(0);
    }

    /**
    * @dev Allows the current owner to transfer control of the contract to a custodian.
    * @param _newCustodian The address to transfer custody to.
    */
    function transferCustody(address _newCustodian) public onlyCustodian {
        require(_newCustodian != address(0));
        emit CustodyTransferred(custodian, _newCustodian);
        custodian = _newCustodian;
    }
}
